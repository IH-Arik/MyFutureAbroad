import time
import asyncio
import json
import logging
import random
import re
import threading
from typing import AsyncGenerator, Generator, List, Dict, Any, Optional
import httpx
from google import genai
from google.genai import types
from google.genai.errors import APIError
from app.config import settings

logger = logging.getLogger("app.services.gemini")


# ── Custom Exceptions ───────────────────────────────────────────────────────────

class GeminiTimeoutError(Exception):
    """Raised when a Gemini API call exceeds the configured timeout."""
    pass

class GeminiParseError(Exception):
    """Raised when Gemini returns malformed JSON that cannot be parsed."""
    def __init__(self, raw_text: str, message: str = "Failed to parse JSON response from AI service."):
        self.raw_text = raw_text
        super().__init__(message)

class GeminiServiceError(Exception):
    """Raised for Gemini API errors, auth failures, safety blocks, quota, or network issues."""
    pass


# ── Client ──────────────────────────────────────────────────────────────────────

_client: Optional[genai.Client] = None

def get_genai_client() -> genai.Client:
    global _client
    if _client is None:
        if not settings.GEMINI_API_KEY:
            raise GeminiServiceError("GEMINI_API_KEY is not set.")
        _client = genai.Client(
            api_key=settings.GEMINI_API_KEY,
            http_options=types.HttpOptions(timeout=settings.GEMINI_TIMEOUT_SECONDS * 1000)
        )
    return _client


# ── Internal error classifier ───────────────────────────────────────────────────

def _raise_from_api_error(err_msg: str) -> None:
    """Converts raw API error strings into typed Gemini exceptions. Always raises."""
    low = err_msg.lower()
    if "quota" in low or "429" in err_msg or "resource_exhausted" in low or "rate_limit" in low:
        raise GeminiServiceError(
            "The AI service is temporarily unavailable due to high demand. Please try again in a few minutes."
        )
    if "503" in err_msg or "unavailable" in low:
        raise GeminiServiceError("The AI service is currently unavailable. Please try again shortly.")
    if "deadline_exceeded" in low or "504" in err_msg:
        raise GeminiTimeoutError("The AI service request exceeded the deadline.")
    if "401" in err_msg or "403" in err_msg or "authentication" in low or "permission" in low:
        raise GeminiServiceError("AI service authentication failed. Check GEMINI_API_KEY.")
    raise GeminiServiceError(f"AI service error: {err_msg[:300]}")


# ── Sync core functions (run inside thread pool — never call directly from async) ─

def generate_chat_stream(
    system_prompt: str,
    messages: List[Dict[str, str]],
    enable_search_grounding: bool = False
) -> Generator[str, None, None]:
    """
    Sync generator — calls Gemini in streaming mode.
    Do NOT call this directly from async code. Use collect_chat_stream_async or stream_chat_sse instead.
    """
    client = get_genai_client()

    contents = [
        types.Content(
            role="model" if msg.get("role") == "assistant" else "user",
            parts=[types.Part.from_text(text=msg.get("content", ""))]
        )
        for msg in messages
    ]

    tools = []
    full_system_prompt = system_prompt
    if enable_search_grounding:
        tools.append(types.Tool(google_search=types.GoogleSearch()))
        full_system_prompt = (
            f"{system_prompt}\n\n"
            "CRITICAL: You MUST respond ONLY with a valid JSON object matching the required shape. "
            "Do NOT include any preamble, conversational commentary, or markdown code blocks. "
            "Your response must start with '{' and end with '}'."
        )

    config = types.GenerateContentConfig(
        system_instruction=full_system_prompt,
        tools=tools if tools else None
    )

    try:
        start_time = time.time()
        timeout_seconds = settings.GEMINI_TIMEOUT_SECONDS

        response_stream = client.models.generate_content_stream(
            model=settings.GEMINI_MODEL,
            contents=contents,
            config=config
        )

        for chunk in response_stream:
            if time.time() - start_time > timeout_seconds:
                raise GeminiTimeoutError("The streaming connection to the AI service timed out.")

            if chunk.candidates:
                finish_reason = getattr(chunk.candidates[0], "finish_reason", None)
                if finish_reason in ("SAFETY", 2):
                    raise GeminiServiceError("The response was blocked by AI service safety filters.")

            if chunk.text:
                yield chunk.text

    except (httpx.TimeoutException, httpx.ConnectTimeout) as e:
        raise GeminiTimeoutError(f"AI service connection timed out: {e}")
    except (GeminiTimeoutError, GeminiServiceError, GeminiParseError):
        raise
    except APIError as e:
        _raise_from_api_error(str(e))
    except Exception as e:
        if isinstance(e, (GeminiTimeoutError, GeminiServiceError, GeminiParseError)):
            raise
        _raise_from_api_error(str(e))


def generate_structured_json(
    system_prompt: str,
    user_prompt: str,
    enable_search_grounding: bool = False,
    max_retries: int = 3
) -> Dict[str, Any]:
    """
    Sync function — calls Gemini for a structured JSON response with retry logic.
    Do NOT call this directly from async code. Use generate_structured_json_async instead.
    time.sleep() here is intentional — this runs inside a thread pool.
    """
    client = get_genai_client()

    tools = []
    if enable_search_grounding:
        tools.append(types.Tool(google_search=types.GoogleSearch()))

    full_system_prompt = (
        f"{system_prompt}\n\n"
        "IMPORTANT: You must respond ONLY with a single valid JSON object. "
        "Do NOT include markdown code blocks, do NOT wrap your response in ```json ... ```, "
        "and do NOT include any preamble or postamble text. Return pure JSON only."
    )
    if enable_search_grounding:
        full_system_prompt += (
            "\nCRITICAL: You MUST respond ONLY with a valid JSON object. "
            "No preamble or commentary outside the JSON."
        )

    config = types.GenerateContentConfig(
        system_instruction=full_system_prompt,
        tools=tools if tools else None,
        response_mime_type="application/json" if not enable_search_grounding else None
    )

    last_exception: Optional[Exception] = None

    for attempt in range(1, max_retries + 1):
        try:
            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=user_prompt,
                config=config
            )

            if response.candidates:
                finish_reason = getattr(response.candidates[0], "finish_reason", None)
                if finish_reason in ("SAFETY", 2):
                    raise GeminiServiceError("The response was blocked by safety filters.")

            raw_text = response.text
            if not raw_text:
                raise GeminiServiceError("AI service returned an empty response.")

            # Strip markdown fences if present
            cleaned = raw_text.strip()
            if cleaned.startswith("```"):
                lines = cleaned.split("\n")
                lines = lines[1:]  # drop opening fence
                if lines and lines[-1].strip().startswith("```"):
                    lines = lines[:-1]  # drop closing fence
                cleaned = "\n".join(lines).strip()

            # Extract first JSON object or array from the text
            match = re.search(r"(\{[\s\S]*\}|\[[\s\S]*\])", cleaned)
            if match:
                cleaned = match.group(1).strip()

            try:
                return json.loads(cleaned, strict=False)
            except json.JSONDecodeError as je:
                logger.error(f"JSON parse failed. Raw response:\n{raw_text}")
                raise GeminiParseError(raw_text, f"Failed to parse JSON response: {je}")

        except (httpx.TimeoutException, httpx.ConnectTimeout) as e:
            raise GeminiTimeoutError(f"AI service connection timed out: {e}")

        except (GeminiServiceError, GeminiParseError, GeminiTimeoutError):
            raise

        except Exception as e:
            err_msg = str(e)
            is_transient = any(k in err_msg for k in ("503", "504", "unavailable", "deadline_exceeded", "deadline exceeded"))
            if is_transient and attempt < max_retries:
                delay = (2 ** attempt) + random.uniform(0, 1)
                logger.warning(
                    f"Transient Gemini error on attempt {attempt}/{max_retries} "
                    f"({err_msg[:120]}). Retrying in {delay:.1f}s..."
                )
                time.sleep(delay)  # intentional — running in a thread pool executor
                last_exception = e
                continue
            last_exception = e
            break

    _raise_from_api_error(str(last_exception) if last_exception else "Unknown error")


# ── Async wrappers (use these from all FastAPI route handlers) ──────────────────

async def generate_structured_json_async(
    system_prompt: str,
    user_prompt: str,
    enable_search_grounding: bool = False,
    max_retries: int = 3
) -> Dict[str, Any]:
    """
    Non-blocking async wrapper around generate_structured_json.
    Runs the sync Gemini call in the default thread pool executor so the
    FastAPI event loop is never blocked.
    """
    return await asyncio.to_thread(
        generate_structured_json,
        system_prompt,
        user_prompt,
        enable_search_grounding,
        max_retries
    )


async def collect_chat_stream_async(
    system_prompt: str,
    messages: List[Dict[str, str]],
    enable_search_grounding: bool = False
) -> str:
    """
    Non-blocking async wrapper that collects the full chat stream into a string.
    Runs in the thread pool — event loop is never blocked.
    Use this for non-streaming chat endpoints.
    """
    def _collect() -> str:
        return "".join(generate_chat_stream(system_prompt, messages, enable_search_grounding))

    return await asyncio.to_thread(_collect)


async def stream_chat_sse(
    system_prompt: str,
    messages: List[Dict[str, str]],
    enable_search_grounding: bool = False
) -> AsyncGenerator[str, None]:
    """
    Async generator for real SSE streaming.
    Runs the sync Gemini stream in a background daemon thread and forwards
    each text chunk to the async caller via an asyncio.Queue — keeping the
    event loop free while the thread blocks on network I/O.

    Yields raw text chunks as they arrive from Gemini.
    Raises GeminiTimeoutError / GeminiServiceError on failure.
    """
    loop = asyncio.get_running_loop()
    queue: asyncio.Queue = asyncio.Queue()

    def _producer() -> None:
        try:
            for chunk in generate_chat_stream(system_prompt, messages, enable_search_grounding):
                asyncio.run_coroutine_threadsafe(queue.put(("chunk", chunk)), loop)
        except Exception as exc:
            asyncio.run_coroutine_threadsafe(queue.put(("error", exc)), loop)
        finally:
            asyncio.run_coroutine_threadsafe(queue.put(("done", None)), loop)

    thread = threading.Thread(target=_producer, daemon=True)
    thread.start()

    try:
        while True:
            event_type, payload = await queue.get()
            if event_type == "done":
                break
            if event_type == "error":
                raise payload
            yield payload  # type: str chunk
    finally:
        thread.join(timeout=5)
