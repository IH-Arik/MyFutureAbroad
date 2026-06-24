import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../../backend/.env");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ Missing env credentials.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

async function main() {
  console.log("🔍 Verifying database counts in Supabase...");

  const { count: countryCount, error: countryErr } = await supabase
    .from("countries")
    .select("*", { count: "exact", head: true });

  const { count: visaCount, error: visaErr } = await supabase
    .from("visas")
    .select("*", { count: "exact", head: true });

  if (countryErr) console.error("❌ Error counting countries:", countryErr.message);
  else console.log(`🌍 Total Countries in DB: ${countryCount}`);

  if (visaErr) console.error("❌ Error counting visas:", visaErr.message);
  else console.log(`📄 Total Visas in DB: ${visaCount}`);
}

main().catch(console.error);
