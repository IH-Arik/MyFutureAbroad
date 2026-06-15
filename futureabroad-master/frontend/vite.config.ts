import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import type { IncomingMessage, ServerResponse } from "http"
import type { NextHandleFunction } from "connect"

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

// ─── Rate limiter for dev proxy: 30 req per IP per 10 min ────────────────
const DEV_WINDOW_MS = 10 * 60 * 1000;
const DEV_MAX_REQUESTS = 500;
const devIpMap = new Map<string, { count: number; resetAt: number }>();
function devIsRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = devIpMap.get(ip);
  if (!entry || now > entry.resetAt) { devIpMap.set(ip, { count: 1, resetAt: now + DEV_WINDOW_MS }); return false; }
  entry.count += 1;
  return entry.count > DEV_MAX_REQUESTS;
}
setInterval(() => { const now = Date.now(); for (const [ip, e] of devIpMap.entries()) if (now > e.resetAt) devIpMap.delete(ip); }, DEV_WINDOW_MS).unref();

/** Vite plugin: intercepts POST /api/translate and proxies to DeepL server-side */
function deeplProxyPlugin(DEEPL_API_KEY: string | undefined) {
  return {
    name: "deepl-proxy",
    configureServer(server: { middlewares: { use: (path: string, fn: NextHandleFunction) => void } }) {
      server.middlewares.use(
        "/api/translate",
        (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          if (req.method !== "POST") return next();
          const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ?? req.socket?.remoteAddress ?? "unknown";
          if (devIsRateLimited(ip)) {
            res.writeHead(429, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Too many requests. Please wait a few minutes." }));
            return;
          }

          let body = "";
          req.on("data", (chunk: Buffer) => { body += chunk.toString(); });
          req.on("end", async () => {
            try {
              const parsed = JSON.parse(body) as { texts?: unknown; targetLang?: unknown };
              const texts: string[] = Array.isArray(parsed.texts)
                ? parsed.texts.map((t) => (typeof t === "string" ? t : ""))
                : [];
              const targetLang = typeof parsed.targetLang === "string" ? parsed.targetLang : "";
              const deeplLang = LANG_MAP[targetLang];

              if (!deeplLang || texts.length === 0) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ translations: texts }));
                return;
              }

              console.log(`[deepl-proxy] Translating ${texts.length} strings → ${deeplLang}`);

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
                console.error(`[deepl-proxy] DeepL ${response.status}:`, errText);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ translations: texts }));
                return;
              }

              const data = (await response.json()) as { translations: Array<{ text: string }> };
              const translations = data.translations.map((t) => t.text);
              console.log(`[deepl-proxy] Done — ${translations.length} results`);

              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ translations }));
            } catch (err) {
              console.error("[deepl-proxy] Error:", err);
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ translations: [] }));
            }
          });
        }
      );
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const DEEPL_API_KEY = env.DEEPL_API_KEY;

  return {
    plugins: [react(), tailwindcss(), deeplProxyPlugin(DEEPL_API_KEY)],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:3001",
          changeOrigin: true,
          rewrite: (path) => path,
        },
      },
      allowedHosts: [
        "localhost",
        "127.0.0.1",
        "9dd6-2a06-5904-31c0-1000-cdbd-8e03-c24c-5c4d.ngrok-free.app",
      ],
    },
  };
});
