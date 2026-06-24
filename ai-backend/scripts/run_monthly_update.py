#!/usr/bin/env python3
import os
import sys
import json
import time
import httpx
import argparse
from datetime import datetime, timezone
from pathlib import Path
import dotenv

# Load environment from parent directory or local .env
scripts_dir = Path(__file__).resolve().parent
backend_env = scripts_dir.parent.parent / "futureabroad-master" / "backend" / ".env"
ai_backend_env = scripts_dir.parent / ".env"

if backend_env.exists():
    dotenv.load_dotenv(backend_env)
if ai_backend_env.exists():
    dotenv.load_dotenv(ai_backend_env)

# Add app parent directory to sys.path to allow imports
sys.path.append(str(scripts_dir.parent))
from app.services.gemini import generate_structured_json, get_genai_client

# Initialize Supabase REST HTTP Client
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SERVICE_KEY:
    print("❌ Error: VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found in environment.")
    sys.exit(1)

SUPABASE_URL = SUPABASE_URL.rstrip("/")
supabase_client = httpx.Client(
    headers={
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "application/json"
    }
)

def fetch_countries():
    """Fetch all countries from Supabase using Range header to avoid 100 row limit."""
    response = supabase_client.get(
        f"{SUPABASE_URL}/rest/v1/countries?select=id,name,iso_code,continent&order=name.asc",
        headers={"Range": "0-999"}
    )
    response.raise_for_status()
    return response.json()

def fetch_visas(country_id):
    """Fetch all visas for a specific country from Supabase."""
    response = supabase_client.get(
        f"{SUPABASE_URL}/rest/v1/visas?country_id=eq.{country_id}&select=*",
        headers={"Range": "0-999"}
    )
    response.raise_for_status()
    return response.json()

def get_json_filepath(data_dir: str, iso_code: str, name: str) -> Path:
    """Finds the path to the local country JSON file, allowing minor formatting differences."""
    formatted_name = name.lower().replace(" ", "_").replace("-", "_").replace("(", "").replace(")", "").replace("'", "")
    filename = f"{iso_code.lower()}_{formatted_name}.json"
    p = Path(data_dir)
    if p.exists():
        for f in p.iterdir():
            if f.is_file() and f.name.startswith(f"{iso_code.lower()}_") and f.name.endswith(".json"):
                return f
    return p / filename

def update_local_json(iso_code, name, updated_country_fields, updated_visas):
    """Merges updated database fields back into the local JSON file to keep Git in sync."""
    data_dir = scripts_dir.parent.parent / "futureabroad-master" / "supabase" / "data" / "countries"
    json_path = get_json_filepath(str(data_dir), iso_code, name)
    
    if not json_path.exists():
        print(f"  ⚠️ Local JSON file not found at: {json_path}. Skipping file write.")
        return
        
    try:
        with open(json_path, "r", encoding="utf-8") as f:
            local_data = json.load(f)
            
        # Update country fields
        for k, v in updated_country_fields.items():
            if k in ["description", "longdescription", "tax_advice", "local_tips", "citizenship_requirements"]:
                local_data[k] = v
                
        # Map updated visas by name
        visas_by_name = {v["name"].lower(): v for v in updated_visas}
        
        if "visas" in local_data and isinstance(local_data["visas"], list):
            for i, v in enumerate(local_data["visas"]):
                v_name = v.get("name", "").lower()
                if v_name in visas_by_name:
                    updated_v = visas_by_name[v_name]
                    # Merge fields
                    for field in [
                        "description", "benefits", "min_income", "min_income_currency",
                        "min_savings", "min_savings_currency", "requires_health_insurance",
                        "requires_clean_criminal_record", "processing_time_days", "validity_months",
                        "renewable", "has_path_to_residency", "path_to_residency_description",
                        "application_fee_usd", "application_fee_currency", "required_documents",
                        "official_link"
                    ]:
                        if field in updated_v:
                            # Convert number type to support float/int matching
                            val = updated_v[field]
                            local_data["visas"][i][field] = val
                            
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(local_data, f, indent=2, ensure_ascii=False)
            
        print(f"  💾 Local JSON updated at: {json_path.name}")
    except Exception as e:
        print(f"  ❌ Failed to update local JSON: {e}")

def update_country_db(country_id, data):
    """Updates a country profile in the Supabase database."""
    # Check if updated_at exists or is supported
    # Note: we explicitly set updated_at to now() to satisfy schema audit tracking if column is present.
    try:
        response = supabase_client.patch(
            f"{SUPABASE_URL}/rest/v1/countries?id=eq.{country_id}",
            json={**data, "updated_at": datetime.now(timezone.utc).isoformat()}
        )
        response.raise_for_status()
    except httpx.HTTPStatusError as e:
        # If updated_at is not created yet, retry without it
        if "column" in e.response.text.lower() or "updated_at" in e.response.text.lower():
            print("  ⚠️ Column 'updated_at' does not exist in countries table. Retrying update without it...")
            response = supabase_client.patch(
                f"{SUPABASE_URL}/rest/v1/countries?id=eq.{country_id}",
                json=data
            )
            response.raise_for_status()
        else:
            raise

def update_visa_db(visa_id, data):
    """Updates a visa record in the Supabase database."""
    response = supabase_client.patch(
        f"{SUPABASE_URL}/rest/v1/visas?id=eq.{visa_id}",
        json={**data, "updated_at": datetime.now(timezone.utc).isoformat()}
    )
    response.raise_for_status()

def update_single_country(country, dry_run=False):
    """Updates profile information and all visas for a single country."""
    country_id = country["id"]
    country_name = country["name"]
    iso_code = country["iso_code"]
    
    print(f"\n🌐 Processing country: {country_name} ({iso_code}) [ID: {country_id}]")
    
    # 1. Update Country Expat Profile (Tax, Citizenship, Descriptions)
    country_sys_prompt = (
        "You are an expert expat relocation advisor. Your task is to perform an exhaustive search for the current, "
        f"accurate relocation and expat living profile for {country_name}. Use Google Search to find recent changes as of today.\n"
        "You must return ONLY a valid JSON object matching the detailed schema described below. "
        "Do NOT include any markdown code blocks, do NOT wrap your response in ```json ... ```, and do NOT include any preamble or postamble text. Return pure JSON only.\n"
        "JSON SCHEMA:\n"
        "{\n"
        "  \"description\": \"string, a short plain-text summary (2-3 sentences max) highlighting the country's main appeal for expats. Clean text, no markdown headers or lists.\",\n"
        "  \"longdescription\": \"string, a detailed 1-2 paragraph narrative covering expat life, culture, economy, and society. Clean text, no markdown headers.\",\n"
        "  \"tax_advice\": \"string, markdown bullet points detailing standard tax policies (corporate tax, personal income tax, VAT, etc.)\",\n"
        "  \"local_tips\": \"string, markdown bullet points listing practical tips (cost of living, language, safety, registration)\",\n"
        "  \"citizenship_requirements\": {\n"
        "    \"Citizenship by Descent\": { \"icon\": \"👨‍👩‍👧\", \"desc\": \"markdown string detailing descent rules\" },\n"
        "    \"Naturalization\": { \"icon\": \"📋\", \"desc\": \"markdown string detailing naturalization years/rules\" },\n"
        "    \"Birthright\": { \"icon\": \"🏙️\", \"desc\": \"markdown string detailing birthright/soil rules\" },\n"
        "    \"Spouse and Family\": { \"icon\": \"💍\", \"desc\": \"markdown string detailing marriage naturalization rules\" }\n"
        "  }\n"
        "}"
    )
    user_prompt = f"Scrape and return expat profile details for {country_name}."
    
    updated_country_fields = {}
    try:
        print("  🔍 Grounding search for country details...")
        updated_country_fields = generate_structured_json(
            country_sys_prompt,
            user_prompt,
            enable_search_grounding=True
        )
        print("  ✅ Country details successfully generated from search.")
    except Exception as e:
        print(f"  ❌ Failed to generate country details for {country_name}: {e}")
        return False

    # 2. Update Visas
    print("  📋 Fetching visas from database...")
    visas = fetch_visas(country_id)
    print(f"  ℹ️ Found {len(visas)} visa(s) in database.")
    
    updated_visas = []
    for visa in visas:
        visa_id = visa["id"]
        visa_name = visa["name"]
        print(f"    ➡️ Visa program: '{visa_name}'")
        
        visa_sys_prompt = (
            "You are an expert immigration researcher. Your task is to find the latest official requirements for the specified visa program. "
            "Check official migration agency portals or embassy directories for current fees, processing times, and income/savings requirements.\n"
            "You must return ONLY a valid JSON object matching the detailed schema described below. "
            "Do NOT include any markdown code blocks, do NOT wrap your response in ```json ... ```, and do NOT include any preamble or postamble text. Return pure JSON only.\n"
            "JSON SCHEMA:\n"
            "{\n"
            "  \"description\": \"string, short description of the visa program and eligibility\",\n"
            "  \"benefits\": [\"array of strings, key benefits/advantages (max 5 items)\"],\n"
            "  \"min_income\": number or null (monthly income required in currency below, e.g. 2000),\n"
            "  \"min_income_currency\": \"string or null, ISO 4217 code (e.g. EUR, USD, SEK)\",\n"
            "  \"min_savings\": number or null (lump sum savings required, e.g. 50000),\n"
            "  \"min_savings_currency\": \"string or null, ISO 4217 code (e.g. EUR, USD, SEK)\",\n"
            "  \"requires_health_insurance\": boolean,\n"
            "  \"requires_clean_criminal_record\": boolean,\n"
            "  \"processing_time_days\": integer or null,\n"
            "  \"validity_months\": integer or null,\n"
            "  \"renewable\": boolean,\n"
            "  \"has_path_to_residency\": boolean,\n"
            "  \"path_to_residency_description\": \"string or null\",\n"
            "  \"application_fee_usd\": number or null (fee in USD, or converted value if applicable),\n"
            "  \"application_fee_currency\": \"string or null, currency of the fee (e.g. USD, EUR, SEK)\",\n"
            "  \"required_documents\": [\"array of strings, required documents list\"],\n"
            "  \"official_link\": \"string, official govt application or info page URL\"\n"
            "}"
        )
        visa_user_prompt = f"Fetch current requirements and details for the '{visa_name}' program in {country_name}."
        
        try:
            print(f"      🔍 Grounding search for visa '{visa_name}'...")
            updated_visa_fields = generate_structured_json(
                visa_sys_prompt,
                visa_user_prompt,
                enable_search_grounding=True
            )
            updated_visa_fields["name"] = visa_name
            updated_visas.append(updated_visa_fields)
            print(f"      ✅ Visa requirements generated successfully.")
            
            # Rate limiting delay between visa queries to respect Gemini RPM limits
            time.sleep(4)
        except Exception as e:
            print(f"      ⚠️ Failed to update visa '{visa_name}': {e}. Skipping this visa.")
            # Keep original values if update failed so we don't clear database entries
            updated_visas.append(visa)
            
    # 3. Apply changes (Database & Local files)
    if dry_run:
        print("\n  [DRY RUN] Country Updates:")
        print(json.dumps(updated_country_fields, indent=2))
        print("  [DRY RUN] Visa Updates:")
        for uv in updated_visas:
            print(f"    - {uv.get('name')}: Fee: {uv.get('application_fee_usd')} USD, Income: {uv.get('min_income')} {uv.get('min_income_currency')}")
    else:
        print("\n  💾 Writing updates to database...")
        try:
            update_country_db(country_id, updated_country_fields)
            for uv in updated_visas:
                # Find matching db visa ID
                db_v = next((v for v in visas if v["name"].lower() == uv["name"].lower()), None)
                if db_v:
                    # Remove "name" field to avoid upserting key constraints if name is static
                    db_payload = {k: v for k, v in uv.items() if k != "name"}
                    update_visa_db(db_v["id"], db_payload)
            print("  ✅ Database records updated successfully.")
            
            # Sync local static JSON file
            update_local_json(iso_code, country_name, updated_country_fields, updated_visas)
        except Exception as e:
            print(f"  ❌ Database write failed: {e}")
            return False
            
    return True

def main():
    # Force UTF-8 output on Windows terminal
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass
            
    parser = argparse.ArgumentParser(description="Monthly automated country and visa data update pipeline.")
    parser.add_argument("--country", type=str, help="ISO code or name of a specific country to update (e.g. 'SE' or 'sweden')")
    parser.add_argument("--dry-run", action="store_true", help="Print updates without writing to DB or local JSON files")
    args = parser.parse_args()
    
    print("═" * 60)
    print("🌍 MYFUTUREABROAD — MONTHLY AUTOMATED COUNTRY UPDATE PIPELINE")
    print(f"⏰ Start Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    if args.dry_run:
        print("🧪 Mode: DRY RUN (No writes will be committed)")
    print("═" * 60)
    
    try:
        print("📋 Fetching country list from Supabase...")
        countries = fetch_countries()
        print(f"✅ Found {len(countries)} countries in database.")
    except Exception as e:
        print(f"❌ Failed to query countries: {e}")
        sys.exit(1)
        
    # Filter countries if specific country argument is provided
    if args.country:
        query = args.country.lower()
        countries = [
            c for c in countries 
            if c["iso_code"].lower() == query or c["name"].lower() == query
        ]
        if not countries:
            print(f"❌ Country '{args.country}' not found in database countries list.")
            sys.exit(1)
            
    success_count = 0
    fail_count = 0
    
    for c in countries:
        try:
            success = update_single_country(c, dry_run=args.dry_run)
            if success:
                success_count += 1
            else:
                fail_count += 1
        except Exception as e:
            print(f"❌ Unexpected error processing {c.get('name')}: {e}")
            fail_count += 1
            
        # Delay between countries to respect rate limits
        time.sleep(5)
        
    print("\n" + "═" * 60)
    print(f"🏁 Update Pipeline Finished!")
    print(f"  - Succeeded: {success_count}")
    print(f"  - Failed/Skipped: {fail_count}")
    print("═" * 60)

if __name__ == "__main__":
    main()
