# MyFutureAbroad — AI Backend Overview

**Version:** 1.0 | **Date:** 2026-06-29 | **Author:** Technical Documentation

---

## 1. System Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                             │
│                    React / Vite  (port 5173)                       │
└──────────────────────────────┬─────────────────────────────────────┘
                               │  REST / SSE
                               ▼
┌────────────────────────────────────────────────────────────────────┐
│                      EXPRESS.JS GATEWAY                            │
│                    Node.js / TypeScript  (port 3001)               │
│  Auth middleware (Supabase JWT) • Stripe • Email • File uploads    │
└──────────────────────────────┬─────────────────────────────────────┘
                               │  HTTP (proxied AI requests)
                               ▼
┌────────────────────────────────────────────────────────────────────┐
│                     FASTAPI AI BACKEND                             │
│                      Python 3.11  (port 8000)                      │
│                                                                    │
│  ┌───────────┐ ┌────────────┐ ┌──────────────┐ ┌──────────────┐  │
│  │Visa Finder│ │ Visa Pages │ │Country Pages │ │   Chatbot    │  │
│  └───────────┘ └────────────┘ └──────────────┘ └──────────────┘  │
│  ┌───────────┐ ┌────────────┐                                      │
│  │  Budget   │ │ Checklist  │                                      │
│  └───────────┘ └────────────┘                                      │
│                                                                    │
│  ┌──────────────────────┐  ┌────────────────────────────────────┐  │
│  │   Gemini 2.5 Pro     │  │      PostgreSQL (SQLAlchemy)       │  │
│  │  (Google AI Studio)  │  │  ChatSession • ChatMessage         │  │
│  │  + Google Search     │  │  ContentCache                      │  │
│  │    Grounding         │  └────────────────────────────────────┘  │
│  └──────────────────────┘                                          │
│                                                                    │
│  ┌──────────────────────┐                                          │
│  │  Currency Service    │  (Frankfurter API — open, no key)        │
│  │  httpx AsyncClient   │                                          │
│  └──────────────────────┘                                          │
└────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────────┐
│                     SUPABASE (Production DB)                       │
│   PostgreSQL • Auth • Storage • RLS • Realtime                     │
└────────────────────────────────────────────────────────────────────┘
```

---

## 2. AI Technology Stack

| Component | Technology | Notes |
|---|---|---|
| **AI Model** | Gemini 2.5 Pro (`gemini-2.5-pro`) | Configurable via `GEMINI_MODEL` env var |
| **AI SDK** | `google-genai` Python SDK | Streaming + non-streaming modes |
| **Search Grounding** | Google Search Tool (built-in) | Enabled for live data fetches |
| **Response Mode** | JSON-mode (`application/json`) | For structured endpoints; disabled when search grounding is on |
| **Async Pattern** | `asyncio.to_thread()` for sync Gemini SDK | Keeps FastAPI event loop non-blocking |
| **Streaming** | SSE via `asyncio.Queue` + daemon thread | Each feature has a `/stream` endpoint |
| **Web Framework** | FastAPI 0.110+ | Auto OpenAPI docs at `/docs` |
| **ORM** | SQLAlchemy 2.0 async | `AsyncSession` + `asyncpg` driver |
| **Validation** | Pydantic v2 | All request and response schemas |

---

## 3. Cross-Cutting Infrastructure

### 3.1 Rate Limiting (In-Memory Sliding Window)

No Redis required. Per-IP, per-bucket, 60-second window.

| Bucket | Applies To | Limit |
|---|---|---|
| `chat` | All `POST` endpoints | 10 req / 60s |
| `page` | `GET /countries/*`, `GET /visas/*` | 30 req / 60s |
| `other` | Everything else | 60 req / 60s |

Returns `429` with `Retry-After: 60` header on breach.

### 3.2 Content Caching (PostgreSQL `content_cache` Table)

Visa pages and country pages are expensive Gemini calls (live Google Search). Results are cached in PostgreSQL with a TTL configured by `CACHE_TTL_SECONDS`.

```
Request → Check content_cache → HIT: return cached JSON
                             → MISS: call Gemini → validate → write cache → return
```

- Cache key format: `visa:{country_slug}:{visa_slug}` / `country:{country_slug}`
- `?refresh=true` query param bypasses cache and forces regeneration
- Non-blocking: cache write failures do not block response delivery

### 3.3 Cache Pre-Warming (Startup)

On application startup, background task pre-populates `ContentCache` for 20 top expat destinations:

> Portugal, Spain, Germany, France, Netherlands, Italy, Greece, Thailand, Malaysia, Indonesia, Mexico, Costa Rica, Canada, Australia, New Zealand, UAE, Singapore, Japan, UK, USA

Paced at 3-second intervals per country to avoid Gemini rate limits.

### 3.4 Session & Message Persistence

Every AI conversation turn is persisted:

```
ChatSession (UUID PK)
  feature: "chatbot" | "visa_finder" | "budget" | "checklist"
  created_at / updated_at
    │
    └── ChatMessage[]
          role: "user" | "assistant"
          content: raw text or JSON string
          created_at
```

- Sessions expire and are auto-deleted after **90 days** (background cleanup loop, runs every 24h)
- History is loaded on each request to maintain multi-turn context
- Message pair (user + assistant) is committed atomically in a single transaction

### 3.5 Data Confidence & Source Validation

For Visa Pages and Country Pages, source URLs are validated against a regex of official government domain patterns:

```
*.gov, *.gouv, *.gob, *.gc.ca, *.govt, *.admin, *.bund, *.europa.eu
```

If Gemini returns `data_confidence: "full"` but no official domain is found in source URLs, confidence is **automatically downgraded to `"partial"`** and `partial_data_warning: true` is added to the response.

### 3.6 Error Handling

Three typed Gemini exceptions with mapped HTTP status codes:

| Exception | HTTP Code | Cause |
|---|---|---|
| `GeminiTimeoutError` | `504` | Request exceeded `GEMINI_TIMEOUT_SECONDS` |
| `GeminiParseError` | `502` | Response could not be parsed as JSON |
| `GeminiServiceError` | `502` | Auth failure, quota, safety block, 503 |

All exceptions also include `request_id` (UUID injected by middleware) in the response envelope for tracing.

### 3.7 Currency Conversion Service

Uses Frankfurter API (free, no API key):

```python
GET https://api.frankfurter.app/latest?amount={amount}&from={from_currency}&to={to_currency}
```

- Shared `httpx.AsyncClient` with connection pool limits (max 20 connections, max 5 per host)
- `CurrencyServiceError` is caught and surfaced as `currency_conversion_error: true` in response (never blocks the main response)
- Gracefully closed on application shutdown

---

## 4. AI Features — Detailed Reference

---

### Feature 1: Visa Finder Chatbot

**Purpose:** Conversational multi-turn chatbot that qualifies the user's situation and recommends the best-fit visa programmes.

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `POST` | `/visa-finder/chat` | Conversational turn (non-streaming) |
| `POST` | `/visa-finder/stream` | SSE streaming turn |
| `GET` | `/visa-finder/session/{id}` | Load full message history |

**Conversation Flow:**

```
Stage: "collecting"  →  AI asks qualifying questions
                         (nationality, income, move date, work status, family)
Stage: "results"     →  AI returns ranked visa matches
```

**Response Schema (results stage):**

```json
{
  "session_id": "uuid",
  "stage": "results",
  "visas": [
    {
      "country": "Portugal",
      "country_slug": "portugal",
      "visa_name": "D7 Passive Income Visa",
      "visa_slug": "d7-passive-income-visa",
      "match_rating": "excellent",     // "excellent" | "good" | "ordinary"
      "reason": "Your passive income meets the threshold...",
      "source_url": "https://..."
    }
  ]
}
```

**Key behaviours:**
- Results are sorted: `excellent → good → ordinary`
- `match_rating` is normalised to lowercase and validated; defaults to `"ordinary"` if unexpected value
- `country_slug` / `visa_slug` are auto-derived from names if missing
- Google Search grounding enabled — uses live government sources
- Session history is included in every Gemini call for full multi-turn context
- **Frontend integration:** `/chats?feature=visa_finder` — also accessible as secondary tab on `/visa-finder` (Manual Filter as primary tab)

---

### Feature 2: Visa Pages

**Purpose:** On-demand structured visa requirement pages generated by AI with Google Search grounding, cached in PostgreSQL.

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/visas/{country_slug}/{visa_slug}` | Full visa detail page |
| `GET` | `/visas/{country_slug}` | List all visa programmes for a country |

**Query Parameters (detail endpoint):**

| Param | Type | Description |
|---|---|---|
| `currency` | `string` | ISO 4217 code — converts financial fields to this currency |
| `refresh` | `bool` | Bypass cache and regenerate |

**Response Fields (selected):**

| Field | Type | Description |
|---|---|---|
| `visa_name` | string | Official programme name |
| `minimum_monthly_income_amount` | number\|null | In original local currency |
| `minimum_monthly_income_currency` | string\|null | ISO 4217 |
| `minimum_savings_amount` | number\|null | |
| `application_fee_amount` | number\|null | |
| `processing_time_min_days` | int\|null | |
| `processing_time_max_days` | int\|null | |
| `validity_months` | int\|null | |
| `renewable` | bool\|null | |
| `path_to_residency` | string\|null | |
| `work_permitted` | bool\|null | Explicit work rights |
| `dependants_allowed` | bool\|null | Spouse/children eligibility |
| `renewal_conditions` | string\|null | Conditions for renewal |
| `application_process_steps` | string[] | 3–6 step-by-step instructions |
| `tax_implications` | string\|null | Special visa-specific tax treatment |
| `last_verified_date` | string | ISO 8601 date of last data verification |
| `documents_required` | string[] | List of required documents |
| `data_confidence` | `"full"` \| `"partial"` | |
| `cache_hit` | bool | Whether response was served from cache |
| `partial_data_warning` | bool | Present if confidence is partial |

**Currency Conversion (when `?currency=GBP`):**

```json
{
  "minimum_monthly_income_converted_amount": 876.50,
  "minimum_savings_converted_amount": 24500.00,
  "application_fee_converted_amount": 220.00,
  "converted_currency": "GBP",
  "currency_conversion_error": false
}
```

---

### Feature 3: Country Pages

**Purpose:** On-demand structured expat profiles for destination countries, covering cost of living, taxes, healthcare, culture, and more.

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/countries/{country_slug}` | Full country expat profile |
| `GET` | `/countries` | List all major expat destination countries |
| `POST` | `/countries/update-pipeline` | Trigger monthly background update (admin-only, Bearer token) |

**Query Parameters (detail endpoint):**

| Param | Type | Description |
|---|---|---|
| `currency` | `string` | ISO 4217 code — converts cost fields |
| `refresh` | `bool` | Bypass cache |

**Response Fields (selected):**

| Field | Type | Description |
|---|---|---|
| `climate_type` | enum | `tropical\|subtropical\|mediterranean\|temperate\|continental\|arid\|polar` |
| `expat_community_size` | enum | `large\|moderate\|small\|minimal` |
| `healthcare_quality` | enum | `excellent\|good\|adequate\|limited` |
| `tax_system_type` | enum | `territorial\|worldwide\|remittance\|flat\|exempt` |
| `nhr_or_special_tax_regime` | string\|null | Portugal NHR, Spain Beckham Law, Italy flat-tax, etc. |
| `retirement_suitability` | string\|null | 2–3 sentence suitability assessment |
| `double_taxation_treaties` | string[] | List of treaty partner countries |
| `pet_import_rules` | string\|null | Quarantine, vaccination, health certificate rules |
| `driving_licence_exchange` | string\|null | Foreign licence acceptance and exchange process |
| `pros_for_expats` | string[] | Top 3–5 advantages |
| `cons_for_expats` | string[] | Top 3–5 drawbacks |
| `popular_expat_cities` | string[] | 3–5 city descriptions |
| `digital_nomad_suitability` | enum | `excellent\|good\|moderate\|limited` |
| `international_schools_available` | bool\|null | |
| `banking_ease_for_expats` | enum | `easy\|moderate\|difficult` |
| `data_confidence` | `"full"` \| `"partial"` | |
| `cache_hit` | bool | |

**Currency Conversion (when `?currency=USD`):**

```json
{
  "converted_rent_amount": 950.00,
  "converted_groceries_amount": 320.00,
  "converted_utilities_amount": 85.00,
  "converted_property_price_amount": 4200.00,
  "converted_currency": "USD",
  "currency_conversion_error": false
}
```

**Monthly Update Pipeline:**

Triggered via `POST /countries/update-pipeline?Authorization=Bearer <PIPELINE_SECRET_KEY>`. Runs `scripts/run_monthly_update.py` as a background subprocess, logging to `ai-backend/tmp/monthly_update.log`. Used to refresh cached country and visa data monthly.

---

### Feature 4: Budget Tool

**Purpose:** Conversational AI tool that collects user context and generates a full itemised relocation budget, with ongoing editing capabilities.

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `POST` | `/budget/chat` | Conversational turn — builds budget |
| `POST` | `/budget/update` | Edit budget via natural language instruction |
| `POST` | `/budget/update-item` | Direct edit of a single line item (no AI call) |
| `POST` | `/budget/stream` | SSE streaming for chat |
| `GET` | `/budget/session/{id}` | Load message history |

**Conversation Flow:**

```
Stage: "collecting"  →  AI asks about destination, lifestyle, family size, income
Stage: "complete"    →  Full budget JSON object returned
```

**Budget Schema Structure:**

```json
{
  "destination_country": "Portugal",
  "currency_code": "EUR",
  "categories": [
    {
      "category_name": "Housing",
      "category_total": 1200.00,
      "line_items": [
        {
          "item_id": "rent-lisbon",
          "label": "Monthly rent (1-bed, Lisbon)",
          "amount": 1200.00,
          "frequency": "monthly",
          "notes": "City centre estimate",
          "display_amount": 1026.00    // present if display_currency requested
        }
      ]
    }
  ],
  "total_one_time_costs": 8500.00,
  "total_monthly_ongoing_costs": 2650.00,
  "buffer_fund_amount": 1275.00,     // 15% of one-time costs
  "display_currency": "GBP",         // present if requested
  "display_conversion_error": false,
  "display_total_one_time": 7268.50,
  "display_total_monthly": 2267.05,
  "display_buffer_fund": 1090.28
}
```

**Display Currency (`?display_currency=GBP`):**

Available on `/budget/chat`, `/budget/update`, and `/budget/update-item`. Converts every `line_item.amount` → `display_amount` and adds `display_total_*` budget-level fields. Original `amount` and `currency_code` are always preserved.

**Budget Validation:**
- Negative amounts are clamped to `0` with a warning log
- Amounts > 500,000 trigger a suspicious-value warning log
- Monthly totals > 50,000 trigger a plausibility warning
- Backend recalculates `category_total`, `total_one_time_costs`, `total_monthly_ongoing_costs`, and `buffer_fund_amount` (15% of one-time) on every response — AI-generated totals are never trusted

---

### Feature 5: Relocation Checklist

**Purpose:** Conversational AI tool that generates a personalised, phase-based relocation checklist and allows ongoing status tracking and item management.

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `POST` | `/checklist/chat` | Conversational turn — builds checklist |
| `POST` | `/checklist/update` | Update checklist via natural language instruction |
| `POST` | `/checklist/item-status` | Toggle an item's completion status |
| `POST` | `/checklist/add-item` | Manually add a custom item to a phase |
| `POST` | `/checklist/delete-item` | Remove an item by ID |
| `POST` | `/checklist/stream` | SSE streaming for chat |
| `GET` | `/checklist/session/{id}` | Load message history |

**Checklist Schema Structure:**

```json
{
  "destination_country": "Portugal",
  "move_date_reference": "March 2027",
  "phases": [
    {
      "phase_id": "six_months_before",
      "phase_label": "6 Months Before",
      "items": [
        {
          "item_id": "research-d7-visa_a3f2b1",
          "title": "Research D7 Passive Income Visa requirements",
          "description": "Visit SEF website and gather required documents list...",
          "status": "not_started",
          "category": "legal",
          "country_specific": true,
          "notes": "Income threshold is €820/month for 2025"
        }
      ]
    }
  ]
}
```

**Phase Timeline (9 phases):**

| Phase ID | Phase Label |
|---|---|
| `six_months_before` | 6 Months Before |
| `three_months_before` | 3 Months Before |
| `one_month_before` | 1 Month Before |
| `two_weeks_before` | 2 Weeks Before |
| `moving_week` | Moving Week |
| `first_month_after` | First Month After |
| `three_months_after` | 3 Months After |
| `six_months_after` | 6 Months After |
| `ongoing` | Ongoing |

**Item Categories:** `documents` | `legal` | `financial` | `property` | `logistics` | `healthcare` | `administrative` | `personal`

**Item Status Values:** `not_started` | `in_progress` | `done`

**Item Density:** AI is instructed to generate **5–8 items per phase**, prioritising highest-impact tasks.

**Manual Add Item (`POST /checklist/add-item`):**

```json
{
  "session_id": "uuid",
  "phase_id": "three_months_before",
  "title": "Open NIF tax number",
  "description": "Visit local Finanças office with passport and proof of address",
  "category": "legal",
  "country_specific": true,
  "notes": "Can also be done via Portuguese consulate in home country"
}
```

Response includes generated `item_id` (slug format: `open-nif-tax-number_a3b4c5`) and full updated checklist.

**Delete Item (`POST /checklist/delete-item`):**

```json
{
  "session_id": "uuid",
  "item_id": "open-nif-tax-number_a3b4c5"
}
```

Returns `status: "deleted"` and full updated checklist.

**Normalization Layer:**

All Gemini-generated checklists pass through `normalize_checklist_data()` before Pydantic validation, which:
- Corrects invalid `phase_id` → `"ongoing"`
- Corrects invalid `category` → `"personal"`
- Corrects invalid `status` → `"not_started"`
- Adds `country_specific: false` if missing

---

### Feature 6: General Chatbot

**Purpose:** Context-aware expat advisor embedded on the website (home page widget and floating widget). Answers general expat questions and directs users to the correct tool or partner page.

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `POST` | `/chatbot/chat` | Conversational turn (non-streaming) |
| `POST` | `/chatbot/stream` | SSE streaming turn |
| `GET` | `/chatbot/session/{id}` | Load message history |

**Request Schema:**

```json
{
  "feature": "chatbot",
  "message": "What's the best country in Europe for remote workers?",
  "session_id": "uuid (optional — null for new session)",
  "current_page": "/countries/portugal (optional — injected as system note)",
  "placement": "home_page | floating_widget (optional)"
}
```

**Response Schema:**

```json
{
  "session_id": "uuid",
  "message": "For remote workers, Portugal stands out...",
  "redirect": "/visa-finder",        // or null
  "sources": ["https://..."],
  "request_id": "uuid"
}
```

**Redirect Logic:**

The AI may return a `redirect` path to navigate the user to a specific page. Redirects are validated against an allowlist before being returned to the client:

| Allowed Redirect Pattern | Example |
|---|---|
| `/visas` | Visa directory |
| `/visa-finder` | Visa finder tool |
| `/budgets` | Budget planner |
| `/checklists` | Checklist tool |
| `/visas/{country}/{visa}` | `/visas/portugal/d7-passive-income-visa` |
| `/partners/{slug}` | `/partners/nordvpn` (slug must be in catalogue) |

Invalid redirect paths returned by Gemini are silently set to `null`.

**Service Provider Catalogue:**

The chatbot's system prompt includes a hardcoded catalogue of approved partner providers by category:

- Removal & Moving
- Expat Health Insurance
- International Banking & Finance
- Currency Transfer
- VPN & Digital Privacy
- Legal & Immigration Services

The chatbot is instructed to **only** recommend providers from this catalogue. Each recommendation includes the `/partners/{slug}` page URL. Adding a new partner requires editing [ai-backend/app/services_catalogue.py](ai-backend/app/services_catalogue.py) only.

**Scope Guardrails:**

The chatbot is explicitly instructed to decline:
- Legal advice (refer to lawyers)
- Financial investment advice
- Any topic unrelated to expat living or relocation

---

## 5. Gemini Service — Internal Design

**File:** [ai-backend/app/services/gemini.py](ai-backend/app/services/gemini.py)

### Function Reference

| Function | Mode | Use Case |
|---|---|---|
| `generate_chat_stream()` | Sync generator | Core streaming — never call directly from async |
| `generate_structured_json()` | Sync, retry (3x) | Structured JSON for visa/country pages |
| `generate_structured_json_async()` | Async wrapper | `asyncio.to_thread()` wrapper — use in routers |
| `collect_chat_stream_async()` | Async, collects full text | Non-streaming chat endpoints |
| `stream_chat_sse()` | Async generator | Real SSE — daemon thread + `asyncio.Queue` |

### Retry Logic (structured JSON only)

Transient errors (503, 504, `deadline_exceeded`) trigger exponential backoff:
- Attempt 1 → immediate
- Attempt 2 → ~2–3s delay
- Attempt 3 → ~4–5s delay
- Non-transient errors (auth, safety, parse) → raise immediately

### Error Classification

Raw API error strings are parsed by `_raise_from_api_error()` to typed exceptions:

| Pattern in error string | Exception raised |
|---|---|
| `quota`, `429`, `resource_exhausted`, `rate_limit` | `GeminiServiceError` (high demand) |
| `503`, `unavailable` | `GeminiServiceError` (service down) |
| `deadline_exceeded`, `504` | `GeminiTimeoutError` |
| `401`, `403`, `authentication`, `permission` | `GeminiServiceError` (auth) |
| `SAFETY`, finish reason 2 | `GeminiServiceError` (safety block) |

---

## 6. API Endpoint Summary

| Method | Path | Feature | AI Call | Cache | Auth |
|---|---|---|---|---|---|
| `POST` | `/visa-finder/chat` | Visa Finder | Gemini + Search | No | No |
| `POST` | `/visa-finder/stream` | Visa Finder | Gemini + Search SSE | No | No |
| `GET` | `/visa-finder/session/{id}` | Visa Finder | No | No | No |
| `GET` | `/visas/{country}/{visa}` | Visa Pages | Gemini + Search | Yes (PostgreSQL) | No |
| `GET` | `/visas/{country}` | Visa Pages | Gemini + Search | Yes | No |
| `GET` | `/countries/{country}` | Country Pages | Gemini + Search | Yes (PostgreSQL) | No |
| `GET` | `/countries` | Country Pages | Gemini + Search | Yes | No |
| `POST` | `/countries/update-pipeline` | Admin | Gemini + Search | Writes | Bearer token |
| `POST` | `/budget/chat` | Budget | Gemini + Search | No | No |
| `POST` | `/budget/update` | Budget | Gemini | No | No |
| `POST` | `/budget/update-item` | Budget | No | No | No |
| `POST` | `/budget/stream` | Budget | Gemini + Search SSE | No | No |
| `GET` | `/budget/session/{id}` | Budget | No | No | No |
| `POST` | `/checklist/chat` | Checklist | Gemini + Search | No | No |
| `POST` | `/checklist/update` | Checklist | Gemini | No | No |
| `POST` | `/checklist/item-status` | Checklist | No | No | No |
| `POST` | `/checklist/add-item` | Checklist | No | No | No |
| `POST` | `/checklist/delete-item` | Checklist | No | No | No |
| `POST` | `/checklist/stream` | Checklist | Gemini + Search SSE | No | No |
| `GET` | `/checklist/session/{id}` | Checklist | No | No | No |
| `POST` | `/chatbot/chat` | Chatbot | Gemini + Search | No | No |
| `POST` | `/chatbot/stream` | Chatbot | Gemini + Search SSE | No | No |
| `GET` | `/chatbot/session/{id}` | Chatbot | No | No | No |
| `GET` | `/health` | System | No | No | No |

---

## 7. Environment Variables

**File:** [ai-backend/.env](ai-backend/.env)

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Google AI Studio API key |
| `GEMINI_MODEL` | Yes | Model ID (e.g. `gemini-2.5-pro`) |
| `GEMINI_TIMEOUT_SECONDS` | Yes | Max wait time per Gemini request |
| `DATABASE_URL` | Yes | `postgresql+asyncpg://...` — local or Supabase |
| `CACHE_TTL_SECONDS` | Yes | Visa/Country cache TTL (e.g. `604800` = 7 days) |
| `ALLOWED_ORIGINS` | Yes | Comma-separated CORS origins |
| `PIPELINE_SECRET_KEY` | Yes | Bearer token for `/countries/update-pipeline` |

---

## 8. File Structure

```
ai-backend/
├── app/
│   ├── main.py                  # FastAPI app, middleware, rate limiting, lifespan
│   ├── config.py                # Settings (pydantic-settings)
│   ├── database.py              # SQLAlchemy async engine + session factory
│   ├── dependencies.py          # get_db() dependency
│   ├── services_catalogue.py    # Partner provider catalogue (chatbot + redirects)
│   ├── supported_countries.py   # Allowlist of country slugs for visa/country pages
│   │
│   ├── models/
│   │   ├── session.py           # ChatSession ORM model
│   │   ├── message.py           # ChatMessage ORM model
│   │   └── cache.py             # ContentCache ORM model
│   │
│   ├── schemas/
│   │   ├── chat.py              # Shared ChatRequest / ChatResponse / SessionHistory
│   │   ├── visa.py              # VisaDetailResponse / VisaListResponse
│   │   ├── country.py           # CountryDetailResponse / CountryListResponse
│   │   ├── budget.py            # BudgetSchema / BudgetChatResponse / etc.
│   │   └── checklist.py         # ChecklistSchema / all checklist request/response models
│   │
│   ├── prompts/
│   │   ├── chatbot.py           # General chatbot system prompt (includes catalogue)
│   │   ├── visa_finder.py       # Visa finder multi-turn prompt
│   │   ├── visa_page.py         # Visa detail page structured JSON prompt
│   │   ├── country_page.py      # Country profile structured JSON prompt
│   │   ├── budget.py            # Budget chat + update prompts
│   │   └── checklist.py         # Checklist chat + update prompts
│   │
│   ├── routers/
│   │   ├── chatbot.py
│   │   ├── visa_finder.py
│   │   ├── visa_pages.py
│   │   ├── country_pages.py
│   │   ├── budget.py
│   │   └── checklist.py
│   │
│   └── services/
│       ├── gemini.py            # All Gemini SDK logic (streaming, retry, error handling)
│       └── currency.py          # Frankfurter API currency conversion
│
└── scripts/
    └── run_monthly_update.py    # Monthly update pipeline script
```

---

## 9. Data Flow — Visa Page Request (Cached)

```
Client: GET /visas/portugal/d7-passive-income-visa?currency=GBP

1. Middleware: assign request_id, check rate limit (page bucket, 30/min)
2. Router: validate slugs (lowercase alpha-hyphen only), validate currency code
3. Cache check: SELECT FROM content_cache WHERE key='visa:portugal:d7-passive-income-visa'
   └── HIT (expires_at > now): load raw_data from cache JSON
   └── MISS:
       a. Check SUPPORTED_COUNTRY_SLUGS allowlist → 404 if not found
       b. Call Gemini: system_prompt.format(country, visa) + user_prompt
          → asyncio.to_thread(generate_structured_json) → up to 3 retries
       c. Validate: check required keys, downgrade confidence if no official source
       d. Write to content_cache (upsert) → does not block response on failure
4. Currency conversion: 3 parallel convert_currency() calls via httpx
   └── On CurrencyServiceError: set currency_conversion_error=true, continue
5. Build response_payload: {request_id, cache_hit, **raw_data, **converted_fields}
6. Add partial_data_warning if confidence=partial
7. Return as VisaDetailResponse (Pydantic serialized)
```

---

## 10. SSE Streaming Protocol

All SSE endpoints emit the following event sequence:

```
data: {"type": "chunk", "text": "The D7 visa"}
data: {"type": "chunk", "text": " requires passive income"}
...
data: {"type": "final", "session_id": "uuid", "stage": "results", "visas": [...]}
data: [DONE]
```

On error:
```
data: {"type": "error", "message": "The AI service is temporarily unavailable."}
```

The `final` event contains the full structured payload (same as the non-streaming `/chat` response). Clients should accumulate `chunk` events for real-time display and use `final` for structured data.

---

*Generated from source: `e:\Office\abroad-update\ai-backend\`*
