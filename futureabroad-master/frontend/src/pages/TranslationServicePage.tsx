import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Tick02Icon, Clock01Icon, Shield02Icon, Task01Icon } from "@hugeicons/core-free-icons";
import { useTranslation } from "react-i18next";
import { translateTexts } from "@/lib/deepl";

const FEATURES_EN = [
  { title: "Certified Translations", description: "Certified, sworn, notarised and legalised translations accepted globally" },
  { title: "Fast Delivery", description: "From 12 hours delivery with no compromises on quality" },
  { title: "Expert Translators", description: "Specialist translators with subject matter expertise in your field" },
  { title: "24/7 Support", description: "Round-the-clock support powered by our global team" },
];
const FEATURE_ICONS = [Tick02Icon, Clock01Icon, Shield02Icon, Task01Icon];

// Indices 0–17: static UI strings
const STATIC_EN = [
  /* 0  */ "Back to Services",
  /* 1  */ "Premium Translation Services",
  /* 2  */ "Translayte",
  /* 3  */ "Professional certified translation services that are easy to order, delivered quickly and accepted globally.",
  /* 4  */ "Trusted by over 150k clients globally. Get certified translations with confidence.",
  /* 5  */ "4.9 out of 5",
  /* 6  */ "from over 150k customers",
  /* 7  */ "Why Choose Translayte?",
  /* 8  */ "Our Translation Services",
  /* 9  */ "We provide certified translations, notarisation and legalisation services for individuals and businesses worldwide.",
  /* 10 */ "Most Popular",
  /* 11 */ "Best for:",
  /* 12 */ "How It Works",
  /* 13 */ "Get certified translations in 4 easy steps. Upload, select options, review, and receive your certified documents via email or post.",
  /* 14 */ "Start Now",
  /* 15 */ "Ready for certified translations?",
  /* 16 */ "Join thousands of customers who trust Translayte for accurate, certified translations. Get started in minutes.",
  /* 17 */ "Order Translations →",
  /* 18 */ "4 Easy Steps",
  /* 19 */ "Simple process to get your certified translations",
  /* 20 */ "Upload Documents",
  /* 21 */ "Upload your files to get a quote. We accept Images, PDFs, and Office formats.",
  /* 22 */ "Select Options & Pay",
  /* 23 */ "Choose languages, certification, and delivery options, then make payment.",
  /* 24 */ "Review & Approve",
  /* 25 */ "Receive your translation draft. Provide feedback or approve for final delivery.",
  /* 26 */ "Order Completed",
  /* 27 */ "Receive high-quality translations via email or by post.",
];

// Indices 18–25: feature title+description pairs (4 features × 2)
function buildAllTexts() {
  const texts: string[] = [...STATIC_EN];
  for (const f of FEATURES_EN) { texts.push(f.title, f.description); }
  return texts;
}
const ALL_EN = buildAllTexts();
const FEAT_OFFSET = STATIC_EN.length;                          // 18

export function TranslationServicePage() {
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
          <div className="inline-block px-4 py-2 rounded-full mb-4" style={{ backgroundColor: '#DCAE1D20' }}>
            <p className="text-sm font-semibold" style={{ color: '#DCAE1D' }}>{tr[1]}</p>
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

        {/* Why Translayte Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">{tr[7]}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#DCAE1D20', color: '#DCAE1D' }}>
                  <HugeiconsIcon icon={feature.icon} className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4-Step Process Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{tr[18]}</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">{tr[19]}</p>
          <div className="grid md:grid-cols-4 gap-6">
            {["1","2","3","4"].map((step, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold mb-4 text-lg" style={{ backgroundColor: '#DCAE1D' }}>{step}</div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{tr[20 + idx * 2]}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">{tr[21 + idx * 2]}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Translation Services Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{tr[8]}</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">{tr[9]}</p>
          <div className="flex justify-center">
            <iframe 
              src="https://translayte.com/iframes/instant-pricing?translate_from=en-gb&translate_to=es&currency_code=GBP&ref=250713" 
              frameBorder="0" 
              width="500px" 
              height="800px" 
              loading="lazy"
            ></iframe>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">{tr[15]}</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">{tr[16]}</p>
          <a 
            href="https://translayte.com/certified-translations?ref=250713&utm_medium=referral&utm_source=MyfutureabroadLimited"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 text-white font-semibold rounded-lg transition-colors cursor-pointer hover:opacity-90" style={{ backgroundColor: '#DCAE1D' }}
          >
            {tr[17]}
          </a>
        </section>
      </div>
    </div>
  );
}

export default TranslationServicePage;
