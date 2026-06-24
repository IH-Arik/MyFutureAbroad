#!/usr/bin/env tsx
/**
 * seed-countries.ts
 *
 * Reads JSON files from ../data/countries/ and upserts each country
 * (profile + visas) into Supabase using the service role key.
 *
 * Usage:
 *   npx tsx seed-countries.ts                   # seed all countries
 *   npx tsx seed-countries.ts --country=bh      # seed only Bahrain (by iso_code)
 *   npx tsx seed-countries.ts --dry-run         # preview without writing
 *
 * Requirements:
 *   - Run from futureabroad-master/backend/ so .env is loaded
 *   - OR set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env
 *
 * From the backend directory:
 *   npx tsx ../supabase/scripts/seed-countries.ts
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// ── Load .env from backend directory ────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../../backend/.env");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config(); // fallback: load from cwd
}

// ── Config ───────────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const DATA_DIR = path.resolve(__dirname, "../data/countries");

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
  process.exit(1);
}

// ── Types ────────────────────────────────────────────────────────────────────
interface VisaEntry {
  name: string;
  visa_type: string;
  description: string;
  benefits: string[];
  min_income?: number | null;
  min_income_currency?: string | null;
  min_savings?: number | null;
  min_savings_currency?: string | null;
  requires_health_insurance: boolean;
  requires_clean_criminal_record: boolean;
  processing_time_days: number;
  validity_months: number;
  renewable: boolean;
  has_path_to_residency: boolean;
  path_to_residency_description?: string | null;
  application_fee_usd: number;
  application_fee_currency: string;
  required_documents: string[];
  official_link: string;

  // Extra optional fields for complete original schema
  min_age?: number | null;
  max_age?: number | null;
  required_skills?: string[];
  eligible_nationalities?: string[];
  excluded_nationalities?: string[];
  image_url?: string | null;
}

interface CountryData {
  continent: string;
  name: string;
  iso_code: string;
  flag_url: string;
  highlight_img_url: string;
  description: string;
  longdescription: string;
  extra_info?: string;
  citizenship_requirements?: Record<string, unknown>;
  tax_advice?: string;
  local_tips?: string;
  visas: VisaEntry[];
}

// ── Parse CLI args ────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const countryFilter = args.find((a) => a.startsWith("--country="))?.split("=")[1]?.toLowerCase();

// ── Supabase client (service role = bypasses RLS) ────────────────────────────
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

// ── Load all JSON files ───────────────────────────────────────────────────────
function loadCountryFiles(): { file: string; data: CountryData }[] {
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`❌ Data directory not found: ${DATA_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));

  if (files.length === 0) {
    console.error("❌ No JSON files found in data/countries/");
    process.exit(1);
  }

  return files
    .filter((f) => {
      if (!countryFilter) return true;
      // match by iso prefix (e.g. "bh") or full slug (e.g. "bh_bahrain")
      const slug = f.replace(".json", "").toLowerCase();
      return slug.startsWith(countryFilter) || slug.includes(countryFilter);
    })
    .map((f) => {
      const filePath = path.join(DATA_DIR, f);
      const raw = fs.readFileSync(filePath, "utf-8");
      try {
        return { file: f, data: JSON.parse(raw) as CountryData };
      } catch (e) {
        console.error(`❌ Failed to parse ${f}: ${e}`);
        process.exit(1);
      }
    });
}

// ── Upsert one country ────────────────────────────────────────────────────────
async function seedCountry(file: string, data: CountryData): Promise<void> {
  const { visas, ...countryFields } = data;

  if (isDryRun) {
    console.log(`  [dry-run] Would upsert: ${data.name} + ${visas.length} visa(s)`);
    return;
  }

  // 1. Upsert country row
  const { data: countryRow, error: countryErr } = await supabase
    .from("countries")
    .upsert(countryFields, { onConflict: "name" })
    .select("id")
    .single();

  if (countryErr || !countryRow) {
    throw new Error(`Country upsert failed: ${countryErr?.message}`);
  }

  const countryId = countryRow.id;

  // 2. Upsert each visa
  if (visas.length === 0) {
    console.log(`  ✅ ${data.name} (${data.iso_code}) — country upserted, 0 visas`);
    return;
  }

  const visaRows = visas.map((v) => ({
    ...v,
    country_id: countryId,
  }));

  const { error: visaErr } = await supabase.from("visas").upsert(visaRows, {
    onConflict: "name,country_id",
  });

  if (visaErr) {
    throw new Error(`Visa upsert failed: ${visaErr.message}`);
  }

  console.log(
    `  ✅ ${data.name} (${data.iso_code}) — country upserted, ${visas.length} visa(s) upserted`
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🌍 MyFutureAbroad — Country Seed Script");
  console.log("═".repeat(50));

  if (isDryRun) console.log("  Mode: DRY RUN (no writes)\n");
  if (countryFilter) console.log(`  Filter: --country=${countryFilter}\n`);

  const entries = loadCountryFiles();
  console.log(`  Found ${entries.length} country file(s) to process.\n`);

  let success = 0;
  let failed = 0;
  const errors: { file: string; error: string }[] = [];

  for (const { file, data } of entries) {
    try {
      await seedCountry(file, data);
      success++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`  ❌ ${data?.name ?? file} — ${msg}`);
      errors.push({ file, error: msg });
      failed++;
    }
  }

  console.log("\n" + "═".repeat(50));
  console.log(`  Summary: ${success} succeeded, ${failed} failed`);

  if (errors.length > 0) {
    console.log("\n  Errors:");
    for (const { file, error } of errors) {
      console.log(`    • ${file}: ${error}`);
    }
    process.exit(1);
  }

  console.log("\n  ✅ All done!\n");
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
