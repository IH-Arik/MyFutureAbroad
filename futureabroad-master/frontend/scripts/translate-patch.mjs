/**
 * Patch missing i18n keys across all locale files.
 *
 * Unlike translate.mjs (which retranslates everything), this script:
 *  1. Reads en.json as the source of truth
 *  2. For each locale file, finds keys that exist in en.json but NOT in the locale
 *  3. Translates ONLY those missing keys via DeepL
 *  4. Merges them into the existing file without touching already-translated strings
 *
 * Usage:
 *   node scripts/translate-patch.mjs
 *   node scripts/translate-patch.mjs --only country  # patch only the "country.*" section
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = path.join(__dirname, "../public/locales");
const EN_SOURCE = path.join(__dirname, "../src/i18n/locales/en.json");
const DEEPL_KEY = process.env.DEEPL_API_KEY || "62b88f3d-cb90-4eca-86bf-8cff2b1b2eed";
const DEEPL_URL = "https://api.deepl.com/v2/translate";
const CHUNK_SIZE = 50;

// Optional prefix filter: --only <prefix>
const onlyPrefix = (() => {
  const idx = process.argv.indexOf("--only");
  return idx !== -1 ? process.argv[idx + 1] : null;
})();

const LANGUAGES = [
  { code: "es",      deepl: "ES"      },
  { code: "fr",      deepl: "FR"      },
  { code: "de",      deepl: "DE"      },
  { code: "pt",      deepl: "PT-PT"   },
  { code: "it",      deepl: "IT"      },
  { code: "nl",      deepl: "NL"      },
  { code: "pl",      deepl: "PL"      },
  { code: "ru",      deepl: "RU"      },
  { code: "uk",      deepl: "UK"      },
  { code: "tr",      deepl: "TR"      },
  { code: "sv",      deepl: "SV"      },
  { code: "da",      deepl: "DA"      },
  { code: "nb",      deepl: "NB"      },
  { code: "fi",      deepl: "FI"      },
  { code: "cs",      deepl: "CS"      },
  { code: "sk",      deepl: "SK"      },
  { code: "ro",      deepl: "RO"      },
  { code: "hu",      deepl: "HU"      },
  { code: "bg",      deepl: "BG"      },
  { code: "el",      deepl: "EL"      },
  { code: "id",      deepl: "ID"      },
  { code: "ja",      deepl: "JA"      },
  { code: "ko",      deepl: "KO"      },
  { code: "zh",      deepl: "ZH"      },
  { code: "ar",      deepl: "AR"      },
  { code: "lt",      deepl: "LT"      },
  { code: "lv",      deepl: "LV"      },
  { code: "et",      deepl: "ET"      },
  { code: "sl",      deepl: "SL"      },
  { code: "af",      deepl: "AF"      },
  { code: "sq",      deepl: "SQ"      },
  { code: "hy",      deepl: "HY"      },
  { code: "as",      deepl: "AS"      },
  { code: "az",      deepl: "AZ"      },
  { code: "be",      deepl: "BE"      },
  { code: "bn",      deepl: "BN"      },
  { code: "bs",      deepl: "BS"      },
  { code: "my",      deepl: "MY"      },
  { code: "yue",     deepl: "YUE"     },
  { code: "ca",      deepl: "CA"      },
  { code: "ceb",     deepl: "CEB"     },
  { code: "zh-hans", deepl: "ZH-HANS" },
  { code: "zh-hant", deepl: "ZH-HANT" },
  { code: "hr",      deepl: "HR"      },
  { code: "eo",      deepl: "EO"      },
  { code: "gl",      deepl: "GL"      },
  { code: "ka",      deepl: "KA"      },
  { code: "gu",      deepl: "GU"      },
  { code: "he",      deepl: "HE"      },
  { code: "hi",      deepl: "HI"      },
  { code: "is",      deepl: "IS"      },
  { code: "ig",      deepl: "IG"      },
  { code: "ga",      deepl: "GA"      },
  { code: "jv",      deepl: "JV"      },
  { code: "kk",      deepl: "KK"      },
  { code: "ky",      deepl: "KY"      },
  { code: "la",      deepl: "LA"      },
  { code: "mk",      deepl: "MK"      },
  { code: "mg",      deepl: "MG"      },
  { code: "ms",      deepl: "MS"      },
  { code: "ml",      deepl: "ML"      },
  { code: "mt",      deepl: "MT"      },
  { code: "mr",      deepl: "MR"      },
  { code: "mn",      deepl: "MN"      },
  { code: "ne",      deepl: "NE"      },
  { code: "fa",      deepl: "FA"      },
  { code: "pt-br",   deepl: "PT-BR"   },
  { code: "pa",      deepl: "PA"      },
  { code: "sr",      deepl: "SR"      },
  { code: "es-419",  deepl: "ES-419"  },
  { code: "sw",      deepl: "SW"      },
  { code: "tl",      deepl: "TL"      },
  { code: "ta",      deepl: "TA"      },
  { code: "te",      deepl: "TE"      },
  { code: "th",      deepl: "TH"      },
  { code: "tr",      deepl: "TR"      },
  { code: "uk",      deepl: "UK"      },
  { code: "ur",      deepl: "UR"      },
  { code: "uz",      deepl: "UZ"      },
  { code: "vi",      deepl: "VI"      },
  { code: "cy",      deepl: "CY"      },
  { code: "xh",      deepl: "XH"      },
  { code: "zu",      deepl: "ZU"      },
  { code: "ko",      deepl: "KO"      },
];

// ─── Placeholder masking ───────────────────────────────────────────────────
const PH_RE = /\{\{[^}]+\}\}/g;
function maskPlaceholders(text) {
  const phs = [];
  const masked = text.replace(PH_RE, (m) => { phs.push(m); return `__PH${phs.length - 1}__`; });
  return { masked, phs };
}
function unmask(text, phs) {
  return text.replace(/__PH(\d+)__/g, (_, i) => phs[Number(i)] ?? "");
}

// ─── Flatten / unflatten ───────────────────────────────────────────────────
function flatten(obj, prefix = "") {
  return Object.entries(obj).reduce((acc, [k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") acc[key] = v;
    else Object.assign(acc, flatten(v, key));
    return acc;
  }, {});
}
function unflatten(flat) {
  const result = {};
  for (const [key, val] of Object.entries(flat)) {
    const parts = key.split(".");
    let cur = result;
    for (let i = 0; i < parts.length - 1; i++) { cur[parts[i]] ??= {}; cur = cur[parts[i]]; }
    cur[parts.at(-1)] = val;
  }
  return result;
}
function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// ─── DeepL ────────────────────────────────────────────────────────────────
async function deeplBatch(texts, targetLang) {
  const body = new URLSearchParams();
  body.append("source_lang", "EN");
  body.append("target_lang", targetLang);
  texts.forEach((t) => body.append("text", t));
  const res = await fetch(DEEPL_URL, {
    method: "POST",
    headers: { Authorization: `DeepL-Auth-Key ${DEEPL_KEY}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`DeepL ${res.status}: ${await res.text()}`);
  return (await res.json()).translations.map((t) => t.text);
}

// ─── Patch one language file ───────────────────────────────────────────────
async function patchLang(code, deepl) {
  const outPath = path.join(LOCALES_DIR, `${code}.json`);

  const en = JSON.parse(fs.readFileSync(EN_SOURCE, "utf8"));
  const enFlat = flatten(en);

  // Load existing file if it exists, otherwise start from scratch
  let existingFlat = {};
  if (fs.existsSync(outPath)) {
    const existing = JSON.parse(fs.readFileSync(outPath, "utf8"));
    existingFlat = flatten(existing);
  }

  // Find missing keys (optionally filtered by prefix)
  let missingKeys = Object.keys(enFlat).filter((k) => !(k in existingFlat));
  if (onlyPrefix) missingKeys = missingKeys.filter((k) => k.startsWith(onlyPrefix + ".") || k === onlyPrefix);

  if (missingKeys.length === 0) {
    console.log(`  ${code}: already up to date ✓`);
    return;
  }

  console.log(`  ${code}: translating ${missingKeys.length} missing key(s)...`);

  const missingValues = missingKeys.map((k) => enFlat[k]);
  const masked = missingValues.map(maskPlaceholders);
  const maskedValues = masked.map((m) => m.masked);
  const phSets = masked.map((m) => m.phs);

  const translated = [];
  for (const batch of chunk(maskedValues, CHUNK_SIZE)) {
    const results = await deeplBatch(batch, deepl);
    translated.push(...results);
  }

  const restored = translated.map((t, i) => unmask(t, phSets[i]));

  // Merge: existing translations first, then fill in the gaps
  const mergedFlat = { ...existingFlat };
  missingKeys.forEach((k, i) => { mergedFlat[k] = restored[i]; });

  // Keep the key order from en.json
  const ordered = {};
  for (const k of Object.keys(enFlat)) {
    if (k in mergedFlat) ordered[k] = mergedFlat[k];
  }

  fs.writeFileSync(outPath, JSON.stringify(unflatten(ordered), null, 2));
  console.log(`  ${code}: saved ✅`);
}

// ─── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log(`🔍  Patching missing keys${onlyPrefix ? ` (section: "${onlyPrefix}")` : ""} across ${LANGUAGES.length} locale files...\n`);

  for (const { code, deepl } of LANGUAGES) {
    try {
      await patchLang(code, deepl);
    } catch (err) {
      console.error(`  ❌  ${code}: ${err.message}`);
    }
  }

  console.log("\n✨  Done!");
}

main();
