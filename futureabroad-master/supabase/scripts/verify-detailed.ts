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

const DATA_DIR = path.resolve(__dirname, "../data/countries");

async function main() {
  console.log("🔍 Detailed verification of migrated countries and visas...");
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));

  let missingCountries = 0;
  let mismatchedVisas = 0;

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const { name, visas } = data;

    // Fetch country from DB
    const { data: dbCountry, error: cErr } = await supabase
      .from("countries")
      .select("id, name")
      .eq("name", name)
      .single();

    if (cErr || !dbCountry) {
      console.error(`❌ Country "${name}" is missing in the database!`);
      missingCountries++;
      continue;
    }

    // Fetch visas for this country
    const { data: dbVisas, error: vErr } = await supabase
      .from("visas")
      .select("id, name")
      .eq("country_id", dbCountry.id);

    if (vErr) {
      console.error(`❌ Error fetching visas for country "${name}":`, vErr.message);
      continue;
    }

    if (dbVisas.length < visas.length) {
      console.error(`⚠️ Visa count mismatch for "${name}": JSON has ${visas.length}, DB has ${dbVisas.length}`);
      console.log(`   JSON Visas:`, visas.map((v: any) => v.name));
      console.log(`   DB Visas  :`, dbVisas.map((v: any) => v.name));
      mismatchedVisas++;
    }
  }

  console.log("\n==========================================");
  console.log(`Detailed verification complete.`);
  console.log(`Countries checked: ${files.length}`);
  console.log(`Missing countries: ${missingCountries}`);
  console.log(`Mismatched visa counts: ${mismatchedVisas}`);
}

main().catch(console.error);
