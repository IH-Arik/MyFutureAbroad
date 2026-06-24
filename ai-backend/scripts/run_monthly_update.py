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

def parse_numeric(val):
    if val is None:
        return None
    if isinstance(val, (int, float)):
        return val
    if isinstance(val, str):
        cleaned = val.strip().lower()
        if cleaned in ["none", "n/a", "null", "unknown", "free", "varies", "no", "not applicable", "not specified", ""]:
            return None
        # Remove spaces
        cleaned = cleaned.replace(" ", "")
        import re
        # If there's a comma and a dot, remove comma (e.g. 1,250.50 -> 1250.50)
        if "," in cleaned and "." in cleaned:
            if cleaned.find(",") < cleaned.find("."):
                cleaned = cleaned.replace(",", "")
            else:
                # European style: 1.250,50 -> remove dot, replace comma with dot
                cleaned = cleaned.replace(".", "").replace(",", ".")
        elif "," in cleaned:
            # Only comma. Is it thousands or decimals?
            parts = cleaned.split(",")
            if len(parts) == 2 and len(parts[1]) == 2:
                cleaned = cleaned.replace(",", ".")
            else:
                cleaned = cleaned.replace(",", "")
        
        # Match number pattern: optional negative sign, digits, optional dot and digits
        match = re.search(r"-?\d+(?:\.\d+)?", cleaned)
        if match:
            try:
                num_str = match.group(0)
                if "." in num_str:
                    return float(num_str)
                else:
                    return int(num_str)
            except ValueError:
                return None
    return None

def parse_integer(val):
    num = parse_numeric(val)
    if num is not None:
        return int(round(num))
    return None

def parse_boolean(val, default=False):
    if val is None:
        return default
    if isinstance(val, bool):
        return val
    if isinstance(val, (int, float)):
        return bool(val)
    if isinstance(val, str):
        cleaned = val.strip().lower()
        if cleaned in ["true", "yes", "1", "y", "required"]:
            return True
        if cleaned in ["false", "no", "0", "n", "none", "null", "n/a", "not required", "no requirement"]:
            return False
        # Check standard indicators
        if "not required" in cleaned or "no " in cleaned or "does not" in cleaned or "false" in cleaned:
            return False
        if "required" in cleaned or "yes" in cleaned or "true" in cleaned:
            return True
    return default

def parse_currency(val):
    if not val:
        return None
    if isinstance(val, str):
        cleaned = val.strip().upper()
        import re
        match = re.search(r"[A-Z]{3}", cleaned)
        if match:
            return match.group(0)
    return None

def parse_string_list(val):
    if val is None:
        return []
    if isinstance(val, list):
        cleaned_list = []
        for item in val:
            if item is not None:
                cleaned_list.append(str(item).strip())
        return cleaned_list
    if isinstance(val, str):
        trimmed = val.strip()
        if trimmed.startswith("[") and trimmed.endswith("]"):
            try:
                parsed = json.loads(trimmed)
                if isinstance(parsed, list):
                    return parse_string_list(parsed)
            except:
                pass
        if "\n" in trimmed:
            return [line.strip().lstrip("-*• ").strip() for line in trimmed.split("\n") if line.strip()]
        if "," in trimmed:
            return [item.strip() for item in trimmed.split(",") if item.strip()]
        return [trimmed]
    return []

def sanitize_visa_fields(visa_data):
    """
    Sanitizes visa fields to match Supabase schema types and prevent 400 Bad Request.
    """
    if not isinstance(visa_data, dict):
        return {}
        
    sanitized = {}
    
    # Text fields
    sanitized["name"] = str(visa_data.get("name", "")).strip() if visa_data.get("name") else None
    sanitized["visa_type"] = str(visa_data.get("visa_type", "")).strip() if visa_data.get("visa_type") else None
    sanitized["description"] = str(visa_data.get("description", "")).strip() if visa_data.get("description") else None
    sanitized["path_to_residency_description"] = str(visa_data.get("path_to_residency_description", "")).strip() if visa_data.get("path_to_residency_description") else None
    sanitized["official_link"] = str(visa_data.get("official_link", "")).strip() if visa_data.get("official_link") else None
    sanitized["image_url"] = str(visa_data.get("image_url", "")).strip() if visa_data.get("image_url") else None
    
    # Numeric fields
    sanitized["min_income"] = parse_numeric(visa_data.get("min_income"))
    sanitized["min_savings"] = parse_numeric(visa_data.get("min_savings"))
    sanitized["application_fee_usd"] = parse_numeric(visa_data.get("application_fee_usd"))
    
    # Integer fields
    sanitized["min_age"] = parse_integer(visa_data.get("min_age"))
    sanitized["max_age"] = parse_integer(visa_data.get("max_age"))
    sanitized["processing_time_days"] = parse_integer(visa_data.get("processing_time_days"))
    sanitized["validity_months"] = parse_integer(visa_data.get("validity_months"))
    
    # Currency fields
    sanitized["min_income_currency"] = parse_currency(visa_data.get("min_income_currency"))
    sanitized["min_savings_currency"] = parse_currency(visa_data.get("min_savings_currency"))
    sanitized["application_fee_currency"] = parse_currency(visa_data.get("application_fee_currency"))
    
    # Boolean fields
    sanitized["requires_health_insurance"] = parse_boolean(visa_data.get("requires_health_insurance"), default=False)
    sanitized["requires_clean_criminal_record"] = parse_boolean(visa_data.get("requires_clean_criminal_record"), default=False)
    sanitized["renewable"] = parse_boolean(visa_data.get("renewable"), default=False)
    sanitized["has_path_to_residency"] = parse_boolean(visa_data.get("has_path_to_residency"), default=False)
    
    # Array fields
    sanitized["benefits"] = parse_string_list(visa_data.get("benefits"))
    sanitized["required_skills"] = parse_string_list(visa_data.get("required_skills"))
    sanitized["eligible_nationalities"] = parse_string_list(visa_data.get("eligible_nationalities"))
    sanitized["excluded_nationalities"] = parse_string_list(visa_data.get("excluded_nationalities"))
    sanitized["required_documents"] = parse_string_list(visa_data.get("required_documents"))
    
    # JSONB field
    additional_info = visa_data.get("additional_info")
    if additional_info:
        if isinstance(additional_info, dict):
            sanitized["additional_info"] = additional_info
        elif isinstance(additional_info, str):
            try:
                sanitized["additional_info"] = json.loads(additional_info)
            except:
                sanitized["additional_info"] = {"raw": additional_info}
        else:
            sanitized["additional_info"] = {"info": additional_info}
    else:
        sanitized["additional_info"] = None
        
    return sanitized

def sanitize_country_fields(country_data):
    """
    Sanitizes country fields to prevent type/schema mismatches.
    """
    if not isinstance(country_data, dict):
        return {}
        
    sanitized = {}
    
    # Text fields
    for field in ["description", "longdescription", "tax_advice", "local_tips"]:
        if field in country_data:
            val = country_data[field]
            sanitized[field] = str(val).strip() if val is not None else None
            
    # JSONB fields
    citizenship_requirements = country_data.get("citizenship_requirements")
    if citizenship_requirements:
        if isinstance(citizenship_requirements, dict):
            # Ensure it has the correct nested structure
            sanitized["citizenship_requirements"] = {}
            for category, details in citizenship_requirements.items():
                if isinstance(details, dict):
                    sanitized["citizenship_requirements"][category] = {
                        "icon": str(details.get("icon", "")).strip(),
                        "desc": str(details.get("desc", "")).strip()
                    }
                else:
                    sanitized["citizenship_requirements"][category] = {
                        "icon": "📋",
                        "desc": str(details).strip()
                    }
        else:
            sanitized["citizenship_requirements"] = {"info": str(citizenship_requirements)}
            
    return sanitized

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
    try:
        response = supabase_client.patch(
            f"{SUPABASE_URL}/rest/v1/visas?id=eq.{visa_id}",
            json={**data, "updated_at": datetime.now(timezone.utc).isoformat()}
        )
        response.raise_for_status()
    except httpx.HTTPStatusError as e:
        print(f"  ❌ Visa update failed (HTTP {e.response.status_code}): {e.response.text}")
        raise

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
        raw_country_fields = generate_structured_json(
            country_sys_prompt,
            user_prompt,
            enable_search_grounding=True
        )
        updated_country_fields = sanitize_country_fields(raw_country_fields)
        print("  ✅ Country details successfully generated and sanitized from search.")
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
            raw_visa_fields = generate_structured_json(
                visa_sys_prompt,
                visa_user_prompt,
                enable_search_grounding=True
            )
            raw_visa_fields["name"] = visa_name
            updated_visa_fields = sanitize_visa_fields(raw_visa_fields)
            updated_visas.append(updated_visa_fields)
            print(f"      ✅ Visa requirements generated and sanitized successfully.")
            
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
