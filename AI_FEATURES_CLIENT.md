# MyFutureAbroad — AI Features Overview
### Client Requirements vs. Implementation | June 2026

---

## What We Built

MyFutureAbroad uses **Google's Gemini AI** (the same technology behind Google's AI search) to power 6 intelligent features that help users plan their move abroad. Each feature feels like talking to a knowledgeable expat advisor — not filling out a boring form.

---

## The 6 AI Features

---

### 1. Visa Finder AI

---

#### What the Client Asked For

> *"Create a dynamic chatbot experience where the user can describe what they are looking for. If they want to move to a particular country or continent, the AI should only end up showing them visa options for the countries they are interested in. The AI should ask additional questions where needed. For example, if a user tells the AI they are looking to retire somewhere warm in Europe, the AI should first ask how much they have in savings and other factors relevant to those types of visas. The AI should also ask questions that may be relevant to their preference in country. For example, it may ask the user what other features are important to them, and if the user responds with factors like tax burden, language etc, those factors should be considered when the results are given. The results should still be sorted by excellent, good and ordinary matches depending on how compatible the visa schemes are with their requirements and preferences."*

#### What Was Delivered

| Requirement | Status | Detail |
|---|---|---|
| Dynamic chatbot — user describes what they want | ✅ Done | Fully conversational multi-turn chat, not a form |
| Country/continent filtering | ✅ Done | AI restricts results to countries the user expresses interest in |
| AI asks follow-up questions (savings, income etc.) | ✅ Done | AI collects all relevant qualifying factors before giving results |
| Lifestyle preference questions (tax, language etc.) | ✅ Done | Preferences are part of the conversation and factored into results |
| Results sorted: Excellent → Good → Ordinary | ✅ Done | Sorted server-side, enforced by backend validation |
| Each result links to the full visa detail page | ✅ Done | `country_slug` and `visa_slug` returned for direct linking |
| Real-time streaming (text appears as AI types) | ✅ Done | SSE streaming endpoint |
| Conversation history saved | ✅ Done | Multi-turn sessions stored in database |

**How it works for the user:**
The user opens the Visa Finder page and is greeted by the AI chatbot (default view). They type something like *"I want to retire somewhere warm in Europe with a low tax burden"*. The AI asks about their savings, income, nationality, and any other preferences. After a few exchanges, it returns a ranked list of visa programmes — Excellent, Good, and Ordinary matches — based on everything the user shared.

---

### 2. Visa Detail Pages — AI Generated

---

#### What the Client Asked For

> *"The AI should use reliable sources (primarily government websites) to create and keep up-to-date visa pages for a list of countries I will provide to you. The old, existing visa pages on our website should be replaced. The visa pages should include a range of useful information, including a description, which kinds of people it would be relevant for, any required documents, any other requirements (minimum income, savings, criminal record ...etc), application fees, paths to residency, processing times, validity periods, renewability, and any other relevant info. All financial data should be sourced in its original currency (Euros for EU countries... etc), but should be exchanged to the currency of choice of the user using the already built-in currency exchange api."*

#### What Was Delivered

| Requirement | Status | Detail |
|---|---|---|
| Uses government websites as primary source | ✅ Done | Google Search grounding — AI searches official `.gov`, `.gouv`, `.gob` domains |
| Source verification | ✅ Done | Backend checks source URLs against official domain patterns; downgrades confidence if no official source found |
| Pages kept up to date | ✅ Done | 7-day cache TTL; `?refresh=true` forces fresh generation at any time |
| Old visa pages replaced | ✅ Done | New AI-generated pages replace the static pages |
| Description of the visa | ✅ Done | `summary` field |
| Who it is relevant for | ✅ Done | `target_applicant` field |
| Required documents | ✅ Done | `documents_required` array |
| Minimum income requirement | ✅ Done | `minimum_monthly_income_amount` + currency |
| Minimum savings requirement | ✅ Done | `minimum_savings_amount` + currency |
| Criminal record check | ✅ Done | `criminal_record_check_required` boolean |
| Health insurance requirement | ✅ Done | `health_insurance_required` boolean |
| Application fees | ✅ Done | `application_fee_amount` + currency |
| Path to residency | ✅ Done | `path_to_residency` field |
| Processing times | ✅ Done | `processing_time_min_days` / `processing_time_max_days` |
| Validity period | ✅ Done | `validity_months` field |
| Renewability | ✅ Done | `renewable` boolean + `renewal_conditions` description |
| Other relevant info | ✅ Done | Work rights, dependants, application steps, tax implications, last verified date |
| Financial data in original currency | ✅ Done | All figures stored in original local currency (EUR, USD, CRC etc.) |
| Currency conversion for user preference | ✅ Done | `?currency=GBP` converts income, savings, and fee fields |
| Data confidence labelling | ✅ Done | Every page shows Full or Partial confidence |

**What a visa page includes (full list):**
Description · Target applicant · Income requirement · Savings requirement · Age limits · Criminal record check · Health insurance · Required documents · Application fee · Processing time · Validity period · Renewable or not · Renewal conditions · Path to residency · Work rights · Dependants allowed · Step-by-step application guide · Tax implications · Last verified date · Source URL · Data confidence level

---

### 3. Country Profile Pages — AI Generated

---

#### What the Client Asked For

> *"The AI should use credible sources to create and update country pages, including descriptions, tax info and other relevant information. You can take inspiration from Expatlife.ai and the old pages on our website to decide what the AI should include. They should be very comprehensive. The old, existing country pages on our website should be replaced. The full list of countries to do this for will be given to you in a spreadsheet."*

#### What Was Delivered

| Requirement | Status | Detail |
|---|---|---|
| Uses credible sources | ✅ Done | Google Search grounding — official government sites, Numbeo, official tax authorities |
| Pages kept up to date | ✅ Done | 7-day cache; manual refresh available; monthly update pipeline for bulk refresh |
| Old country pages replaced | ✅ Done | New AI-generated pages replace the static pages |
| Descriptions | ✅ Done | 2–3 paragraph expat overview |
| Tax information | ✅ Done | Tax system type, income tax rates, capital gains tax, wealth tax, pension tax treatment, special regimes (NHR, Beckham Law etc.), double taxation treaties |
| Comprehensive — inspired by Expatlife.ai | ✅ Done | 35+ structured data fields per country (see full list below) |
| Country list from spreadsheet | ⏳ Pending | Ready to receive the spreadsheet — the system can generate any country on demand |

**What a country page includes (full list):**
Capital city · Official languages · Currency · Climate description · Population · Expat community size · English spoken · Safety index · Healthcare quality · Public healthcare access · Cost of living index · Monthly rent · Tax system type · Income tax rates · Capital gains tax · Wealth tax · Pension income tax · Special tax regimes (NHR, Beckham Law etc.) · Tax treaties (UK, US, and full list of partners) · Path to permanent residency · Path to citizenship · EU membership · Schengen area · Visa on arrival (EU/US/UK) · Banking ease for expats · Internet speed · Monthly groceries cost · Monthly utilities cost · Popular expat cities · Language difficulty · Digital nomad suitability · Coworking spaces · Pros for expats · Cons for expats · Average property price · Public transport · International schools · School fees · Pet import rules · Driving licence exchange · Retirement suitability

**20 top destinations are pre-loaded on startup** so the first visitor gets an instant response: Portugal, Spain, Germany, France, Netherlands, Italy, Greece, Thailand, Malaysia, Indonesia, Mexico, Costa Rica, Canada, Australia, New Zealand, UAE, Singapore, Japan, UK, USA.

---

### 4. Relocation Budget Planner

---

#### What the Client Asked For

> *"The AI chatbot should have a conversation box on the budget tool page where a user can ask to have a budget created for a move abroad. This should create a full budget for their move categorised by the type of cost. Where the AI needs more information to create an accurate budget, it should ask questions (asking what visa type they are going for, how much furniture or other possessions are being moved, what other requirements they have). The budgets should also include a buffer fund to account for additional costs...etc. The user should be able to alter these budgets either manually or through asking the AI to do so."*

#### What Was Delivered

| Requirement | Status | Detail |
|---|---|---|
| Conversation box on the budget page | ✅ Done | Chat interface embedded on the budget tool page |
| AI asks qualifying questions first | ✅ Done | Asks about destination, visa type, family size, lifestyle, possessions |
| Full budget categorised by cost type | ✅ Done | Budget is split into categories (Housing, Visa & Legal, Moving Costs, Healthcare etc.) with line items |
| One-time costs | ✅ Done | Visa fees, flights, shipping, deposits, initial setup |
| Monthly ongoing costs | ✅ Done | Rent, utilities, groceries, transport, subscriptions |
| Buffer fund | ✅ Done | Automatically calculated as 15% of total one-time costs |
| User can ask AI to modify the budget | ✅ Done | `"Make it more realistic for a family of 3"` — AI updates the full budget |
| User can manually edit line items | ✅ Done | Direct item edit (label, amount, notes) — no AI call needed, instant update |
| Currency conversion | ✅ Done | All amounts can be shown in any currency alongside the original |
| Backend validates all figures | ✅ Done | Negative amounts clamped, suspicious figures flagged, totals always recalculated by backend (AI-generated totals are never trusted) |

---

### 5. Relocation Checklist

---

#### What the Client Asked For

> *"The AI chatbot should have a conversation box on the checklist tool page where a user can ask to have a checklist created for a move abroad. This should create a full checklist for their move which is sorted by the time it is relevant in relation to their move (6 months before, 3 months before, month before, week before, the month after, the 3 months after...etc). The AI should ask them questions to make the checklist more accurate and users should be able to manually edit or use the AI to edit the checklist as they please."*

#### What Was Delivered

| Requirement | Status | Detail |
|---|---|---|
| Conversation box on the checklist page | ✅ Done | Chat interface embedded on the checklist tool page |
| AI asks qualifying questions | ✅ Done | Asks about destination, move date, visa type, family situation |
| Checklist sorted by time phase | ✅ Done | 9 phases (see below) |
| Users can ask AI to update the checklist | ✅ Done | Natural language instructions — "Add a task for enrolling my kids in school" |
| Users can manually add their own tasks | ✅ Done | Custom task added to any phase with category and notes |
| Users can delete tasks | ✅ Done | Remove any item by ID |
| Status tracking per task | ✅ Done | Not Started / In Progress / Done — user updates as they go |
| Item density | ✅ Done | 5–8 meaningful tasks per phase (not padded with generic filler) |

**The 9 Time Phases:**

| Phase | When |
|---|---|
| 6 Months Before | Research, planning, document gathering |
| 3 Months Before | Visa applications, shipping quotes, notice periods |
| 1 Month Before | Flights, schooling, bank notifications |
| 2 Weeks Before | Final admin, packing |
| Moving Week | Travel, keys, utilities handover |
| First Month After | Registration, local SIM, healthcare |
| 3 Months After | Tax registration, settling in |
| 6 Months After | Review, renewals |
| Ongoing | Annual filings, insurance renewals |

---

### 6. General AI Chatbot

---

#### What the Client Asked For

> *"The AI chatbot should also be generally accessible via a conversation box on the home page and in the bottom right in a little pop-up. This chatbot should answer questions they have about countries, visa schemes or the general process of moving abroad, trained on credible sources. The chatbot should also be able to redirect users to the relevant pages on the website where requested. The chatbot should also be able to recommend service providers for the particular needs of the users and these service providers should only be from the catalogue of services listed on our website (both ecommerce service providers and affiliate pages like the Nord VPN page)."*

#### What Was Delivered

| Requirement | Status | Detail |
|---|---|---|
| Conversation box on the home page | ✅ Done | Full chat widget on the home page |
| Pop-up in the bottom right | ✅ Done | Floating chat widget available on all pages |
| Answers questions about countries | ✅ Done | Uses Google Search grounding for live, accurate answers |
| Answers questions about visa schemes | ✅ Done | Scoped to expat and relocation topics |
| Answers questions about the moving process | ✅ Done | |
| Redirects users to relevant pages | ✅ Done | AI can redirect to Visa Finder, Budget, Checklist, specific visa pages, partner pages |
| Only recommends approved catalogue providers | ✅ Done | Chatbot system prompt includes only the approved partner catalogue — competitors are never suggested |
| Includes ecommerce and affiliate providers | ✅ Done | Moving companies, health insurance, banking, currency transfer, VPN (NordVPN etc.) |
| Declines out-of-scope questions | ✅ Done | Does not give legal or financial investment advice; politely redirects |

**The approved partner categories currently in the catalogue:**
- Removal & Moving Companies
- Expat Health Insurance
- International Banking & Finance
- Currency Transfer
- VPN & Digital Privacy (including NordVPN)
- Legal & Immigration Services

> Adding a new partner to the catalogue requires a single edit to one file — no development work beyond that.

---

## How the AI Stays Accurate

This is a common concern with AI — making things up. Here is how we handle it:

| Risk | How We Prevent It |
|---|---|
| AI inventing visa fees | AI is instructed: if you can't find it from an official source, return null. Never guess. |
| Outdated information | AI searches live government websites on every request (Google Search grounding) |
| Wrong source | We verify sources are from official government domains (.gov, .gouv, .gob etc.) |
| Confidence labelling | Every visa and country page shows a confidence level: Full or Partial |
| Data verification date | Every visa page shows when the data was last verified from official sources |
| Impossible figures | Budget amounts are validated server-side — negative values and implausible totals are caught |

---

## Performance

| Feature | Response Time | Notes |
|---|---|---|
| Chatbot / Visa Finder | 3–8 seconds | Live AI generation |
| Visa Pages (first visit) | 8–15 seconds | AI + Google Search |
| Visa Pages (returning) | < 1 second | Served from 7-day cache |
| Country Pages (first visit) | 8–15 seconds | AI + Google Search |
| Country Pages (returning) | < 1 second | Served from 7-day cache |
| Budget / Checklist | 5–12 seconds | Live AI generation |

All AI responses stream to the screen in real time (text appears as it is generated, like ChatGPT), so the experience feels fast even before the full response is complete.

---

## Overall Delivery Status

| Feature | Delivered | Outstanding |
|---|---|---|
| Visa Finder AI | ✅ Fully built | — |
| Visa Detail Pages | ✅ Fully built | Country list spreadsheet not yet received |
| Country Profile Pages | ✅ Fully built | Country list spreadsheet not yet received |
| Budget Planner | ✅ Fully built | — |
| Relocation Checklist | ✅ Fully built | — |
| General Chatbot | ✅ Fully built | — |

**One outstanding item:** The country/visa page system is fully built and ready. Once the spreadsheet of countries is provided, those countries can be added to the supported list immediately — no further development required.

---

## What the AI Cannot Do

To keep the product trustworthy and professional, the AI has clear limits built in:

- It does **not** give legal advice (it refers users to a qualified immigration lawyer)
- It does **not** give financial investment advice
- It does **not** answer questions unrelated to expat living or relocation
- It does **not** recommend any service provider not listed in the approved catalogue
- It does **not** invent figures — if it cannot find a verified official source, it returns "data unavailable" rather than estimating

---

*MyFutureAbroad AI Backend — Built with Google Gemini 2.5 Pro + Google Search Grounding*
