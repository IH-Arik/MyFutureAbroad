import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Task01Icon, Clock01Icon, Shield02Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import bannerImage from "@/assets/728x90-household copy.jpg";
import { useTranslation } from "react-i18next";
import { translateTexts } from "@/lib/deepl";
import InsuranceHero from "@/components/insurance/InsuranceHero";
import InsuranceFeatures from "@/components/insurance/InsuranceFeatures";
import InsuranceBanner from "@/components/insurance/InsuranceBanner";
import InsuranceProducts from "@/components/insurance/InsuranceProducts";
import InsuranceCta from "@/components/insurance/InsuranceCta";

const FEATURES_EN = [
  { title: "100% Digital", description: "Sign up for any insurance in just 5 minutes with no paperwork" },
  { title: "Quick Support", description: "English support and honest advice from certified consultants" },
  { title: "Trusted Coverage", description: "Partnership with Germany's most trusted insurance companies" },
  { title: "Claims Support", description: "We handle claims on your behalf for quick payouts" },
];
const FEATURE_ICONS = [Task01Icon, Clock01Icon, Shield02Icon, Tick02Icon];

const PRODUCTS_EN = [
  { name: "Public Health Insurance", price: "Varies", description: "100% digital sign up in 3 minutes. No German required. Compare providers and calculate costs.", goodFor: "Employees and students living in Germany", highlight: false, url: "https://feather-insurance.com/health-insurance/public" },
  { name: "Private Health Insurance", price: "Varies", description: "Comprehensive coverage with quicker appointments. Free consultation to determine eligibility.", goodFor: "High earners and self-employed individuals", highlight: false, url: "https://feather-insurance.com/health-insurance/private" },
  { name: "Expat Health Insurance", price: "From €72/month", description: "Medical emergencies, dental checkups, and visual aids. Schengen visa compliant.", goodFor: "Students, visa-seekers, interns, and researchers", highlight: true, url: "https://feather-insurance.com/health-insurance/expat" },
  { name: "Personal Liability Insurance", price: "From €4.94/month", description: "Coverage for damage you cause to others or their property. Best coverage guarantee.", goodFor: "Essential for all adults in Germany", highlight: false, url: "https://feather-insurance.com/personal-liability-insurance" },
  { name: "Household Contents Insurance", price: "From €2.33/month", description: "Covers water damage, fires, vandalism, and moving. Quick quote in under 10 seconds.", goodFor: "Everyone living in Germany", highlight: false, url: "https://feather-insurance.com/household-insurance" },
  { name: "Dental Insurance", price: "From €10.90/month", description: "Professional cleanings, fillings, and tooth replacement. Great add-on to public insurance.", goodFor: "Anyone wanting comprehensive dental coverage", highlight: false, url: "https://feather-insurance.com/dental-insurance" },
  { name: "Life Insurance", price: "From €1.98/month", description: "Covers mortgages, debt, childcare, and funeral expenses. Quote in 10 seconds.", goodFor: "Anyone with financial obligations", highlight: false, url: "https://feather-insurance.com/life-insurance" },
  { name: "Legal Insurance", price: "From €13.51/month", description: "Protection during legal disputes. Access to English-speaking lawyers and specialists.", goodFor: "Anyone wanting protection from legal fees", highlight: false, url: "https://feather-insurance.com/legal-insurance" },
];

// Indices 0–17: static UI strings
const STATIC_EN = [
  /* 0  */ "Back to Services",
  /* 1  */ "Affiliate Partner",
  /* 2  */ "Feather Insurance",
  /* 3  */ "Europe's top-rated insurance platform designed specifically for expats. Sign up for any insurance in just 5 minutes with zero paperwork.",
  /* 4  */ "Get English support, advice, and comprehensive coverage from one of Germany's most trusted insurance companies.",
  /* 5  */ "4.8 out of 5",
  /* 6  */ "on Trustpilot",
  /* 7  */ "Why Feather?",
  /* 8  */ "Our Insurance Products",
  /* 9  */ "All the coverage you need under one account, from health to liability to pet insurance.",
  /* 10 */ "Popular for Expats",
  /* 11 */ "Best for:",
  /* 12 */ "Need Help Choosing?",
  /* 13 */ "Not sure which insurance you need? Get personalized recommendations from our Feather recommendation tool. Our certified consultants provide honest, unbiased advice to help you find the right coverage.",
  /* 14 */ "Book Now",
  /* 15 */ "Ready to protect yourself?",
  /* 16 */ "Join thousands of expats who trust Feather for their insurance needs. Get full coverage in just 5 minutes.",
  /* 17 */ "Visit Feather Insurance →",
];

// Indices 18–25: feature title+description pairs (4 features × 2)
// Indices 26–57: product name+price+description+goodFor (8 products × 4)
function buildAllTexts() {
  const texts: string[] = [...STATIC_EN];
  for (const f of FEATURES_EN) { texts.push(f.title, f.description); }
  for (const p of PRODUCTS_EN) { texts.push(p.name, p.price, p.description, p.goodFor); }
  return texts;
}
const ALL_EN = buildAllTexts();
const FEAT_OFFSET = STATIC_EN.length;                          // 18
const PROD_OFFSET = FEAT_OFFSET + FEATURES_EN.length * 2;     // 26

export default function InsurancePageContent() {
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
        <Link to="/services" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors">
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4" />
          {tr[0]}
        </Link>

        <InsuranceHero
          title={tr[2]}
          subtitle={tr[3]}
          ratingText={(
            <a href="https://uk.trustpilot.com/review/feather-insurance.com" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="flex gap-0.5">{[...Array(5)].map((_, i) => (<span key={i} className="text-yellow-400">★</span>))}</div>
              <p className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"><span className="font-semibold">{tr[5]}</span> {tr[6]}</p>
            </a>
          )}
        />

        <InsuranceFeatures features={{ heading: tr[7], list: features }} />

        <InsuranceBanner src={bannerImage} alt="Household Insurance Banner" />

        <InsuranceProducts products={products} tr={tr} />

        <section className="mb-16 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-800 rounded-2xl p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">{tr[12]}</h2>
          <p className="text-lg text-blue-100 mb-6">{tr[13]}</p>
          <a href="https://app.feather-insurance.com/recommendation-tool?utm_source=XO6ByCsyM2NHniVQ5uMRAV8FIyM33UzJ" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
            {tr[14]}
          </a>
        </section>

        <InsuranceCta tr={tr} />
      </div>
    </div>
  );
}
