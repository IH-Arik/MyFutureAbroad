/**
 * Auto-translate en.json → all DeepL-supported languages.
 *
 * Usage:
 *   DEEPL_API_KEY=your_key node scripts/translate.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = path.join(__dirname, "../src/i18n/locales");
const DEEPL_KEY = process.env.DEEPL_API_KEY || "62b88f3d-cb90-4eca-86bf-8cff2b1b2eed";
const DEEPL_URL = "https://api.deepl.com/v2/translate";
const CHUNK_SIZE = 50;

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
  { code: "ace",     deepl: "ACE"     },
  { code: "af",      deepl: "AF"      },
  { code: "sq",      deepl: "SQ"      },
  { code: "an",      deepl: "AN"      },
  { code: "hy",      deepl: "HY"      },
  { code: "as",      deepl: "AS"      },
  { code: "ay",      deepl: "AY"      },
  { code: "az",      deepl: "AZ"      },
  { code: "ba",      deepl: "BA"      },
  { code: "eu",      deepl: "EU"      },
  { code: "be",      deepl: "BE"      },
  { code: "bn",      deepl: "BN"      },
  { code: "bho",     deepl: "BHO"     },
  { code: "bs",      deepl: "BS"      },
  { code: "br",      deepl: "BR"      },
  { code: "my",      deepl: "MY"      },
  { code: "yue",     deepl: "YUE"     },
  { code: "ca",      deepl: "CA"      },
  { code: "ceb",     deepl: "CEB"     },
  { code: "zh-hans", deepl: "ZH-HANS" },
  { code: "zh-hant", deepl: "ZH-HANT" },
  { code: "hr",      deepl: "HR"      },
  { code: "prs",     deepl: "PRS"     },
  { code: "eo",      deepl: "EO"      },
  { code: "gl",      deepl: "GL"      },
  { code: "ka",      deepl: "KA"      },
  { code: "gn",      deepl: "GN"      },
  { code: "gu",      deepl: "GU"      },
  { code: "ht",      deepl: "HT"      },
  { code: "ha",      deepl: "HA"      },
  { code: "he",      deepl: "HE"      },
  { code: "hi",      deepl: "HI"      },
  { code: "is",      deepl: "IS"      },
  { code: "ig",      deepl: "IG"      },
  { code: "ga",      deepl: "GA"      },
  { code: "jv",      deepl: "JV"      },
  { code: "pam",     deepl: "PAM"     },
  { code: "kk",      deepl: "KK"      },
  { code: "gom",     deepl: "GOM"     },
  { code: "kmr",     deepl: "KMR"     },
  { code: "ckb",     deepl: "CKB"     },
  { code: "ky",      deepl: "KY"      },
  { code: "la",      deepl: "LA"      },
  { code: "ln",      deepl: "LN"      },
  { code: "lmo",     deepl: "LMO"     },
  { code: "lb",      deepl: "LB"      },
  { code: "mk",      deepl: "MK"      },
  { code: "mai",     deepl: "MAI"     },
  { code: "mg",      deepl: "MG"      },
  { code: "ms",      deepl: "MS"      },
  { code: "ml",      deepl: "ML"      },
  { code: "mt",      deepl: "MT"      },
  { code: "mi",      deepl: "MI"      },
  { code: "mr",      deepl: "MR"      },
  { code: "mn",      deepl: "MN"      },
  { code: "ne",      deepl: "NE"      },
  { code: "oc",      deepl: "OC"      },
  { code: "om",      deepl: "OM"      },
  { code: "pag",     deepl: "PAG"     },
  { code: "ps",      deepl: "PS"      },
  { code: "fa",      deepl: "FA"      },
  { code: "pt-br",   deepl: "PT-BR"   },
  { code: "pa",      deepl: "PA"      },
  { code: "qu",      deepl: "QU"      },
  { code: "sa",      deepl: "SA"      },
  { code: "sr",      deepl: "SR"      },
  { code: "st",      deepl: "ST"      },
  { code: "scn",     deepl: "SCN"     },
  { code: "es-419",  deepl: "ES-419"  },
  { code: "su",      deepl: "SU"      },
  { code: "sw",      deepl: "SW"      },
  { code: "tl",      deepl: "TL"      },
  { code: "tg",      deepl: "TG"      },
  { code: "ta",      deepl: "TA"      },
  { code: "tt",      deepl: "TT"      },
  { code: "te",      deepl: "TE"      },
  { code: "th",      deepl: "TH"      },
  { code: "ts",      deepl: "TS"      },
  { code: "tn",      deepl: "TN"      },
  { code: "tk",      deepl: "TK"      },
  { code: "ur",      deepl: "UR"      },
  { code: "uz",      deepl: "UZ"      },
  { code: "vi",      deepl: "VI"      },
  { code: "cy",      deepl: "CY"      },
  { code: "wo",      deepl: "WO"      },
  { code: "xh",      deepl: "XH"      },
  { code: "yi",      deepl: "YI"      },
  { code: "zu",      deepl: "ZU"      },
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

// ─── Translate one language file ───────────────────────────────────────────
async function translateLang(code, deepl) {
  const en = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, "en.json"), "utf8"));
  const flat = flatten(en);
  const keys = Object.keys(flat);
  const rawValues = Object.values(flat);

  const masked = rawValues.map(maskPlaceholders);
  const maskedValues = masked.map((m) => m.masked);
  const phSets = masked.map((m) => m.phs);

  const translated = [];
  for (const batch of chunk(maskedValues, CHUNK_SIZE)) {
    process.stdout.write(`  ${translated.length + 1}–${translated.length + batch.length}...`);
    const results = await deeplBatch(batch, deepl);
    translated.push(...results);
    process.stdout.write(" ✓\n");
  }

  const restored = translated.map((t, i) => unmask(t, phSets[i]));
  const nested = unflatten(Object.fromEntries(keys.map((k, i) => [k, restored[i]])));
  const outPath = path.join(LOCALES_DIR, `${code}.json`);
  fs.writeFileSync(outPath, JSON.stringify(nested, null, 2));
  console.log(`  ✅  Saved ${outPath}`);
}

// ─── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log(`🚀  Translating ${LANGUAGES.length} languages with DeepL...\n`);
  for (const { code, deepl } of LANGUAGES) {
    console.log(`🌍  ${deepl} (${code})`);
    try {
      await translateLang(code, deepl);
    } catch (err) {
      console.error(`  ❌  ${code}: ${err.message}`);
    }
  }
  console.log("\n✨  Done!");
}

main();
