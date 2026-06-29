#!/usr/bin/env python3
"""
Find visa information for a country using browser-use.
Usage: python find_visas.py "Country Name"
Streams JSON lines to stdout:
  {"type":"screenshot","data":"<base64>"}
  {"type":"result","data":[...]}
Progress/logs go to stderr.
"""

import asyncio
import json
import re
import sys
import os

# Load .env.local so OPENAI_API_KEY is available when run via Next.js spawn
from pathlib import Path
env_path = Path(__file__).parent.parent / ".env.local"
if env_path.exists():
    from dotenv import load_dotenv
    load_dotenv(env_path)


async def find_visas(country_name: str) -> list:
    from browser_use import Agent
    from browser_use.browser.session import BrowserSession
    from langchain_google_genai import ChatGoogleGenerativeAI

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=os.environ.get("GOOGLE_API_KEY") or os.environ["GEMINI_API_KEY"],
    )

    task = f"""Go to the official government immigration website for {country_name}. Find the complete list of ALL visa types, residence permits, and immigration programs offered.

For each visa or permit, extract:
- "name": the exact official name
- "official_link": the ACTUAL href URL from the page — extract the real link from the HTML. NEVER construct or guess a URL. If the page doesn't have a clickable link, use null.

Return a JSON array of objects. Include every category — work visas, student visas, tourist visas, residence permits, family visas, investment visas, digital nomad visas, transit visas, etc.

Return ONLY the raw JSON array. No markdown, no explanation, no code fences."""

    # Create the browser session so we can stream screenshots from it
    session = BrowserSession()
    stop_stream = asyncio.Event()

    async def screenshot_loop():
        """Background task: capture PNG screenshots at ~5fps."""
        page = None
        # Retry until a page becomes available (agent starts the browser lazily)
        while page is None and not stop_stream.is_set():
            try:
                page = await session.get_current_page()
            except Exception:
                pass
            if page is None:
                await asyncio.sleep(0.5)

        if stop_stream.is_set():
            return

        print("screenshot_loop: started", file=sys.stderr, flush=True)
        while not stop_stream.is_set():
            try:
                b64 = await page.screenshot()
                line = json.dumps({"type": "screenshot", "data": b64}, ensure_ascii=False)
                print(line, flush=True)
            except Exception as exc:
                print(f"screenshot_loop: {exc}", file=sys.stderr, flush=True)
            await asyncio.sleep(0.2)
        print("screenshot_loop: stopped", file=sys.stderr, flush=True)

    async def on_step(browser_state, _agent_output, _step_num):
        """Callback after each agent step."""
        if browser_state.screenshot and browser_state.screenshot != "null":
            line = json.dumps({
                "type": "screenshot",
                "data": browser_state.screenshot,
            }, ensure_ascii=False)
            print(line, flush=True)

    agent = Agent(
        task=task,
        llm=llm,
        browser_session=session,
        register_new_step_callback=on_step,
        use_vision=False,
        max_failures=3,
    )

    # Start streaming screenshots
    ss_task = asyncio.create_task(screenshot_loop())

    try:
        result = await agent.run()

        raw = result.final_result() or ""

        # Strip markdown code fences if present
        raw = re.sub(r"```(?:json)?\s*", "", raw).strip()

        # Extract the first JSON array found
        match = re.search(r"\[[\s\S]*\]", raw)
        if not match:
            raise ValueError(f"No JSON array found in agent output:\n{raw[:500]}")

        return json.loads(match.group())
    finally:
        stop_stream.set()
        ss_task.cancel()
        try:
            await ss_task
        except (asyncio.CancelledError, RuntimeError):
            pass


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: find_visas.py <country_name>"}), file=sys.stderr)
        sys.exit(1)

    country_name = sys.argv[1]
    print(f"Searching for visas in: {country_name}", file=sys.stderr)

    try:
        visas = asyncio.run(find_visas(country_name))
        print(f"Found {len(visas)} visa(s)", file=sys.stderr)
        print(json.dumps({"type": "result", "data": visas}, ensure_ascii=False), flush=True)
        sys.exit(0)
    except Exception as e:
        import traceback
        traceback.print_exc(file=sys.stderr)
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
