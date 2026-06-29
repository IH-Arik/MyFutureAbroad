import re
import uuid
import json
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional
from urllib.parse import urlparse
from fastapi import APIRouter, Depends, HTTPException, Header, Query, Request, BackgroundTasks
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.dependencies import get_db
from app.supported_countries import SUPPORTED_COUNTRY_SLUGS
from app.models.cache import ContentCache
from app.services.gemini import generate_structured_json_async
from app.services.currency import convert_currency, CurrencyServiceError
from app.prompts.country_page import SYSTEM_PROMPT_TEMPLATE
from app.schemas.country import CountryDetailResponse, CountryListResponse

logger = logging.getLogger("app.routers.country_pages")

router = APIRouter(prefix="/countries", tags=["Country Pages"])

# Regex formats for slugs and currencies
SLUG_PATTERN = re.compile(r"^[a-z0-9-]+$")
CURRENCY_PATTERN = re.compile(r"^[A-Z]{3}$")

def validate_slug(slug: str, name: str) -> None:
    if not SLUG_PATTERN.match(slug):
        raise HTTPException(status_code=400, detail=f"Invalid {name} format.")

def slug_to_title(slug: str) -> str:
    # Replace hyphens with spaces and title case
    return slug.replace("-", " ").title()


_OFFICIAL_DOMAIN_RE = re.compile(
    r'\.(gov|gouv|gob|gc\.ca|govt|admin|bund)(\.([a-z]{2}))?$|\.europa\.eu$',
    re.IGNORECASE
)


def _is_official_source(url: Optional[str]) -> bool:
    if not url:
        return False
    try:
        hostname = urlparse(url).hostname or ""
        return bool(_OFFICIAL_DOMAIN_RE.search(hostname))
    except Exception:
        return False


def _is_country_supported(slug: str) -> bool:
    return slug in SUPPORTED_COUNTRY_SLUGS


@router.get("/{country_slug}", response_model=CountryDetailResponse)
async def get_country_details(
    country_slug: str,
    currency: Optional[str] = Query(None, description="Optional ISO 4217 currency code for display conversion."),
    refresh: bool = Query(False, description="Bypass the cache and force fresh generation from AI."),
    db: AsyncSession = Depends(get_db),
    request: Request = None
):
    """
    Returns full structured country expat profile.
    Utilizes localized content caching and stubbed currency exchange values.
    """
    request_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    
    # Normalize slug to lowercase before validation
    country_slug = country_slug.lower()
    
    # 1. Validation Rules
    validate_slug(country_slug, "country slug")
    
    if currency:
        # Strict validation before uppercasing to enforce uppercase requirement
        if not CURRENCY_PATTERN.match(currency):
            raise HTTPException(status_code=400, detail="Currency code must be a 3-letter ISO 4217 code.")
        currency = currency.strip().upper()

    cache_key = f"country:{country_slug}"
    now = datetime.now(timezone.utc)
    
    # Derive human readable title name from slug
    country_name = slug_to_title(country_slug)

    cache_hit = False
    raw_data = None

    # 2. Check localized PostgreSQL database cache
    try:
        if not refresh:
            stmt = select(ContentCache).where(ContentCache.cache_key == cache_key)
            res = await db.execute(stmt)
            cache_row = res.scalars().first()
            
            if cache_row and cache_row.expires_at > now:
                raw_data = json.loads(cache_row.content_json)
                cache_hit = True
                logger.info(f"Cache HIT for country cache key: {cache_key}")
    except Exception as e:
        logger.error(f"Database cache lookup failed: {e}")
        # Proceed to fetch freshly from Gemini if cache lookup fails

    # 3. Cache MISS or refresh required -> Call Gemini Service
    if raw_data is None:
        if not _is_country_supported(country_slug):
            raise HTTPException(status_code=404, detail=f"Country '{country_slug}' is not in the supported countries list.")

        logger.info(f"Cache MISS or forced refresh for country cache key: {cache_key}. Fetching from Gemini...")
        system_prompt = SYSTEM_PROMPT_TEMPLATE.format(country_name=country_name)
        user_prompt = f"Perform the search for the country profile of {country_name} and generate the structured JSON report."

        try:
            raw_data = await generate_structured_json_async(system_prompt, user_prompt, enable_search_grounding=True)
            # Ensure generated_at is set to current time
            raw_data["generated_at"] = now.isoformat()
        except Exception as e:
            logger.error(f"Gemini generation failed for country {country_name}: {e}")
            raise e  # Global exception handlers will intercept and output correct Standard Error Envelopes

        # 4. JSON Schema Validation
        # Verify structure contains key fields before writing to cache
        required_keys = ["country", "country_code", "capital_city", "data_confidence"]
        if not all(k in raw_data for k in required_keys):
            raise HTTPException(status_code=502, detail="The AI service returned an invalid country data structure.")

        # Downgrade confidence if none of the source URLs resolve to a verified official government domain
        source_urls = raw_data.get("source_urls") or []
        if raw_data.get("data_confidence") == "full" and not any(_is_official_source(u) for u in source_urls if u):
            logger.warning(
                f"Downgrading data_confidence to 'partial' for {country_name}: "
                f"none of source_urls {source_urls} resolve to a verified official government domain."
            )
            raw_data["data_confidence"] = "partial"

        # 5. Persist to localized content cache
        try:
            expires_at = now + timedelta(seconds=settings.CACHE_TTL_SECONDS)
            stmt = select(ContentCache).where(ContentCache.cache_key == cache_key)
            res = await db.execute(stmt)
            cache_row = res.scalars().first()
            
            if cache_row:
                cache_row.content_json = json.dumps(raw_data)
                cache_row.created_at = now
                cache_row.expires_at = expires_at
            else:
                cache_row = ContentCache(
                    cache_key=cache_key,
                    content_json=json.dumps(raw_data),
                    created_at=now,
                    expires_at=expires_at
                )
                db.add(cache_row)
            await db.commit()
        except Exception as e:
            await db.rollback()
            logger.error(f"Failed writing cache record for {cache_key}: {e}")
            # Do not block response delivery if database write fails

    # 6. Process currency conversions if requested
    converted_fields = {}
    if currency:
        try:
            converted_rent = await convert_currency(
                raw_data.get("average_monthly_rent_city_centre_1bed_amount"),
                raw_data.get("average_monthly_rent_city_centre_1bed_currency"),
                currency,
            )
            converted_groceries = await convert_currency(
                raw_data.get("monthly_groceries_amount"),
                raw_data.get("monthly_groceries_currency"),
                currency,
            )
            converted_utilities = await convert_currency(
                raw_data.get("monthly_utilities_amount"),
                raw_data.get("monthly_utilities_currency"),
                currency,
            )
            converted_property = await convert_currency(
                raw_data.get("average_property_price_city_centre_per_sqm_amount"),
                raw_data.get("average_property_price_city_centre_per_sqm_currency"),
                currency,
            )
            converted_fields = {
                "converted_rent_amount": converted_rent,
                "converted_groceries_amount": converted_groceries,
                "converted_utilities_amount": converted_utilities,
                "converted_property_price_amount": converted_property,
                "converted_currency": currency,
                "currency_conversion_error": False,
            }
        except CurrencyServiceError as ce:
            logger.warning(f"Currency conversion failed for request: {ce}")
            converted_fields = {
                "currency_conversion_error": True
            }

    # 7. Package and Return direct resource response
    response_payload = {
        "request_id": request_id,
        "cache_hit": cache_hit,
        **raw_data,
        **converted_fields
    }
    if raw_data.get("data_confidence") == "partial":
        response_payload["partial_data_warning"] = True

    return response_payload


@router.get("", response_model=CountryListResponse)
async def list_countries(
    db: AsyncSession = Depends(get_db),
    request: Request = None
):
    """
    Returns a listing of all major expat destination countries.
    """
    request_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    
    cache_key = "countries_list"
    now = datetime.now(timezone.utc)

    cache_hit = False
    list_data = None

    # Check cache
    try:
        stmt = select(ContentCache).where(ContentCache.cache_key == cache_key)
        res = await db.execute(stmt)
        cache_row = res.scalars().first()
        
        if cache_row and cache_row.expires_at > now:
            list_data = json.loads(cache_row.content_json)
            cache_hit = True
            logger.info(f"Cache HIT for countries list cache key: {cache_key}")
    except Exception as e:
        logger.error(f"Database list cache lookup failed: {e}")

    # Generate if cache miss
    if list_data is None:
        logger.info(f"Cache MISS for countries list cache key: {cache_key}. Fetching from Gemini...")
        sys_prompt = (
            "You are a country listing assistant for MyFutureAbroad. Search for all major expat destination countries globally.\n"
            "You must return ONLY a valid JSON object matching the detailed schema described below:\n"
            "{\n"
            "  \"countries\": [\n"
            "    {\n"
            "      \"country\": \"string, full country name\",\n"
            "      \"country_slug\": \"string, the name lowercased with spaces replaced by hyphens\",\n"
            "      \"country_code\": \"string, ISO 3166-1 alpha-2 uppercase\",\n"
            "      \"summary\": \"string, one-sentence plain-English description\",\n"
            "      \"eu_member\": boolean,\n"
            "      \"cost_of_living_index\": number or null,\n"
            "      \"climate_type\": \"string\"\n"
            "    }\n"
            "  ]\n"
            "}\n"
            "Never estimate figures. Return pure JSON only."
        )
        user_prompt = "Generate the list of major expat destination countries."
        
        try:
            list_data = await generate_structured_json_async(sys_prompt, user_prompt, enable_search_grounding=True)
            
            # Robust wrapping if Gemini returns an array directly
            if isinstance(list_data, list):
                list_data = {"countries": list_data}
        except Exception as e:
            logger.error(f"Gemini country listing failed: {e}")
            raise e
            
        # JSON Schema Validation
        if "countries" not in list_data or not isinstance(list_data["countries"], list):
            raise HTTPException(status_code=502, detail="The AI service returned an invalid country list structure.")
            
        # Ensure every item in list contains country, country_slug, and country_code
        for item in list_data["countries"]:
            if "country" not in item or "country_slug" not in item or "country_code" not in item:
                raise HTTPException(status_code=502, detail="The AI service returned an invalid country list structure.")

        # Persist to Cache
        try:
            expires_at = now + timedelta(seconds=settings.CACHE_TTL_SECONDS)
            stmt = select(ContentCache).where(ContentCache.cache_key == cache_key)
            res = await db.execute(stmt)
            cache_row = res.scalars().first()
            
            if cache_row:
                cache_row.content_json = json.dumps(list_data)
                cache_row.created_at = now
                cache_row.expires_at = expires_at
            else:
                cache_row = ContentCache(
                    cache_key=cache_key,
                    content_json=json.dumps(list_data),
                    created_at=now,
                    expires_at=expires_at
                )
                db.add(cache_row)
            await db.commit()
        except Exception as e:
            await db.rollback()
            logger.error(f"Failed writing cache list record for {cache_key}: {e}")

    return {
        "request_id": request_id,
        "cache_hit": cache_hit,
        "countries": list_data.get("countries", [])
    }


def run_pipeline_subprocess(country: Optional[str] = None):
    import subprocess
    import sys
    from pathlib import Path
    
    router_dir = Path(__file__).resolve().parent
    project_root = router_dir.parent.parent.parent
    script_path = project_root / "ai-backend" / "scripts" / "run_monthly_update.py"
    
    cmd = [sys.executable, "-u", str(script_path)]
    if country:
        cmd.append(f"--country={country}")
        
    log_dir = project_root / "ai-backend" / "tmp"
    log_dir.mkdir(exist_ok=True)
    log_file = log_dir / "monthly_update.log"
    
    with open(log_file, "a", encoding="utf-8") as f:
        f.write(f"\n--- Update Pipeline Triggered at {datetime.now()} ---\n")
        f.flush()
        subprocess.run(
            cmd,
            stdout=f,
            stderr=f,
            cwd=str(project_root)
        )


@router.post("/update-pipeline")
async def trigger_update_pipeline(
    background_tasks: BackgroundTasks,
    country: Optional[str] = Query(None, description="ISO code or country name to update (e.g. 'SE' or 'sweden')"),
    authorization: Optional[str] = Header(None),
    request: Request = None
):
    """
    Triggers the weekly country and visa update pipeline in the background.
    Requires Authorization: Bearer <PIPELINE_SECRET_KEY> header.
    """
    request_id = getattr(request.state, "request_id", str(uuid.uuid4()))

    expected = settings.PIPELINE_SECRET_KEY.strip()
    if not expected:
        raise HTTPException(status_code=503, detail="Update pipeline is not configured on this server.")
    provided = (authorization or "").removeprefix("Bearer ").strip()
    if not provided or provided != expected:
        raise HTTPException(status_code=401, detail="Invalid or missing Authorization token.")
    background_tasks.add_task(run_pipeline_subprocess, country)
    
    return {
        "request_id": request_id,
        "status": "triggered",
        "message": f"Update pipeline running in the background. Check logs at tmp/monthly_update.log for progress.",
        "country_filter": country
    }
