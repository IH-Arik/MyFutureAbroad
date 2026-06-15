import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Globe02Icon, Task01Icon, Clock01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { useTranslation } from "react-i18next";
import { translateTexts } from "@/lib/deepl";

const FEATURES_EN = [
  { title: "41 Languages", description: "Learn any of 41 languages from your native language — one of the widest selections available" },
  { title: "50 Practical Topics", description: "Structured lessons covering the most common real-life situations to get you fluent fast" },
  { title: "Daily Lessons", description: "Quick daily lessons designed for constant improvement, anytime and anywhere on any device" },
  { title: "Real Conversations", description: "41 guided real conversations to build fluency and confidence you can use right away" },
];
const FEATURE_ICONS = [Globe02Icon, Task01Icon, Clock01Icon, Tick02Icon];

const PRODUCTS_EN = [
  { name: "Mondly Free", price: "Free", description: "Access daily lessons, core vocabulary, and basic conversations in any of 41 languages. No credit card required.", goodFor: "Beginners wanting to try language learning", highlight: false, url: "https://www.mondly.com/app" },
  { name: "Mondly Premium", price: "From $9.99/mo", description: "Unlock all 50 topics, 1,000+ language combinations, offline access, and speech recognition for real pronunciation practice.", goodFor: "Learners who want full access to every feature", highlight: true, url: "https://www.mondly.com/offer/en" },
  { name: "Mondly Lifetime", price: "$99.99 one-time", description: "Pay once and learn forever. Full access to all languages, topics, and future updates — no recurring fees.", goodFor: "Committed learners looking for the best value", highlight: false, url: "https://www.mondly.com/offer/en" },
  { name: "Mondly VR", price: "Add-on", description: "Experience immersive language learning in virtual reality. Practice conversations in realistic environments from your couch.", goodFor: "Tech-forward learners wanting immersive practice", highlight: false, url: "https://www.mondly.com/vr" },
  { name: "Mondly for Business", price: "Contact for pricing", description: "Boost team productivity, attract talent, and increase customer satisfaction with enterprise language learning tools.", goodFor: "Businesses with international teams or clients", highlight: false, url: "https://www.pearson.com/languages/hr-professionals/mondly-by-pearson.html" },
];

const STATIC_EN = [
  /* 0  */ "Back to Services",
  /* 1  */ "Affiliate Partner",
  /* 2  */ "Mondly by Pearson",
  /* 3  */ "Learn 41 languages from your native language — anytime, anywhere, on any device.",
  /* 4  */ "Named Editors' Choice by Google Play and Best New App by Apple. Trusted by millions of learners worldwide.",
  /* 5  */ "4.7 out of 5",
  /* 6  */ "on App Stores",
  /* 7  */ "Why Mondly?",
  /* 8  */ "Plans & Products",
  /* 9  */ "Choose the plan that fits your learning goals. Start for free or unlock everything with Premium.",
  /* 10 */ "Most Popular",
  /* 11 */ "Best for:",
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

export function MondlyPage() {
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
          <div className="inline-block px-4 py-2 bg-violet-50 dark:bg-violet-900/30 rounded-full mb-4">
            <p className="text-sm font-semibold text-violet-600 dark:text-violet-400">{tr[1]}</p>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            {tr[2]}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mb-4">{tr[3]}</p>
          <p className="text-lg text-slate-500 dark:text-slate-500">{tr[4]}</p>
          <div className="mt-6 inline-flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400">★</span>
              ))}
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              <span className="font-semibold">{tr[5]}</span> {tr[6]}
            </p>
          </div>
        </div>

        {/* Why Mondly Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">{tr[7]}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="cursor-default bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="bg-violet-50 dark:bg-violet-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <HugeiconsIcon icon={feature.icon} className="w-6 h-6 text-violet-600 dark:text-violet-400" />
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
                    ? "bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-900/40 dark:to-purple-800/40 border-violet-200 dark:border-violet-700 ring-2 ring-violet-300 dark:ring-violet-600 hover:ring-violet-400 dark:hover:ring-violet-500"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-violet-400 dark:hover:border-violet-600"
                }`}
              >
                {product.highlight && (
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-violet-600 text-white text-xs font-semibold rounded-full">
                      {tr[10]}
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{product.name}</h3>
                <div className="text-2xl font-bold text-violet-600 dark:text-violet-400 mb-3">{product.price}</div>
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


      </div>
    </div>
  );
}

export default MondlyPage;
