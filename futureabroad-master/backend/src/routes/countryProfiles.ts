import { Router } from "express";

const router = Router();

// 0 = high tax, 3 = no/very low tax — based on documented tax law
const TAX_SCORES: Record<string, number> = {
  AE: 3, BH: 3, KW: 3, QA: 3, OM: 3, SA: 3, // Gulf - 0% income tax
  MC: 3, BS: 3,                                 // Monaco, Bahamas
  GE: 2, PT: 2, MT: 2, CY: 2,                  // NHR / non-dom regimes
  PY: 2, PA: 2, UY: 2, CR: 2, PH: 2, MY: 2,   // Territorial tax countries
  TH: 2,                                         // Thailand - territorial
  SG: 2, IE: 1, EE: 1,                          // Low-mid
  HU: 1, CZ: 1, PL: 1, RO: 1, HR: 1, SK: 1, BG: 1, LV: 1, LT: 1,
  ES: 1, IT: 1, GR: 1, MX: 1, CO: 1, ID: 1, VN: 1, IN: 1,
  AT: 0, BE: 0, DE: 0, FR: 0, NL: 0,           // High tax EU
  DK: 0, SE: 0, NO: 0, FI: 0,                  // Very high Nordic
  GB: 0, CH: 1, AU: 0, NZ: 0, CA: 0, US: 0,
  JP: 0, KR: 0,
};

// Based on capital city average annual temperature
// 3 = warm >22°C avg, 2 = mild 16-22°C, 1 = cool 10-16°C, 0 = cold <10°C
const CLIMATE_SCORES: Record<string, number> = {
  TH: 3, MY: 3, ID: 3, PH: 3, VN: 3, KH: 3, SG: 3,
  AE: 2, QA: 2, BH: 2, KW: 2, SA: 2, OM: 2,
  MX: 3, CR: 3, PA: 3, CO: 2, BR: 3, AR: 2,
  EG: 3, MA: 3, TN: 3, NG: 3, GH: 3, KE: 2,
  IN: 3, PK: 2, BD: 3,
  PT: 3, ES: 2, IT: 2, GR: 3, CY: 3, MT: 3, HR: 2, TR: 2,
  GB: 1, IE: 1, FR: 1, BE: 1, NL: 1,
  DE: 1, PL: 1, CZ: 1, SK: 1, HU: 1, RO: 1, BG: 1, CH: 1, AT: 1,
  EE: 0, LV: 0, LT: 0, FI: 0, SE: 0, NO: 0, DK: 0,
  AU: 2, NZ: 1, CA: 0, US: 1, JP: 1, KR: 1,
};

// Based on EF English Proficiency Index 2024 + official language status
// 3 = primary/very high, 2 = high, 1 = moderate, 0 = low
const ENGLISH_SCORES: Record<string, number> = {
  US: 3, GB: 3, AU: 3, NZ: 3, CA: 3, IE: 3, SG: 3, MT: 3,
  BS: 3, PH: 3, NG: 3, GH: 3,
  NL: 3, SE: 3, NO: 3, DK: 3,
  AE: 3,
  DE: 2, AT: 2, CH: 2, BE: 2, FI: 2, PT: 2, PL: 2, CZ: 2, SK: 2,
  EE: 2, LV: 2, LT: 2, HR: 2, RO: 2, CY: 2, MY: 2, IN: 2, KE: 2,
  ES: 1, IT: 1, FR: 1, GR: 1, HU: 1, BG: 1, TR: 1,
  TH: 1, ID: 1, VN: 1, MX: 1, CO: 1, AR: 1, BR: 1, CR: 1, PA: 1,
  EG: 1, MA: 1, JP: 1, KR: 1, PK: 1,
  KH: 0, BD: 0,
};

// ISO-2 → ISO-3 for World Bank API lookup
const ISO2_TO_ISO3: Record<string, string> = {
  AE: "ARE", BH: "BHR", KW: "KWT", QA: "QAT", OM: "OMN", SA: "SAU",
  PT: "PRT", ES: "ESP", IT: "ITA", GR: "GRC", DE: "DEU", FR: "FRA",
  NL: "NLD", BE: "BEL", AT: "AUT", CH: "CHE", GB: "GBR", IE: "IRL",
  SE: "SWE", NO: "NOR", DK: "DNK", FI: "FIN", PL: "POL", CZ: "CZE",
  SK: "SVK", HU: "HUN", RO: "ROU", BG: "BGR", HR: "HRV", EE: "EST",
  LV: "LVA", LT: "LTU", CY: "CYP", MT: "MLT", GE: "GEO", MC: "MCO",
  TH: "THA", MY: "MYS", SG: "SGP", ID: "IDN", PH: "PHL", VN: "VNM",
  IN: "IND", PK: "PAK", BD: "BGD", KH: "KHM",
  AU: "AUS", NZ: "NZL", CA: "CAN", US: "USA",
  JP: "JPN", KR: "KOR",
  MX: "MEX", CO: "COL", BR: "BRA", AR: "ARG", CR: "CRI", PA: "PAN",
  PY: "PRY", UY: "URY",
  EG: "EGY", MA: "MAR", TN: "TUN", NG: "NGA", GH: "GHA", KE: "KEN",
  TR: "TUR", BS: "BHS",
};

function normalizeHealthcare(v: number | null): number {
  if (!v) return 0;
  if (v >= 4000) return 3;
  if (v >= 2000) return 2;
  if (v >= 800)  return 1;
  return 0;
}

function normalizeSafety(homicides: number | null): number {
  if (homicides === null || homicides === undefined) return 1;
  if (homicides <= 1) return 3;
  if (homicides <= 3) return 2;
  if (homicides <= 8) return 1;
  return 0;
}

// PPP-adjusted GDP per capita — lower = cheaper country
function normalizeCost(pppGdp: number | null): number {
  if (!pppGdp) return 1;
  if (pppGdp <= 12000) return 3;  // cheap
  if (pppGdp <= 28000) return 2;  // affordable
  if (pppGdp <= 52000) return 1;  // moderate
  return 0;                        // expensive
}

let cache: { data: Record<string, Record<string, number>>; timestamp: number } | null = null;
const CACHE_TTL = 24 * 60 * 60 * 1000;

router.get("/", async (_req, res) => {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return res.json(cache.data);
  }

  try {
    const WB = "https://api.worldbank.org/v2/country/all/indicator";
    const params = "?format=json&mrv=1&per_page=300";

    const [healthRes, safetyRes, costRes] = await Promise.all([
      fetch(`${WB}/SH.XPD.CHEX.PC.CD${params}`),
      fetch(`${WB}/VC.IHR.PSRC.P5${params}`),
      fetch(`${WB}/NY.GDP.PCAP.PP.CD${params}`),
    ]);

    const [healthData, safetyData, costData] = await Promise.all([
      healthRes.json() as Promise<any[]>,
      safetyRes.json() as Promise<any[]>,
      costRes.json() as Promise<any[]>,
    ]);

    const extract = (data: any[]): Record<string, number> => {
      const map: Record<string, number> = {};
      for (const entry of (data[1] || [])) {
        if (entry.countryiso3code && entry.value !== null) {
          map[entry.countryiso3code] = entry.value;
        }
      }
      return map;
    };

    const healthMap = extract(healthData);
    const safetyMap = extract(safetyData);
    const costMap   = extract(costData);

    const allIso2 = new Set([
      ...Object.keys(TAX_SCORES),
      ...Object.keys(CLIMATE_SCORES),
      ...Object.keys(ENGLISH_SCORES),
    ]);

    const profiles: Record<string, Record<string, number>> = {};

    for (const iso2 of allIso2) {
      const iso3 = ISO2_TO_ISO3[iso2];
      profiles[iso2] = {
        tax:        TAX_SCORES[iso2]     ?? 1,
        climate:    CLIMATE_SCORES[iso2] ?? 1,
        healthcare: normalizeHealthcare(iso3 ? healthMap[iso3] : null),
        cost:       normalizeCost(iso3 ? costMap[iso3] : null),
        safety:     normalizeSafety(iso3 ? safetyMap[iso3] : null),
        english:    ENGLISH_SCORES[iso2] ?? 0,
      };
    }

    cache = { data: profiles, timestamp: Date.now() };
    res.json(profiles);
  } catch (err) {
    console.error("Country profiles error:", err);
    res.status(500).json({ error: "Failed to fetch country profiles" });
  }
});

export default router;
