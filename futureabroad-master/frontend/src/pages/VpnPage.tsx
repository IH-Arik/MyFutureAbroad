import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Globe02Icon, SecurityCheckIcon, CheckmarkCircle02Icon, Shield02Icon } from "@hugeicons/core-free-icons";
import { useTranslation } from "react-i18next";
import { translateTexts } from "@/lib/deepl";

const FEATURES_EN = [
  { title: "9,300+ Servers", description: "Covering 211+ locations worldwide — there's always a fast server nearby for your connection" },
  { title: "Post-Quantum Encryption", description: "Leading encryption technology that sets the new security standard for 2026 and beyond" },
  { title: "10 Devices at Once", description: "Protect all your devices simultaneously or install on your Wi-Fi router for whole-home coverage" },
  { title: "Threat Protection Pro™", description: "Automatically blocks phishing, malware, trackers, and ads in the background — no action needed" },
];
const FEATURE_ICONS = [Globe02Icon, SecurityCheckIcon, CheckmarkCircle02Icon, Shield02Icon];

const PRODUCTS_EN = [
  { name: "Basic Plan", price: "From $3.39/mo", description: "Core VPN protection with 9,300+ servers, post-quantum encryption, and a no-logs policy. Connect up to 10 devices.", goodFor: "Anyone wanting fast, private browsing", highlight: false, url: "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=112469" },
  { name: "Plus Plan", price: "From $4.39/mo", description: "Everything in Basic, plus Threat Protection Pro™ — automatic malware scanning, ad blocking, and tracker removal.", goodFor: "Users who want full malware and ad protection", highlight: true, url: "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=112469" },
  { name: "Ultimate Plan", price: "From $6.39/mo", description: "Everything in Plus, with 1 TB of encrypted cloud storage and Incogni data removal from broker databases.", goodFor: "Power users wanting complete digital privacy", highlight: false, url: "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=112469" },
  { name: "Dark Web Monitor", price: "Included in Plus+", description: "Get instant alerts when your passwords or personal data appear in known data breaches or on the dark web.", goodFor: "Anyone who wants early warning of leaked credentials", highlight: false, url: "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=112469" },
  { name: "Threat Protection Pro™", price: "Included in Plus+", description: "AI-enhanced protection powered by CrowdStrike Falcon® intelligence. Blocks threats before they reach your device.", goodFor: "Users browsing on public or untrusted networks", highlight: false, url: "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=112469" },
  { name: "Incogni", price: "Add-on or Ultimate", description: "Automatically removes your personal data from data broker databases, reducing spam, scams, and identity theft risk.", goodFor: "Anyone wanting to reduce their data footprint online", highlight: false, url: "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=112469" },
];

const STATIC_EN = [
  /* 0  */ "Back to Services",
  /* 1  */ "Affiliate Partner",
  /* 2  */ "NordVPN",
  /* 3  */ "The no. 1 VPN in 2026 — the fastest VPN provider with secure, reliable connections and post-quantum encryption.",
  /* 4  */ "Enhanced privacy, safer browsing, and protection against phishing, scams, and malware.",
  /* 5  */ "4.7 out of 5",
  /* 6  */ "on Trustpilot",
  /* 7  */ "Why NordVPN?",
  /* 8  */ "NordVPN Plans & Features",
  /* 9  */ "One subscription covers all your devices. Choose the plan that fits your privacy needs.",
  /* 10 */ "Most Popular",
  /* 11 */ "Best for:",
  /* 12 */ "Get 75% Off NordVPN",
  /* 13 */ "Use our exclusive affiliate link to get up to 75% off NordVPN with a 30-day money-back guarantee. No risk, cancel any time.",
  /* 14 */ "Get NordVPN →",
];

function buildAllTexts() {
  const texts: string[] = [...STATIC_EN];
  for (const f of FEATURES_EN) { texts.push(f.title, f.description); }
  for (const p of PRODUCTS_EN) { texts.push(p.name, p.price, p.description, p.goodFor); }
  return texts;
}
const ALL_EN = buildAllTexts();
const FEAT_OFFSET = STATIC_EN.length;
const PROD_OFFSET = FEAT_OFFSET + FEATURES_EN.length * 2;

export function VpnPage() {
  const { i18n } = useTranslation();
  const [tr, setTr] = useState<string[]>(ALL_EN);

  useEffect(() => {
    const lang = i18n.language ?? "en";
    if (lang === "en") { setTr(ALL_EN); return; }
    let cancelled = false;
    translateTexts(ALL_EN, lang).then((result) => {
      if (!cancelled) setTr(result);
    });
    return () => { cancelled = true; };
  }, [i18n.language]);

  const features = FEATURES_EN.map((_, i) => ({
    icon: FEATURE_ICONS[i],
    title: tr[FEAT_OFFSET + i * 2],
    description: tr[FEAT_OFFSET + i * 2 + 1],
  }));

  const products = PRODUCTS_EN.map((p, i) => ({
    ...p,
    name:        tr[PROD_OFFSET + i * 4],
    price:       tr[PROD_OFFSET + i * 4 + 1],
    description: tr[PROD_OFFSET + i * 4 + 2],
    goodFor:     tr[PROD_OFFSET + i * 4 + 3],
  }));

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Back Button */}
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4" />
          {tr[0]}
        </Link>

        {/* Hero Section */}
        <div className="mb-16">
          <div className="inline-block px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-4">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{tr[1]}</p>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            {tr[2]}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mb-4">{tr[3]}</p>
          <p className="text-lg text-slate-500 dark:text-slate-500">{tr[4]}</p>
          <a
            href="https://www.trustpilot.com/review/nordvpn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400">★</span>
              ))}
            </div>
            <p className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              <span className="font-semibold">{tr[5]}</span> {tr[6]}
            </p>
          </a>
        </div>

        {/* Why NordVPN Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">{tr[7]}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="cursor-default bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="bg-blue-50 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <HugeiconsIcon icon={feature.icon} className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Plans Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{tr[8]}</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">{tr[9]}</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, idx) => (
              <a
                key={idx}
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-2xl border p-6 transition-all cursor-pointer group ${
                  product.highlight
                    ? "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-800/40 border-blue-200 dark:border-blue-700 ring-2 ring-blue-300 dark:ring-blue-600 hover:ring-blue-400 dark:hover:ring-blue-500"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-600"
                }`}
              >
                {product.highlight && (
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                      {tr[10]}
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{product.name}</h3>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3">{product.price}</div>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">{product.description}</p>
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">{tr[11]}</span> {product.goodFor}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-16 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-900 rounded-2xl p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">{tr[12]}</h2>
          <p className="text-lg text-blue-100 mb-6">{tr[13]}</p>
          <a
            href="https://go.nordvpn.net/aff_c?offer_id=15&aff_id=112469"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            {tr[14]}
          </a>
        </section>
      </div>
    </div>
  );
}

export default VpnPage;
