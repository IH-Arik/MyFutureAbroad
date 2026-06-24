import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEED_CHUNKS_DIR = path.resolve(__dirname, "../seed_chunks");
const OUTPUT_DIR = path.resolve(__dirname, "../data/countries");

interface VisaEntry {
  name: string;
  visa_type: string;
  description: string;
  benefits: string[];
  min_income: number | null;
  min_income_currency: string | null;
  min_savings?: number | null;
  min_savings_currency?: string | null;
  requires_health_insurance: boolean;
  requires_clean_criminal_record: boolean;
  processing_time_days: number;
  validity_months: number;
  renewable: boolean;
  has_path_to_residency: boolean;
  path_to_residency_description: string | null;
  application_fee_usd: number;
  application_fee_currency: string;
  required_documents: string[];
  official_link: string;

  // Extra optional fields for complete schema
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
  citizenship_requirements?: Record<string, any>;
  tax_advice?: string;
  local_tips?: string;
  visas: VisaEntry[];
}

// Splits PostgreSQL file contents into individual statements, ignoring semicolons inside string literals
function splitSqlStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = "";
  let i = 0;
  while (i < sql.length) {
    if (sql[i] === "'") {
      current += sql[i];
      i++;
      while (i < sql.length) {
        if (sql[i] === "'" && sql[i + 1] === "'") {
          current += "''";
          i += 2;
        } else if (sql[i] === "'") {
          current += "'";
          i++;
          break;
        } else {
          current += sql[i];
          i++;
        }
      }
    } else if (sql[i] === ";") {
      statements.push(current);
      current = "";
      i++;
    } else {
      current += sql[i];
      i++;
    }
  }
  if (current.trim().length > 0) {
    statements.push(current);
  }
  return statements;
}

// Custom parser to parse PostgreSQL literal values correctly (handling strings with escaped single quotes, arrays, etc.)
function parseSqlValues(text: string): any[] {
  const values: any[] = [];
  let i = 0;
  while (i < text.length) {
    // Skip whitespace, newlines, and commas
    while (
      i < text.length &&
      (text[i] === " " ||
        text[i] === "\n" ||
        text[i] === "\r" ||
        text[i] === "\t" ||
        text[i] === ",")
    ) {
      i++;
    }
    if (i >= text.length) break;

    if (text[i] === "'") {
      // Parse string literal
      let str = "";
      i++; // skip opening single quote
      while (i < text.length) {
        if (text[i] === "'" && text[i + 1] === "'") {
          str += "'";
          i += 2;
        } else if (text[i] === "'") {
          i++; // skip closing single quote
          break;
        } else {
          str += text[i];
          i++;
        }
      }
      values.push(str);
    } else if (text.substring(i, i + 6).toLowerCase() === "array[") {
      // Parse array literal
      i += 6;
      const arr: string[] = [];
      while (i < text.length && text[i] !== "]") {
        while (
          i < text.length &&
          (text[i] === " " ||
            text[i] === "\n" ||
            text[i] === "\r" ||
            text[i] === "\t" ||
            text[i] === ",")
        ) {
          i++;
        }
        if (text[i] === "]") break;
        if (text[i] === "'") {
          let str = "";
          i++;
          while (i < text.length) {
            if (text[i] === "'" && text[i + 1] === "'") {
              str += "'";
              i += 2;
            } else if (text[i] === "'") {
              i++;
              break;
            } else {
              str += text[i];
              i++;
            }
          }
          arr.push(str);
        } else {
          i++;
        }
      }
      if (text[i] === "]") {
        i++;
        // Skip optional type casting like ::text[] or ::varchar[]
        if (text.substring(i, i + 8) === "::text[]") {
          i += 8;
        } else if (text.substring(i, i + 11) === "::varchar[]") {
          i += 11;
        }
      }
      values.push(arr);
    } else if (text.substring(i, i + 4).toLowerCase() === "null") {
      values.push(null);
      i += 4;
    } else if (text.substring(i, i + 4).toLowerCase() === "true") {
      values.push(true);
      i += 4;
    } else if (text.substring(i, i + 5).toLowerCase() === "false") {
      values.push(false);
      i += 5;
    } else if (/[0-9\-]/.test(text[i])) {
      // Parse number
      let numStr = "";
      while (i < text.length && /[0-9\.\-]/.test(text[i])) {
        numStr += text[i];
        i++;
      }
      values.push(Number(numStr));
    } else if (text[i] === "(") {
      // Sub-expression (e.g. SELECT statement)
      let depth = 1;
      let start = i;
      i++;
      while (i < text.length && depth > 0) {
        if (text[i] === "(") depth++;
        else if (text[i] === ")") depth--;
        i++;
      }
      values.push(text.substring(start, i));
    } else {
      i++;
    }
  }
  return values;
}

// Find matching parentheses to extract individual tuples
function extractTuples(block: string): string[] {
  const tuples: string[] = [];
  let i = 0;
  while (i < block.length) {
    while (i < block.length && block[i] !== "(") {
      i++;
    }
    if (i >= block.length) break;

    const start = i + 1;
    let depth = 1;
    i++;
    while (i < block.length && depth > 0) {
      if (block[i] === "(") depth++;
      else if (block[i] === ")") depth--;
      i++;
    }
    const extracted = block.substring(start, i - 1);
    tuples.push(extracted);
  }
  return tuples;
}

// Parses columns and values from split INSERT INTO statements
function parseInsertFromStatement(stmt: string, tableName: string): any[] {
  const insertRegex = new RegExp(`INSERT\\s+INTO\\s+(?:public\\.)?${tableName}\\s*\\(([^)]+)\\)\\s*VALUES\\s*([\\s\\S]+)`, "i");
  const match = insertRegex.exec(stmt);
  if (!match) return [];

  const columnsStr = match[1];
  const valuesBlock = match[2];
  const columns = columnsStr.split(",").map((c) => c.trim().toLowerCase());

  // Strip ON CONFLICT clause from valuesBlock
  const cleanValuesBlock = valuesBlock.replace(/ON\s+CONFLICT[\s\S]*$/i, "").trim();

  const tuples = extractTuples(cleanValuesBlock);
  const results: any[] = [];
  for (const tuple of tuples) {
    const parsedValues = parseSqlValues(tuple);
    if (parsedValues.length === columns.length) {
      const obj: any = {};
      for (let j = 0; j < columns.length; j++) {
        obj[columns[j]] = parsedValues[j];
      }
      results.push(obj);
    } else {
      console.warn(
        `[Parser Warning] Column count (${columns.length}) does not match value count (${parsedValues.length}) for table ${tableName}. Tuple starts with: ${tuple.trim().substring(0, 80)}...`
      );
    }
  }
  return results;
}

// Parses UPDATE statements for countries setting citizenship_requirements, tax_advice, extra_info, etc.
function parseUpdateFromStatement(stmt: string): { countryName: string; field: string; value: any }[] {
  const updateRegex = /UPDATE\s+(?:public\.)?countries\s+SET\s+([\s\S]+?)\s+WHERE\s+name\s*=\s*'([^']+)'/i;
  const match = updateRegex.exec(stmt);
  if (!match) return [];

  const setClause = match[1];
  const countryName = match[2];
  const updates: { countryName: string; field: string; value: any }[] = [];

  let i = 0;
  while (i < setClause.length) {
    while (
      i < setClause.length &&
      (setClause[i] === " " ||
        setClause[i] === "\n" ||
        setClause[i] === "\r" ||
        setClause[i] === "\t" ||
        setClause[i] === ",")
    ) {
      i++;
    }
    if (i >= setClause.length) break;

    let fieldName = "";
    while (i < setClause.length && /[a-zA-Z0-9_]/.test(setClause[i])) {
      fieldName += setClause[i];
      i++;
    }

    while (
      i < setClause.length &&
      (setClause[i] === " " ||
        setClause[i] === "=" ||
        setClause[i] === "\n" ||
        setClause[i] === "\r" ||
        setClause[i] === "\t")
    ) {
      i++;
    }

    if (setClause[i] === "'") {
      let valStr = "";
      i++;
      while (i < setClause.length) {
        if (setClause[i] === "'" && setClause[i + 1] === "'") {
          valStr += "'";
          i += 2;
        } else if (setClause[i] === "'") {
          i++;
          break;
        } else {
          valStr += setClause[i];
          i++;
        }
      }
      updates.push({ countryName, field: fieldName, value: valStr });
    } else {
      i++;
    }
  }
  return updates;
}

function cleanVisaName(name: string, type: string, description: string, countryName: string): string {
  const cleanName = name.trim();
  const desc = (description || "").toLowerCase();
  const country = countryName.trim();

  // If the visa name is a generic "<Country> Visa", "Swiss B Permit...", or "Swiss residence permit..."
  const isGeneric = 
    cleanName === `${country} Visa` ||
    cleanName === "Swiss B Permit (Switzerland)" ||
    cleanName === "Swiss residence permit (Switzerland)" ||
    // Also catch variants without parentheses or lowercase
    cleanName.toLowerCase() === `${country.toLowerCase()} visa`;

  if (!isGeneric) {
    return cleanName;
  }

  // Define country-specific mappings based on type and description contents
  if (country === "Austria") {
    if (type === "student") return "Austria Student Visa (Aufenthaltsbewilligung)";
    if (type === "work") {
      if (desc.includes("family reunification")) return "Austria Family Reunification Permit";
    }
    if (type === "startup") return "Austria Red-White-Red Card for Startup Founders";
  }

  if (country === "Belgium") {
    if (type === "student") return "Belgium Student Visa (Type D)";
    if (type === "work") {
      if (desc.includes("family reunification")) return "Belgium Family Reunification Visa";
      if (desc.includes("single permit") || desc.includes("permis unique")) return "Belgium Single Permit";
    }
  }

  if (country === "Switzerland") {
    if (cleanName === "Swiss B Permit (Switzerland)") {
      if (type === "startup") return "Swiss B Permit for Startup Founders";
      if (type === "work") {
        if (desc.includes("lump-sum")) return "Swiss B Permit (Lump-sum Taxation)";
        if (desc.includes("retirees")) return "Swiss B Permit for Retirees";
      }
      if (type === "family") return "Swiss B Permit for Family Reunification";
    }
    if (cleanName === "Swiss residence permit (Switzerland)") {
      if (type === "student") return "Swiss Student Residence Permit";
      if (type === "work") return "Swiss Work Residence Permit";
    }
  }

  if (country === "Cyprus") {
    if (type === "family") return "Cyprus Family Reunification Permit";
    if (type === "student") return "Cyprus Student Visa";
    if (type === "other" && desc.includes("category f")) return "Cyprus Category F Permanent Residence Permit";
  }

  if (country === "Germany") {
    if (type === "family" && desc.includes("blue card")) return "Germany EU Blue Card (Qualified)";
    if (type === "student") return "Germany Student Visa (Studentenvisum)";
    if (type === "work") {
      if (desc.includes("opportunity card") || desc.includes("chancenkarte")) return "Germany Opportunity Card (Chancenkarte)";
      if (desc.includes("family reunion") || desc.includes("familienzusammen")) return "Germany Family Reunion Visa";
      if (desc.includes("job seeker")) return "Germany Job Seeker Visa";
      if (desc.includes("self-employment") || desc.includes("freiberufler")) return "Germany Self-Employment Visa";
    }
  }

  if (country === "Denmark") {
    if (type === "student") return "Denmark Student Residence Permit";
    if (type === "work") return "Denmark Family Reunification Permit";
  }

  if (country === "Spain") {
    if (type === "student") return "Spain Student Visa";
    if (type === "startup") return "Spain Entrepreneur Visa";
    if (type === "work") {
      if (desc.includes("qualified occupation")) return "Spain Work Visa for Skilled Professionals";
      if (desc.includes("working holiday")) return "Spain Working Holiday Visa";
      if (desc.includes("job seeker")) return "Spain Job Seeker Visa";
      if (desc.includes("family reunification")) return "Spain Family Reunification Visa";
      if (desc.includes("self-employed") || desc.includes("cuenta propia")) return "Spain Self-Employed Visa";
      if (desc.includes("standard work visa") || desc.includes("cuenta ajena")) return "Spain Standard Work Visa";
      if (desc.includes("digital nomad")) return "Spain Digital Nomad Visa";
      if (desc.includes("non-lucrative")) return "Spain Non-Lucrative Visa";
    }
  }

  if (country === "Finland") {
    if (type === "student") return "Finland Student Residence Permit";
    if (type === "work") {
      if (desc.includes("family reunification")) return "Finland Family Reunification Permit";
      if (desc.includes("specialist")) return "Finland Specialist Work Permit";
    }
  }

  if (country === "France") {
    if (type === "student") return "France Student Visa (VLS-TS)";
    if (type === "work") return "France Family Reunification Visa";
    if (type === "other") return "France Long-Stay Visitor Visa (VLS-TS)";
    if (type === "startup") return "France Self-Employed & Entrepreneur Visa";
  }

  if (country === "Greece") {
    if (type === "work") {
      if (desc.includes("remote workers") || desc.includes("digital nomad")) return "Greece Digital Nomad Visa";
      if (desc.includes("self-employment")) return "Greece Self-Employment Visa";
    }
    if (type === "student") return "Greece Student Visa (Type D)";
    if (type === "work" && desc.includes("family reunification")) return "Greece Family Reunification Permit";
  }

  if (country === "Ireland") {
    if (type === "student") return "Ireland Student Visa (Stamp 2)";
    if (type === "work") {
      if (desc.includes("join family")) return "Ireland Join Family Visa";
      if (desc.includes("investor")) return "Ireland Immigrant Investor Programme";
      if (desc.includes("general employment")) return "Ireland General Employment Permit";
    }
  }

  if (country === "Italy") {
    if (type === "student") return "Italy Student Visa (Visto per Studio)";
    if (type === "tourist") return "Italy Short-Stay Schengen Visa (Type C)";
    if (type === "work") {
      if (desc.includes("job seeker")) return "Italy Job Seeker Visa";
      if (desc.includes("family reunification")) return "Italy Family Reunification Visa";
      if (desc.includes("working holiday")) return "Italy Working Holiday Visa";
      if (desc.includes("self-employment")) return "Italy Self-Employment Visa";
      if (desc.includes("investor") || desc.includes("golden visa")) return "Italy Investor Visa (Golden Visa)";
      if (desc.includes("remote worker") || desc.includes("digital nomad")) return "Italy Digital Nomad Visa";
    }
  }

  if (country === "Malta") {
    if (type === "student") return "Malta Student Visa";
    if (type === "family") return "Malta Permanent Residence Programme (MPRP)";
    if (type === "work") {
      if (desc.includes("family reunification")) return "Malta Family Reunification Permit";
      if (desc.includes("self-employment")) return "Malta Self-Employment Permit";
    }
  }

  if (country === "Norway") {
    if (type === "student") return "Norway Student Residence Permit";
    if (type === "work") return "Norway Family Immigration Permit";
  }

  if (country === "Poland") {
    if (type === "student") return "Poland Student Visa";
    if (type === "work") return "Poland Family Reunification Visa";
  }

  if (country === "Portugal") {
    if (desc.includes("d6")) return "Portugal D6 Family Reunification Visa";
    if (desc.includes("d1")) return "Portugal D1 Work Visa";
    if (desc.includes("job-seeker")) return "Portugal Job Seeker Visa";
    if (type === "student" || desc.includes("d4")) return "Portugal D4 Student Visa";
    if (desc.includes("tech visa")) return "Portugal Tech Visa";
    if (type === "startup" || desc.includes("startup")) return "Portugal Startup Visa (D2)";
    if (desc.includes("d3")) return "Portugal D3 Work Visa";
    if (desc.includes("d2")) return "Portugal D2 Freelance & Business Visa";
    if (desc.includes("digital nomad")) return "Portugal Digital Nomad Visa";
    if (desc.includes("golden visa")) return "Portugal Golden Visa";
  }

  if (country === "Sweden") {
    if (type === "student") return "Sweden Student Residence Permit";
    if (type === "work") {
      if (desc.includes("family reunification")) return "Sweden Family Reunification Residence Permit";
      if (desc.includes("self-employment")) return "Sweden Self-Employment Permit";
    }
  }

  if (country === "Turkey") {
    if (type === "student") return "Turkey Student Residence Permit";
    if (type === "work") {
      if (desc.includes("digital nomad")) return "Turkey Digital Nomad Visa";
      if (desc.includes("family")) return "Turkey Family Residence Permit";
    }
  }

  // Fallback if no specific rule matched: append the visa type to make it unique
  return `${cleanName} (${type})`;
}

async function run() {
  console.log("🚀 MyFutureAbroad — Unified Statement-Based SQL to JSON Country & Visa Parser");
  console.log("═".repeat(75));

  const countriesMap = new Map<string, CountryData>();
  const SEED_FILES = [
    "STEP02_chunk.sql",
    "STEP03_chunk.sql",
    "STEP04_chunk.sql",
    "STEP05_chunk.sql",
    "STEP06_chunk.sql",
    "NEW_countries_batch1.sql",
    "NEW_countries_batch1_visas_FIXED.sql",
    "NEW_countries_batch1_citizenship_tax.sql",
  ];

  // Pass 1: Parse Countries
  for (const filename of SEED_FILES) {
    const filepath = path.join(SEED_CHUNKS_DIR, filename);
    if (!fs.existsSync(filepath)) continue;

    const content = fs.readFileSync(filepath, "utf-8");
    const statements = splitSqlStatements(content);
    for (const stmt of statements) {
      const parsedCountries = parseInsertFromStatement(stmt, "countries");
      for (const rawCountry of parsedCountries) {
        const country: CountryData = {
          continent: rawCountry.continent,
          name: rawCountry.name,
          iso_code: rawCountry.iso_code?.trim(),
          flag_url: rawCountry.flag_url,
          highlight_img_url: rawCountry.highlight_img_url,
          description: rawCountry.description,
          longdescription: rawCountry.longdescription,
          visas: [],
        };
        countriesMap.set(country.name.toLowerCase(), country);
      }
    }
  }
  console.log(`Parsed ${countriesMap.size} unique country profiles.`);

  // Pass 2: Parse Visas
  let visaCount = 0;
  for (const filename of SEED_FILES) {
    const filepath = path.join(SEED_CHUNKS_DIR, filename);
    if (!fs.existsSync(filepath)) continue;

    const content = fs.readFileSync(filepath, "utf-8");
    const statements = splitSqlStatements(content);
    for (const stmt of statements) {
      const parsedVisas = parseInsertFromStatement(stmt, "visas");
      for (const rawVisa of parsedVisas) {
        const countryIdExpr = rawVisa.country_id;
        if (typeof countryIdExpr === "string") {
          const countryNameMatch = /where\s+name\s*=\s*'([^']+)'/i.exec(countryIdExpr);
          if (countryNameMatch) {
            const countryName = countryNameMatch[1];
            const country = countriesMap.get(countryName.toLowerCase());
            if (country) {
              const visa: VisaEntry = {
                name: cleanVisaName(rawVisa.name, rawVisa.visa_type, rawVisa.description, country.name),
                visa_type: rawVisa.visa_type,
                description: rawVisa.description,
                benefits: rawVisa.benefits || [],
                min_income: rawVisa.min_income,
                min_income_currency: rawVisa.min_income_currency,
                min_savings: rawVisa.min_savings,
                min_savings_currency: rawVisa.min_savings_currency,
                requires_health_insurance: !!rawVisa.requires_health_insurance,
                requires_clean_criminal_record: !!rawVisa.requires_clean_criminal_record,
                processing_time_days: rawVisa.processing_time_days || 0,
                validity_months: rawVisa.validity_months || 0,
                renewable: !!rawVisa.renewable,
                has_path_to_residency: !!rawVisa.has_path_to_residency,
                path_to_residency_description: rawVisa.path_to_residency_description || null,
                application_fee_usd: rawVisa.application_fee_usd || 0,
                application_fee_currency: rawVisa.application_fee_currency || "USD",
                required_documents: rawVisa.required_documents || [],
                official_link: rawVisa.official_link || "",

                // Extra schema columns
                min_age: rawVisa.min_age,
                max_age: rawVisa.max_age,
                required_skills: rawVisa.required_skills || [],
                eligible_nationalities: rawVisa.eligible_nationalities || [],
                excluded_nationalities: rawVisa.excluded_nationalities || [],
                image_url: rawVisa.image_url || null,
              };
              country.visas.push(visa);
              visaCount++;
            }
          }
        }
      }
    }
  }
  console.log(`Parsed and mapped ${visaCount} visas to countries.`);

  // Pass 3: Parse Updates (extra_info, citizenship_requirements, tax_advice)
  for (const filename of SEED_FILES) {
    const filepath = path.join(SEED_CHUNKS_DIR, filename);
    if (!fs.existsSync(filepath)) continue;

    const content = fs.readFileSync(filepath, "utf-8");
    const statements = splitSqlStatements(content);
    for (const stmt of statements) {
      const updates = parseUpdateFromStatement(stmt);
      for (const update of updates) {
        const country = countriesMap.get(update.countryName.toLowerCase());
        if (country) {
          if (update.field === "citizenship_requirements") {
            try {
              country.citizenship_requirements = JSON.parse(update.value);
            } catch (e) {
              console.error(`Failed to parse citizenship_requirements JSON for ${update.countryName}:`, e);
              country.citizenship_requirements = { error: "Failed to parse JSON", raw: update.value };
            }
          } else if (update.field === "tax_advice") {
            country.tax_advice = update.value;
          } else if (update.field === "extra_info") {
            country.extra_info = update.value;
          } else if (update.field === "local_tips") {
            country.local_tips = update.value;
          }
        }
      }
    }
  }
  console.log("Parsed and merged citizenship requirements, tax advice, and extra info.");

  // Output JSON files
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Clear output directory of existing JSONs first to keep it clean
  const existingFiles = fs.readdirSync(OUTPUT_DIR).filter((f) => f.endsWith(".json"));
  for (const f of existingFiles) {
    fs.unlinkSync(path.join(OUTPUT_DIR, f));
  }

  // Write JSON files
  for (const [_, country] of countriesMap.entries()) {
    if (!country.iso_code) {
      console.warn(`[Parser Warning] Country ${country.name} lacks ISO code. Skipping.`);
      continue;
    }
    const filename = `${country.iso_code.toLowerCase()}_${country.name.toLowerCase().replace(/\s+/g, "_")}.json`;
    const filepath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filepath, JSON.stringify(country, null, 2), "utf-8");
  }

  console.log(`\n🎉 Generated ${fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith(".json")).length} JSON files successfully!`);
}

run().catch((e) => {
  console.error("Error running parser:", e);
});
