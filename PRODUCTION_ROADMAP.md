# MyFutureAbroad AI Backend — Production Roadmap

This document tracks everything that needs to be done before the AI backend is production-ready.
It covers fixes to existing features and new features that still need to be built.

---

## Part 1 — Existing Features: Fixes Required

### 1.1 Critical Bugs (Fix First)

#### Event Loop Blocking — `app/services/gemini.py`
- `generate_structured_json` and `generate_chat_stream` are synchronous functions called from async FastAPI route handlers
- `time.sleep(delay)` on line 303 blocks the entire server during Gemini retries — no other requests can be served
- **Fix:** Run sync Gemini calls in a thread pool via `asyncio.get_event_loop().run_in_executor()` or convert to async with `asyncio.sleep`

#### Mock Fallback Returning Fake Data — `app/services/gemini.py`
- When Gemini quota is exceeded (HTTP 429), the service silently returns hardcoded fake data (Portugal, Spain, D7 visa etc.)
- Users receive fabricated information with no indication it is not real
- **Fix:** Remove mock fallback entirely. Raise a proper `GeminiServiceError` with a clear user-facing message like "Service temporarily unavailable due to high demand. Please try again shortly."

---

### 1.2 Security Gaps

#### No Rate Limiting on Any Endpoint
- All chat endpoints (`/chatbot/chat`, `/visa-finder/chat`, `/budget/chat`, `/checklist/chat`) are fully open
- A single user or bot can flood the API, exhaust Gemini quota, and take down the service for everyone
- **Fix:** Add per-IP rate limiting using `slowapi` (FastAPI-compatible). Suggested limits: 20 requests/minute per IP on chat endpoints, 5 requests/minute on page generation endpoints

#### Update Pipeline Endpoint is Unauthenticated — `app/routers/country_pages.py:292`
- `POST /countries/update-pipeline` triggers a full AI regeneration pipeline with no authentication
- Anyone who discovers the URL can trigger unlimited expensive Gemini calls
- **Fix:** Protect with a secret token in the `Authorization` header checked against an env variable `PIPELINE_SECRET_KEY`

---

### 1.3 Reliability Gaps

#### No Session Expiry or Cleanup
- `chat_sessions` and `chat_messages` rows are written to the database and never deleted
- Over time this will degrade database performance
- **Fix:** Add a `scheduled_cleanup` background task (or cron job) that deletes sessions older than 90 days

#### Gemini Timeout Too Low for Complex Queries
- `GEMINI_TIMEOUT_SECONDS` defaults to 60 seconds in `app/config.py`
- Gemini 2.5 Pro with Google Search grounding on complex queries (budget generation, visa page generation) regularly takes longer than 60 seconds
- **Fix:** Raise default to 120 seconds, and set per-endpoint timeouts (chatbot: 60s, page generation: 150s)

#### Currency API Mock Rates Hardcoded — `app/services/currency.py:53`
- If `CURRENCY_API_BASE_URL` is not set, hardcoded rates are used for 8 currency pairs only
- Any other pair falls back to a default rate of 0.85, which is wrong for most combinations
- **Fix:** Ensure `CURRENCY_API_BASE_URL` is always required in production. Add startup validation.

---

### 1.4 Feature Gaps in Existing Features

#### ~~Visa Finder — Prompt Does Not Match Requirements~~ ✅ DONE
- Rewrote `app/prompts/visa_finder.py` — Stage 3 now always asks lifestyle/preference questions (tax system, English importance, climate, expat community, path to citizenship). Match rating now factors in both eligibility AND lifestyle fit.

#### ~~Visa Finder — No Country/Continent Filtering~~ ✅ DONE
- Added geographic constraint rule to prompt — AI now restricts results strictly to stated country/region/continent. Router normalises `match_rating` to lowercase, derives missing slugs, and sorts results (excellent → good → ordinary).

#### General Chatbot — Service Providers Hardcoded — `app/prompts/chatbot.py`
- Only 5 service providers are hardcoded in the system prompt (Allied Pickfords, Santa Fe, Cigna, HSBC, Currencies Direct)
- The requirement states providers should come from the full website catalogue including affiliate pages (e.g. NordVPN)
- **Fix:** Build a `service_providers` table in the database. At chatbot startup, load all active providers and inject them into the system prompt dynamically. Include category, name, description, and URL for each.

#### Visa & Country Pages — Country List Not Fixed
- Currently `GET /countries` asks Gemini to freely choose which countries to list, producing inconsistent results
- The requirement is to generate pages for a **specific list of countries** provided in a spreadsheet
- **Fix:** Create a `SUPPORTED_COUNTRIES` config (loaded from a JSON or database table) containing the approved country slugs. The list endpoint should return only these countries. Page generation should be pre-warmed for all of them on deployment.

---

## Part 2 — New Features to Build

### 2.1 Visa Finder Enhancements

#### ~~Lifestyle & Preference Questioning~~ ✅ DONE
#### ~~Continent / Region Filtering~~ ✅ DONE

---

### 2.2 Visa Pages Enhancements

#### Fixed Country & Visa List (from spreadsheet)
- Replace the dynamic AI-generated country list with a fixed approved list loaded from config or database
- Pre-generate and cache all visa pages for the approved list on first deployment
- Add an admin endpoint (authenticated) to trigger re-generation of a specific country or all countries

#### Richer Visa Page Content
- Current schema covers the basics. Add the following fields to `app/prompts/visa_page.py` and `app/schemas/visa.py`:
  - `who_is_it_for`: expanded description of target applicant profiles
  - `pros`: array of strings, advantages of this visa for expats
  - `cons`: array of strings, known drawbacks or limitations
  - `application_process_steps`: ordered array of strings describing the step-by-step process
  - `where_to_apply`: string, whether applied at embassy, consulate, or online portal
  - `renewal_conditions`: string, conditions under which renewal is granted
  - `dependants_allowed`: boolean, whether dependants can be included
  - `work_permitted`: boolean or string, whether paid work is allowed on this visa
  - `tax_implications`: string, brief note on tax residency implications of holding this visa
  - `last_verified_date`: date string, when the data was last confirmed from an official source

#### Currency Conversion on All Financial Fields
- Currently only 3 financial fields are converted (`minimum_monthly_income`, `minimum_savings`, `application_fee`)
- Ensure all financial fields on the page are converted when `?currency=` is passed

---

### 2.3 Country Pages Enhancements

#### Fixed Country List (from spreadsheet)
- Same as visa pages — replace dynamic Gemini-generated country list with a fixed approved list
- Pre-warm cache for all approved countries on deployment

#### Richer Country Page Content
- Expand `app/prompts/country_page.py` and `app/schemas/country.py` to include:
  - `pros_for_expats`: array of strings, top reasons expats choose this country
  - `cons_for_expats`: array of strings, common challenges for expats
  - `cost_breakdown`: object with typical monthly costs (groceries, transport, dining out, utilities) in local currency
  - `popular_expat_cities`: array of strings, most popular cities/regions for expats
  - `popular_expat_cities_descriptions`: array of short descriptions for each city
  - `nhr_or_special_tax_regime`: string or null, description of any special non-habitual resident or flat-rate tax scheme
  - `double_taxation_treaties`: array of country names with whom a treaty exists (not just UK/US)
  - `remote_work_infrastructure`: string, description of coworking scene, internet reliability, and digital nomad suitability
  - `retirement_suitability_score`: number 1–10 based on cost, healthcare, climate, and safety
  - `digital_nomad_suitability_score`: number 1–10 based on internet, cost, visa options, and community
  - `pet_import_rules`: string or null, brief description of rules for importing pets
  - `driving_licence_exchange`: string or null, whether a foreign driving licence can be exchanged and under what conditions

#### Currency Conversion on Country Pages
- Convert `average_monthly_rent_city_centre_1bed_amount` and all `cost_breakdown` fields when `?currency=` is passed

---

### 2.4 Budget Tool Enhancements

#### Manual Line Item Editing (Frontend Contract)
- The backend already supports AI-driven updates via `POST /budget/update`
- The frontend also needs to support direct manual edits to individual line items (amount, label, notes)
- **Backend task:** Add `POST /budget/update-item` endpoint that accepts `session_id`, `item_id`, and updated field values, persists the change, and returns the recalculated budget — without calling Gemini at all

#### Budget Currency Display
- The budget is generated in the destination country's local currency (`currency_code` field)
- Add `?display_currency=` query param support on `GET /budget/session/{session_id}` to return all amounts converted to the user's preferred display currency

---

### 2.5 Checklist Tool Enhancements

#### Checklist Item Status Updates (Frontend Contract)
- Users need to mark checklist items as `in_progress` or `done` without triggering an AI update
- **Backend task:** Add `PATCH /checklist/item-status` endpoint that accepts `session_id`, `item_id`, and `status`, updates the persisted checklist directly in the database

---

### 2.6 General Chatbot Enhancements

#### Dynamic Service Provider Catalogue
- Create `service_providers` database table with fields: `id`, `name`, `category`, `description`, `website_url`, `affiliate_url`, `is_active`
- Seed with all current and future providers including affiliate partners (e.g. NordVPN)
- Inject active providers into the chatbot system prompt at request time
- Add admin CRUD endpoints for managing providers (authenticated)

#### Chatbot on Home Page and as Floating Widget
- The backend already supports this — confirm frontend integration points use the same `POST /chatbot/chat` endpoint with `placement: "home_page"` or `placement: "floating_widget"` in the request body

---

### 2.7 Infrastructure & DevOps

#### Pre-warming Script for Visa & Country Pages
- Write a script `scripts/prewarm_cache.py` that iterates over the approved country list, calls `GET /countries/{slug}` and `GET /visas/{country_slug}` for all approved entries, and populates the cache before going live
- Run this script as part of the deployment pipeline

#### Structured Logging
- Add `correlation_id` (already done via `X-Request-ID`) to all log lines for traceability in production log aggregators (e.g. Datadog, CloudWatch)
- Ensure all log lines include `feature` and `session_id` where available

#### Health Check Expansion — `app/main.py:151`
- Current `/health` only returns `{"status": "ok"}` with no dependency checks
- Expand to verify: database connectivity, Gemini API key presence, currency API reachability
- Return `{"status": "degraded"}` with details if any dependency is unhealthy

---

## Summary Checklist

### Critical (must fix before any production traffic)
- [x] Fix event loop blocking — async Gemini calls
- [x] Remove mock fallback — replace with proper error response
- [x] Add rate limiting to all chat endpoints
- [x] Authenticate the update-pipeline endpoint — Bearer token via `PIPELINE_SECRET_KEY` env var

### High Priority (fix before launch)
- [x] Rewrite Visa Finder prompt — add lifestyle questions and continent/country filtering
- [x] Dynamic service provider catalogue for General Chatbot
- [x] Fixed approved country list for Visa and Country pages
- [x] Session cleanup background task
- [x] Raise Gemini timeout defaults — raised to 120s default

### Medium Priority (can launch and fix shortly after)
- [ ] Richer Visa page content fields
- [~] Richer Country page content fields — partial (added popular_expat_cities, language_difficulty, digital_nomad_suitability, groceries, utilities, coworking; pros/cons/pet/driving not yet)
- [ ] Budget manual line item edit endpoint
- [ ] Checklist item status update endpoint
- [ ] Budget display currency conversion
- [x] Pre-warming — runs as startup background task on deploy

### Lower Priority (post-launch improvements)
- [ ] Expand health check with dependency probes
- [ ] Retirement and digital nomad suitability scores on country pages
- [ ] Currency conversion on all financial fields across all pages
- [ ] Double taxation treaty list expansion
