import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Globe02Icon, StarIcon, CheckmarkCircle02Icon, SecurityCheckIcon } from "@hugeicons/core-free-icons";
import { useTranslation } from "react-i18next";
import { translateTexts } from "@/lib/deepl";
import FeaturesGrid from "@/components/mail/FeaturesGrid";
import ProductsGrid from "@/components/mail/ProductsGrid";

const FEATURES_EN = [
  { title: "1,000+ Addresses", description: "Choose from over 1,000 real U.S. street addresses worldwide with a plan that fits your needs" },
  { title: "AI Mail Summaries", description: "Built-in AI instantly highlights key details and required actions from every piece of mail" },
  { title: "Access Anywhere", description: "Manage your mailbox from any device — desktop, mobile, or tablet — 24 hours a day" },
  { title: "Secure & Compliant", description: "Bank-level security with full USPS Form 1583 compliance for all virtual mailbox plans" },
];
const FEATURE_ICONS = [Globe02Icon, StarIcon, CheckmarkCircle02Icon, SecurityCheckIcon];

const PRODUCTS_EN = [
  { name: "Virtual Mailbox", price: "Plans from $10/mo", description: "Receive, scan, and instantly understand your mail with AI-powered summaries that highlight key details and required actions.", goodFor: "Individuals, remote workers, and frequent travelers", highlight: true, url: "https://www.postscanmail.com/services/virtual-mailbox.html?ref=nzc5mwn&utm_source=nzc5mwn&utm_campaign=PostScan+Mail+Affiliates" },
  { name: "Virtual Mailroom", price: "Plans from $30/mo", description: "Go paper-free while managing inbound mail across teams with scanning and AI-powered summaries that streamline review and decision-making.", goodFor: "Teams and small businesses", highlight: false, url: "https://www.postscanmail.com/client-solutions/digital-mailroom.html?ref=nzc5mwn&utm_source=nzc5mwn&utm_campaign=PostScan+Mail+Affiliates" },
  { name: "Virtual Business Address", price: "Plans from $10/mo", description: "Establish a professional presence with a business address in any city. Choose from our nationwide network to fit your brand.", goodFor: "Entrepreneurs, startups, and remote businesses", highlight: false, url: "https://www.postscanmail.com/services/virtual-business-address.html?ref=nzc5mwn&utm_source=nzc5mwn&utm_campaign=PostScan+Mail+Affiliates" },
  { name: "Mail Forwarding", price: "Pay per use", description: "Forward your mail and packages anywhere in the world. Select one or more addresses from our 1,000+ location network and manage deliveries 24/7.", goodFor: "Expats, travelers, and anyone living abroad", highlight: false, url: "https://www.postscanmail.com/services/mail-forwarding.html?ref=nzc5mwn&utm_source=nzc5mwn&utm_campaign=PostScan+Mail+Affiliates" },
  { name: "Mail Scanning", price: "Pay per use", description: "Get high-quality scanned images of your mail and packages, securely delivered to your virtual mailbox with AI-powered summaries for faster review.", goodFor: "Anyone wanting digital copies of physical mail", highlight: false, url: "https://www.postscanmail.com/services/mail-scanning.html?ref=nzc5mwn&utm_source=nzc5mwn&utm_campaign=PostScan+Mail+Affiliates" },
  { name: "Virtual PO Box", price: "Plans from $10/mo", description: "Get a real street address instead of a traditional PO Box. Maintain a professional presence while managing your mail online with flexible forwarding.", goodFor: "Individuals needing a real street address", highlight: false, url: "https://www.postscanmail.com/services/virtual-po-box-with-street-address.html?ref=nzc5mwn&utm_source=nzc5mwn&utm_campaign=PostScan+Mail+Affiliates" },
  { name: "Package Forwarding", price: "Pay per use", description: "Shop internationally or receive packages at multiple addresses. Forward them anywhere in the world with affordable shipping rates and free storage.", goodFor: "International shoppers and expats", highlight: false, url: "https://www.postscanmail.com/services/package-forwarding.html?ref=nzc5mwn&utm_source=nzc5mwn&utm_campaign=PostScan+Mail+Affiliates" },
  { name: "Registered Agent", price: "From $99/year", description: "Stay compliant with state requirements by appointing a registered agent to receive legal and government documents. Manage one or multiple state entities.", goodFor: "LLC owners and businesses requiring state compliance", highlight: false, url: "https://www.postscanmail.com/client-solutions/registered-agent.html?ref=nzc5mwn&utm_source=nzc5mwn&utm_campaign=PostScan+Mail+Affiliates" },
];

const STATIC_EN = [
  /* 0  */ "Back to Services",
  /* 1  */ "Affiliate Partner",
  /* 2  */ "PostScan Mail",
  /* 3  */ "Your digital mailroom — securely receive, scan, forward, and manage your mail online with a real U.S. street address.",
  /* 4  */ "Built-in AI mail summaries, 1,000+ mailing addresses worldwide, and access from any device, day or night.",
  /* 5  */ "4.7 out of 5",
  /* 6  */ "on Trustpilot",
  /* 7  */ "Why PostScan Mail?",
  /* 8  */ "Our Virtual Mail Services",
  /* 9  */ "Everything you need to manage your physical mail digitally, from anywhere in the world.",
  /* 10 */ "Most Popular",
  /* 11 */ "Best for:",
  /* 12 */ "Find Your Virtual Address",
  /* 13 */ "Not sure which plan you need? Search by city, state, or ZIP to find a real mailing address near you and get started in minutes.",
  /* 14 */ "Get My Virtual Address",
];

function buildAllTexts() {
  const texts: string[] = [...STATIC_EN];
  for (const f of FEATURES_EN) { texts.push(f.title, f.description); }
  for (const p of PRODUCTS_EN) { texts.push(p.name, p.price, p.description, p.goodFor); }
  return texts;
}
const ALL_EN = buildAllTexts();
const FEAT_OFFSET = STATIC_EN.length;                          // 18
const PROD_OFFSET = FEAT_OFFSET + FEATURES_EN.length * 2;     // 26

const MailPageContent: React.FC = () => {
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
          <div className="inline-block px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-full mb-4">
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{tr[1]}</p>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            {tr[2]}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mb-4">{tr[3]}</p>
          <p className="text-lg text-slate-500 dark:text-slate-500">{tr[4]}</p>
          <a
            href="https://www.trustpilot.com/review/postscanmail.com"
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
          
          {/* Affiliate Banner */}
          <div className="mt-8">
            <a 
              href="https://www.postscanmail.com?tap_a=128441-59e7e6&ref=nzc5mwn" 
              target="_blank" 
              rel="nofollow"
              className="inline-block hover:opacity-90 transition-opacity"
            >
              <img 
                src="https://static.tapfiliate.com/641a7aee18e58924634617.png?a=128441-59e7e6" 
                alt="PostScan Mail" 
                className="h-auto"
              />
            </a>
          </div>
        </div>

        {/* Why PostScan Mail Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">{tr[7]}</h2>
          <FeaturesGrid features={features} />
        </section>

        {/* Services Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{tr[8]}</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">{tr[9]}</p>
          <ProductsGrid products={products} tr={tr} />
        </section>

        {/* Find Address Section */}
        <section className="mb-16 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-900 dark:to-teal-800 rounded-2xl p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">{tr[12]}</h2>
          <p className="text-lg text-emerald-100 mb-6">{tr[13]}</p>
          <a
            href="https://www.postscanmail.com/?ref=nzc5mwn&utm_source=nzc5mwn&utm_campaign=PostScan+Mail+Affiliates"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition-colors"
          >
            {tr[14]}
          </a>
        </section>


      </div>
    </div>
  );
}

export default MailPageContent;
