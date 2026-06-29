import asyncio
import json
import logging
import time
import traceback
import uuid
from collections import defaultdict, deque
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import delete, select

from app.config import settings
from app.database import async_session, create_all_tables
from app.models.cache import ContentCache
from app.models.session import ChatSession
from app.prompts.country_page import SYSTEM_PROMPT_TEMPLATE
from app.services.gemini import (
    GeminiTimeoutError,
    GeminiParseError,
    GeminiServiceError,
    generate_structured_json_async,
)
from app.services.currency import close_http_client
from app.routers.visa_pages import router as visa_pages_router
from app.routers.country_pages import router as country_pages_router, run_pipeline_subprocess
from app.routers.visa_finder import router as visa_finder_router
from app.routers.budget import router as budget_router
from app.routers.checklist import router as checklist_router
from app.routers.chatbot import router as chatbot_router


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("app.main")


# ---------------------------------------------------------------------------
# Rate limiting — in-memory sliding window, per IP + bucket, no Redis needed
# ---------------------------------------------------------------------------

# {"{ip}:{bucket}": deque([timestamp, ...])}
_rate_windows: dict[str, deque] = defaultdict(deque)

# Limits: max requests per 60-second sliding window
_RATE_LIMIT_CHAT = 10    # POST to AI-heavy endpoints (chat, visa-finder, etc.)
_RATE_LIMIT_PAGE = 30    # GET to country/visa detail pages
_RATE_LIMIT_OTHER = 60   # Everything else


def _rl_bucket(request: Request) -> tuple[str, int]:
    """Return (bucket_name, limit) for this request."""
    path = request.url.path
    method = request.method

    if method == "POST":
        # All conversational/AI-heavy write endpoints
        return "chat", _RATE_LIMIT_CHAT

    if method == "GET" and (
        path.startswith("/countries/") or path.startswith("/visas/")
    ):
        return "page", _RATE_LIMIT_PAGE

    return "other", _RATE_LIMIT_OTHER


def _check_rate_limit(request: Request) -> bool:
    """
    Returns True if this request should be blocked (limit exceeded).
    Mutates _rate_windows atomically — safe in asyncio (no await between
    the check and the append, so no other coroutine can interleave).
    """
    client_ip = (
        (request.headers.get("X-Forwarded-For") or "").split(",")[0].strip()
        or (request.client.host if request.client else "unknown")
    )
    bucket, limit = _rl_bucket(request)
    key = f"{client_ip}:{bucket}"
    now = time.monotonic()
    cutoff = now - 60.0

    q = _rate_windows[key]
    while q and q[0] < cutoff:
        q.popleft()

    if len(q) >= limit:
        return True

    q.append(now)
    return False


# ---------------------------------------------------------------------------
# Session cleanup — delete ChatSession rows older than SESSION_TTL_DAYS
# ---------------------------------------------------------------------------

_SESSION_TTL_DAYS = 90


async def _cleanup_old_sessions() -> None:
    cutoff = datetime.now(timezone.utc) - timedelta(days=_SESSION_TTL_DAYS)
    try:
        async with async_session() as db:
            result = await db.execute(
                delete(ChatSession).where(ChatSession.created_at < cutoff)
            )
            await db.commit()
            logger.info(
                f"Session cleanup: removed {result.rowcount} sessions "
                f"older than {_SESSION_TTL_DAYS} days."
            )
    except Exception as exc:
        logger.error(f"Session cleanup failed: {exc}")


async def _cleanup_loop() -> None:
    """Run session cleanup on startup then every 24 hours."""
    while True:
        await _cleanup_old_sessions()
        await asyncio.sleep(24 * 3600)


# ---------------------------------------------------------------------------
# Weekly country update — runs the full pipeline every 7 days
# ---------------------------------------------------------------------------

_WEEKLY_UPDATE_INTERVAL = 7 * 24 * 3600   # 7 days in seconds
_WEEKLY_UPDATE_INITIAL_DELAY = 24 * 3600  # Wait 24 h after startup before first run


async def _weekly_update_loop() -> None:
    """Run the country + visa update pipeline for all 109 countries every 7 days."""
    logger.info(f"Weekly update scheduler: first run in {_WEEKLY_UPDATE_INITIAL_DELAY // 3600}h.")
    await asyncio.sleep(_WEEKLY_UPDATE_INITIAL_DELAY)
    while True:
        logger.info("Weekly update pipeline: starting scheduled run for all countries...")
        try:
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, run_pipeline_subprocess)
            logger.info("Weekly update pipeline: completed successfully.")
        except Exception as exc:
            logger.error(f"Weekly update pipeline: run failed: {exc}")
        await asyncio.sleep(_WEEKLY_UPDATE_INTERVAL)


# ---------------------------------------------------------------------------
# Cache pre-warming — populate ContentCache for top expat destinations
# ---------------------------------------------------------------------------

_PREWARM_SLUGS = [
    "portugal", "spain", "germany", "france", "netherlands",
    "italy", "greece", "thailand", "malaysia", "indonesia",
    "mexico", "costa-rica", "canada", "australia", "new-zealand",
    "united-arab-emirates", "singapore", "japan",
    "united-kingdom", "united-states",
]


async def _prewarm_country(slug: str) -> None:
    cache_key = f"country:{slug}"
    now = datetime.now(timezone.utc)

    # Skip if already cached and still valid
    try:
        async with async_session() as db:
            res = await db.execute(
                select(ContentCache).where(ContentCache.cache_key == cache_key)
            )
            row = res.scalars().first()
            if row and row.expires_at > now:
                logger.info(f"Pre-warm: {slug} already cached, skipping.")
                return
    except Exception as exc:
        logger.warning(f"Pre-warm: cache check failed for {slug}: {exc}")

    country_name = slug.replace("-", " ").title()
    logger.info(f"Pre-warm: generating country profile for {country_name}...")

    try:
        system_prompt = SYSTEM_PROMPT_TEMPLATE.format(country_name=country_name)
        user_prompt = (
            f"Perform the search for the country profile of {country_name} "
            "and generate the structured JSON report."
        )
        raw_data = await generate_structured_json_async(
            system_prompt, user_prompt, enable_search_grounding=True
        )
        raw_data["generated_at"] = now.isoformat()

        async with async_session() as db:
            expires_at = now + timedelta(seconds=settings.CACHE_TTL_SECONDS)
            res = await db.execute(
                select(ContentCache).where(ContentCache.cache_key == cache_key)
            )
            row = res.scalars().first()
            if row:
                row.content_json = json.dumps(raw_data)
                row.created_at = now
                row.expires_at = expires_at
            else:
                db.add(ContentCache(
                    cache_key=cache_key,
                    content_json=json.dumps(raw_data),
                    created_at=now,
                    expires_at=expires_at,
                ))
            await db.commit()
            logger.info(f"Pre-warm: cached country profile for {slug}.")
    except Exception as exc:
        logger.error(f"Pre-warm: failed for {slug}: {exc}")


async def _prewarm_cache() -> None:
    """Pre-populate ContentCache for top expat destinations. Runs in background."""
    logger.info(f"Pre-warm: starting for {len(_PREWARM_SLUGS)} countries.")
    for slug in _PREWARM_SLUGS:
        await _prewarm_country(slug)
        await asyncio.sleep(3)  # Pace requests to avoid Gemini rate limits
    logger.info("Pre-warm: complete.")


# ---------------------------------------------------------------------------
# Lifespan — startup tasks
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(_app: FastAPI):
    logger.info("Starting up MyFutureAbroad FastAPI application...")
    try:
        await create_all_tables()
        logger.info("Database tables verified/created successfully.")
    except Exception as exc:
        logger.error(f"Could not automatically initialize database tables: {exc}")

    asyncio.create_task(_cleanup_loop())
    asyncio.create_task(_prewarm_cache())
    asyncio.create_task(_weekly_update_loop())

    yield
    # Shutdown: close shared httpx connection pool
    await close_http_client()
    logger.info("HTTP client closed.")


# ---------------------------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------------------------

app = FastAPI(
    title="MyFutureAbroad Backend",
    description="Standalone FastAPI Backend for MyFutureAbroad AI integrations",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(visa_pages_router)
app.include_router(country_pages_router)
app.include_router(visa_finder_router)
app.include_router(budget_router)
app.include_router(checklist_router)
app.include_router(chatbot_router)


# ---------------------------------------------------------------------------
# Middleware: request ID + rate limiting (combined for clean ordering)
# ---------------------------------------------------------------------------

@app.middleware("http")
async def request_middleware(request: Request, call_next):
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id

    # Skip rate limiting for OPTIONS (CORS preflight) and health checks
    if request.method != "OPTIONS" and request.url.path != "/health":
        if _check_rate_limit(request):
            _, limit = _rl_bucket(request)
            return JSONResponse(
                status_code=429,
                content={
                    "error": True,
                    "message": "Too many requests. Please slow down and try again.",
                    "status_code": 429,
                    "limit": limit,
                    "window_seconds": 60,
                    "request_id": request_id,
                },
                headers={"Retry-After": "60"},
            )

    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response


# ---------------------------------------------------------------------------
# Exception handlers
# ---------------------------------------------------------------------------

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    request_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    tb_str = "".join(traceback.format_exception(type(exc), exc, exc.__traceback__))
    logger.error(f"Unhandled Exception for Request {request_id}: {exc}\n{tb_str}")
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "message": "An unexpected error occurred. Please try again later.",
            "status_code": 500,
            "detail": str(exc),
            "request_id": request_id,
        },
    )


@app.exception_handler(GeminiTimeoutError)
async def gemini_timeout_handler(request: Request, exc: GeminiTimeoutError):
    request_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    logger.error(f"Gemini Timeout for Request {request_id}: {exc}")
    return JSONResponse(
        status_code=504,
        content={
            "error": True,
            "message": "The AI service took too long to respond. Please try again.",
            "status_code": 504,
            "detail": str(exc),
            "request_id": request_id,
        },
    )


@app.exception_handler(GeminiParseError)
async def gemini_parse_handler(request: Request, exc: GeminiParseError):
    request_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    logger.error(f"Gemini Parse Error for Request {request_id}: {exc}\nRaw Text: {exc.raw_text}")
    return JSONResponse(
        status_code=502,
        content={
            "error": True,
            "message": "The AI service returned an unexpected response format.",
            "status_code": 502,
            "detail": str(exc),
            "request_id": request_id,
        },
    )


@app.exception_handler(GeminiServiceError)
async def gemini_service_handler(request: Request, exc: GeminiServiceError):
    request_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    logger.error(f"Gemini Service Error for Request {request_id}: {exc}")
    return JSONResponse(
        status_code=502,
        content={
            "error": True,
            "message": "The AI service is currently unavailable.",
            "status_code": 502,
            "detail": str(exc),
            "request_id": request_id,
        },
    )


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

@app.get("/health")
async def health_check(request: Request):
    request_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    return {
        "status": "ok",
        "time": datetime.now(timezone.utc).isoformat(),
        "request_id": request_id,
    }


@app.get("/test-error")
async def test_error():
    """Simulates a bare exception to verify the global error handler."""
    raise ValueError("Simulated internal server error.")
