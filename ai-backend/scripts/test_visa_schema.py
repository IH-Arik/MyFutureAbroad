import os
import sys
import json
import httpx
import dotenv
from pathlib import Path

# Load env variables
scripts_dir = Path(__file__).resolve().parent
backend_env = scripts_dir.parent.parent / "futureabroad-master" / "backend" / ".env"
if backend_env.exists():
    dotenv.load_dotenv(backend_env)

# Force UTF-8 output on Windows terminal
if hasattr(sys, "stdout") and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("❌ Error: Missing credentials.")
    sys.exit(1)

client = httpx.Client(headers={"apikey": key, "Authorization": f"Bearer {key}"})
try:
    res = client.get(f"{url.rstrip('/')}/rest/v1/visas?country_id=eq.22&select=id,name,path_to_residency_description,required_documents")
    res.raise_for_status()
    data = res.json()
    print(f"✅ Found {len(data)} visas for Germany:")
    for v in data:
        print(f"  - ID: {v['id']}, Name: '{v['name']}'")
        print(f"    Path to Residency: {v['path_to_residency_description']}")
        print(f"    Required Docs Count: {len(v['required_documents']) if v['required_documents'] else 0}")
except Exception as e:
    print("❌ Query failed:", e)
