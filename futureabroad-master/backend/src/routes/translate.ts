import { Router, Request, Response } from "express";

const router = Router();

// ─── Rate limiter: 30 requests per IP per 10 minutes ──────────────────────
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 200;
const ipMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipMap.get(ip);
  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  if (entry.count > MAX_REQUESTS) return true;
  return false;
}

// Clean up old entries every 10 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of ipMap.entries()) {
    if (now > entry.resetAt) ipMap.delete(ip);
  }
}, WINDOW_MS);

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_ENDPOINT = "https://api.deepl.com/v2/translate";

const LANG_MAP: Record<string, string> = {
  es: "ES", fr: "FR", de: "DE", pt: "PT-PT", it: "IT", nl: "NL",
  pl: "PL", ru: "RU", uk: "UK", tr: "TR", sv: "SV", da: "DA",
  nb: "NB", fi: "FI", cs: "CS", sk: "SK", ro: "RO", hu: "HU",
  bg: "BG", el: "EL", id: "ID", ja: "JA", ko: "KO", zh: "ZH",
  ar: "AR", lt: "LT", lv: "LV", et: "ET", sl: "SL",
  ace: "ACE", af: "AF", sq: "SQ", an: "AN", hy: "HY", as: "AS",
  ay: "AY", az: "AZ", ba: "BA", eu: "EU", be: "BE", bn: "BN",
  bho: "BHO", bs: "BS", br: "BR", my: "MY", yue: "YUE", ca: "CA",
  ceb: "CEB", "zh-hans": "ZH-HANS", "zh-hant": "ZH-HANT", hr: "HR",
  prs: "PRS", eo: "EO", gl: "GL", ka: "KA", gn: "GN", gu: "GU",
  ht: "HT", ha: "HA", he: "HE", hi: "HI", is: "IS", ig: "IG",
  ga: "GA", jv: "JV", pam: "PAM", kk: "KK", gom: "GOM", kmr: "KMR",
  ckb: "CKB", ky: "KY", la: "LA", ln: "LN", lmo: "LMO", lb: "LB",
  mk: "MK", mai: "MAI", mg: "MG", ms: "MS", ml: "ML", mt: "MT",
  mi: "MI", mr: "MR", mn: "MN", ne: "NE", oc: "OC", om: "OM",
  pag: "PAG", ps: "PS", fa: "FA", "pt-br": "PT-BR", pa: "PA",
  qu: "QU", sa: "SA", sr: "SR", st: "ST", scn: "SCN",
  "es-419": "ES-419", su: "SU", sw: "SW", tl: "TL", tg: "TG",
  ta: "TA", tt: "TT", te: "TE", th: "TH", ts: "TS", tn: "TN",
  tk: "TK", ur: "UR", uz: "UZ", vi: "VI", cy: "CY", wo: "WO",
  xh: "XH", yi: "YI", zu: "ZU",
};

/**
 * POST /api/translate
 * Body: { texts: string[], targetLang: string }
 * Returns: { translations: string[] }
 */
router.post("/", async (req: Request, res: Response) => {
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ?? req.socket.remoteAddress ?? "unknown";
  if (isRateLimited(ip)) {
    res.status(429).json({ error: "Too many requests. Please wait a few minutes." });
    return;
  }

  try {
    const body = req.body as { texts?: unknown; targetLang?: unknown } | undefined;

    if (!body || !Array.isArray(body.texts) || typeof body.targetLang !== "string") {
      console.error("[translate] Bad request body:", body);
      res.status(400).json({ error: "texts (string[]) and targetLang (string) are required" });
      return;
    }

    const texts: string[] = body.texts.map((t) => (typeof t === "string" ? t : ""));
    const targetLang = body.targetLang;

    const totalChars = texts.reduce((sum, t) => sum + t.length, 0);
    if (totalChars > 10000) {
      res.status(400).json({ error: "Request too large." });
      return;
    }

    const deeplLang = LANG_MAP[targetLang];
    if (!deeplLang) {
      // Unsupported language — echo originals back
      res.json({ translations: texts });
      return;
    }


    const response = await fetch(DEEPL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: texts,
        target_lang: deeplLang,
        source_lang: "EN",
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[translate] DeepL ${response.status}:`, errText);
      // Return originals so UI still shows content
      res.status(200).json({ translations: texts });
      return;
    }

    const data = (await response.json()) as { translations: Array<{ text: string }> };
    const translations = data.translations.map((t) => t.text);

    res.json({ translations });
  } catch (err) {
    console.error("[translate] Unexpected error:", err);
    // Always return originals on error so UI doesn't break
    const texts = Array.isArray(req.body?.texts) ? req.body.texts : [];
    res.status(200).json({ translations: texts });
  }
});

export default router;
