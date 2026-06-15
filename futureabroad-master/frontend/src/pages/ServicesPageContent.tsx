import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { ServiceType } from "@/lib/types";
import ServicesGrid from "@/components/services/ServicesGrid";
import { ServiceFilters } from "@/components/service/ServiceFilters";
import { useTranslation } from "react-i18next";
import { useTranslatedServiceTypes } from "@/hooks/useTranslatedServiceTypes";

import { translateTexts } from "@/lib/deepl";
import ServicesHero from "@/components/services/ServicesHero";

type CountsMap = Record<string, number>;

const INSURANCE_SERVICE_TYPE = "insurance";
const TRANSLATION_SERVICE_TYPE = "document_translation";
const MAIL_SERVICE_TYPE = "virtual_mail";
const VPN_SERVICE_TYPE = "vpn";
const MONDLY_SERVICE_TYPE = "language_learning";

const MONDLY_EN = {
  title: "Language Learning",
  subtitle: "Learn 41 languages with Mondly",
  desc: "Master a new language with daily lessons, real conversations, and AI-powered speech recognition.",
};

const VPN_EN = {
  title: "VPN",
  subtitle: "Private & secure browsing",
  desc: "Protect your connection with the world's fastest VPN — 9,300+ servers across 211+ locations.",
};

const MAIL_EN = {
  title: "Virtual Mailbox",
  subtitle: "Digital mailroom services",
  desc: "Get a real U.S. street address and manage your mail online from anywhere with AI-powered summaries.",
};

const INSURANCE_EN = {
  title: "Insurance",
  subtitle: "Comprehensive coverage",
  desc: "Protect yourself with comprehensive insurance coverage for your international move.",
};

const TRANSLATION_EN = {
  title: "Translation Services",
  subtitle: "Professional certified translations",
  desc: "Get certified translations for visa applications, legal documents, and more.",
};

export default function ServicesPageContent() {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState<ServiceType[]>([]);
  const translatedCategories = useTranslatedServiceTypes(categories);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<CountsMap>({});
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState<{ id: number; name: string }[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<number | "all">("all");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [insuranceStrings, setInsuranceStrings] = useState(INSURANCE_EN);
  const [translationStrings, setTranslationStrings] = useState(TRANSLATION_EN);
  const [mailStrings, setMailStrings] = useState(MAIL_EN);
  const [vpnStrings, setVpnStrings] = useState(VPN_EN);
  const [mondlyStrings, setMondlyStrings] = useState(MONDLY_EN);

  useEffect(() => {
    const lang = i18n.language ?? "en";
    if (lang === "en") {
      setInsuranceStrings(INSURANCE_EN);
      setTranslationStrings(TRANSLATION_EN);
      setMailStrings(MAIL_EN);
      setVpnStrings(VPN_EN);
      setMondlyStrings(MONDLY_EN);
      return;
    }
    let cancelled = false;
    Promise.all([
      translateTexts([INSURANCE_EN.title, INSURANCE_EN.subtitle, INSURANCE_EN.desc], lang),
      translateTexts([TRANSLATION_EN.title, TRANSLATION_EN.subtitle, TRANSLATION_EN.desc], lang),
      translateTexts([MAIL_EN.title, MAIL_EN.subtitle, MAIL_EN.desc], lang),
      translateTexts([VPN_EN.title, VPN_EN.subtitle, VPN_EN.desc], lang),
      translateTexts([MONDLY_EN.title, MONDLY_EN.subtitle, MONDLY_EN.desc], lang),
    ]).then(([insuranceResults, translationResults, mailResults, vpnResults, mondlyResults]) => {
      if (!cancelled) {
        setInsuranceStrings({
          title: insuranceResults[0],
          subtitle: insuranceResults[1],
          desc: insuranceResults[2],
        });
        setTranslationStrings({
          title: translationResults[0],
          subtitle: translationResults[1],
          desc: translationResults[2],
        });
        setMailStrings({
          title: mailResults[0],
          subtitle: mailResults[1],
          desc: mailResults[2],
        });
        setVpnStrings({
          title: vpnResults[0],
          subtitle: vpnResults[1],
          desc: vpnResults[2],
        });
        setMondlyStrings({
          title: mondlyResults[0],
          subtitle: mondlyResults[1],
          desc: mondlyResults[2],
        });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [i18n.language]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase.from("service_types").select("*");
        if (error) throw error;
        const cats = (data || []).filter((cat: ServiceType) => cat.id !== INSURANCE_SERVICE_TYPE && cat.id !== TRANSLATION_SERVICE_TYPE && cat.id !== MAIL_SERVICE_TYPE && cat.id !== VPN_SERVICE_TYPE && cat.id !== MONDLY_SERVICE_TYPE);
        setCategories(cats);

        const { data: servicesData, error: servErr } = await supabase
          .from("services")
          .select("service_type")
          .eq("active", true);
        if (servErr) throw servErr;
        const countsMap: CountsMap = {};
        (servicesData || []).forEach((s: any) => {
          const t = s.service_type as string;
          countsMap[t] = (countsMap[t] || 0) + 1;
        });
        setCounts(countsMap);

        const { data: countriesData } = await supabase.from("countries").select("id, name").order("name");
        if (countriesData) setCountries(countriesData);
      } catch (error) {
        console.error("Error fetching service types:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const q = search.toLowerCase().trim();
  const filteredCategories = q
    ? translatedCategories.filter((cat) => {
        const name = (cat.name ?? "").toLowerCase();
        const desc = (cat.description ?? "").toLowerCase();
        const tagline = (cat.tagline ?? "").toLowerCase();
        return name.includes(q) || desc.includes(q) || tagline.includes(q);
      })
    : translatedCategories;

  return (
    <>
      <div className="mx-auto w-full max-w-[80vw] space-y-8 py-4 sm:px-4 sm:py-8 lg:px-6">
        {/* Hero */}
        <ServicesHero title={t("services.page_subtitle")} desc={t("services.page_desc")} />

        {/* Filters */}
        <ServiceFilters
          search={search}
          onSearchChange={setSearch}
          selectedLanguages={selectedLanguages}
          onLanguagesChange={setSelectedLanguages}
          countries={countries}
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
        />

        <ServicesGrid
          loading={loading}
          insuranceStrings={insuranceStrings}
          translationStrings={translationStrings}
          mailStrings={mailStrings}
          vpnStrings={vpnStrings}
          mondlyStrings={mondlyStrings}
          translatedCategories={filteredCategories}
          counts={counts}
          t={t}
        />
      </div>
    </>
  );
}
