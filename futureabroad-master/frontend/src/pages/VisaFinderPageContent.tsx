import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Visa, Country } from "@/lib/types";
import { useCurrency, CURRENCY_SYMBOLS } from "@/components/currency/CurrencyProvider";
import { useTranslation } from "react-i18next";
import { useTranslatedVisas } from "@/hooks/useTranslatedVisas";
import { translateTexts } from "@/lib/deepl";
import { renderIcon } from "@/components/visa-finder/icons";
import PurposeStep from "@/components/visa-finder/PurposeStep";
import NationalityStep from "@/components/visa-finder/NationalityStep";
import FinancesStep from "@/components/visa-finder/FinancesStep";
import SkillsStep from "@/components/visa-finder/SkillsStep";
import LifestyleStep from "@/components/visa-finder/LifestyleStep";
import BackgroundStep from "@/components/visa-finder/BackgroundStep";
import ResultsSection from "@/components/visa-finder/ResultsSection";
import VisaHeader from "@/components/visa-finder/VisaHeader";
import StepProgress from "@/components/visa-finder/StepProgress";
import StepControls from "@/components/visa-finder/StepControls";



interface UserProfile {
  purpose: string;
  nationality: string;
  monthlyIncome: string;
  savings: string;
  skills: string[];
  preferences: string[];
  language: string;
  cleanRecord: boolean | null;
}

interface MatchedVisa {
  visa: Visa & { country?: Country };
  tier: "excellent" | "good" | "match";
  prefScore: number; // used for sorting within a tier
  reasons: string[];
  positiveReasons: string[];
}

type CountryProfiles = Record<string, Record<string, number>>;

const PREFERENCES = [
  { id: "tax",          icon: "wallet",    label: "Low / no income tax", desc: "Territorial or 0% income tax regimes" },
  { id: "warm_climate", icon: "sun",       label: "Warm climate",         desc: "Mediterranean or tropical weather" },
  { id: "cold_climate", icon: "snowflake", label: "Cold climate",         desc: "Cool, crisp weather year-round" },
  { id: "healthcare",   icon: "heart",     label: "Quality healthcare",   desc: "High public healthcare expenditure" },
  { id: "cost",         icon: "tag",       label: "Low cost of living",   desc: "Affordable housing, food & transport" },
  { id: "safety",       icon: "shield",    label: "Safety & low crime",   desc: "Low homicide rate & stable environment" },
];

const LANGUAGE_OPTIONS = [
  { id: "en", label: "English" },
  { id: "es", label: "Spanish" },
  { id: "fr", label: "French" },
  { id: "de", label: "German" },
  { id: "pt", label: "Portuguese" },
  { id: "ar", label: "Arabic" },
  { id: "zh", label: "Mandarin" },
  { id: "ja", label: "Japanese" },
  { id: "ko", label: "Korean" },
  { id: "th", label: "Thai" },
  { id: "id", label: "Indonesian" },
  { id: "vi", label: "Vietnamese" },
  { id: "nl", label: "Dutch" },
  { id: "it", label: "Italian" },
];

const COUNTRY_INDUSTRIES: Record<string, string[]> = {
  US: ["technology", "finance", "healthcare", "engineering", "consulting", "marketing", "legal", "design"],
  CA: ["technology", "finance", "healthcare", "engineering", "education", "consulting"],
  MX: ["engineering", "technology", "consulting", "marketing"],
  GB: ["finance", "technology", "legal", "consulting", "healthcare", "marketing"],
  DE: ["engineering", "technology", "healthcare", "finance", "consulting"],
  FR: ["finance", "technology", "consulting", "design", "marketing", "legal"],
  NL: ["technology", "finance", "marketing", "consulting", "engineering"],
  BE: ["consulting", "finance", "legal", "technology", "engineering"],
  AT: ["engineering", "technology", "finance", "consulting", "healthcare"],
  CH: ["finance", "consulting", "legal", "technology", "healthcare", "engineering"],
  IE: ["technology", "finance", "consulting", "marketing"],
  SE: ["technology", "engineering", "design", "consulting", "finance"],
  NO: ["engineering", "technology", "finance", "consulting"],
  DK: ["technology", "engineering", "design", "consulting", "healthcare"],
  FI: ["technology", "engineering", "design"],
  ES: ["technology", "consulting", "marketing", "design"],
  IT: ["design", "technology", "finance", "consulting", "engineering"],
  PT: ["technology", "consulting", "marketing", "engineering"],
  GR: ["technology", "consulting"],
  PL: ["technology", "engineering", "finance", "consulting"],
  CZ: ["technology", "engineering", "consulting"],
  HU: ["technology", "engineering", "finance"],
  RO: ["technology", "engineering", "consulting"],
  BG: ["technology", "engineering", "consulting"],
  HR: ["technology", "consulting", "engineering"],
  SK: ["technology", "engineering", "consulting"],
  EE: ["technology", "engineering", "finance", "consulting"],
  LV: ["technology", "engineering", "consulting"],
  LT: ["technology", "engineering", "consulting", "finance"],
  CY: ["finance", "consulting", "legal", "technology"],
  MT: ["finance", "technology", "consulting", "legal"],
  MC: ["finance", "consulting", "legal"],
  AU: ["technology", "finance", "healthcare", "engineering", "education", "consulting"],
  NZ: ["technology", "healthcare", "education", "engineering"],
  SG: ["technology", "finance", "consulting", "engineering", "marketing"],
  JP: ["technology", "engineering", "design", "finance"],
  KR: ["technology", "engineering", "design", "marketing"],
  TH: ["technology", "marketing", "design", "education"],
  MY: ["technology", "finance", "engineering", "consulting"],
  PH: ["technology", "marketing", "design", "consulting", "education"],
  VN: ["technology", "engineering", "marketing"],
  ID: ["technology", "marketing", "engineering"],
  IN: ["technology", "engineering", "finance", "consulting", "healthcare"],
  AE: ["finance", "consulting", "marketing", "engineering", "technology"],
  SA: ["engineering", "finance", "consulting", "healthcare"],
  QA: ["engineering", "finance", "consulting"],
  BH: ["finance", "consulting", "technology"],
  KW: ["finance", "engineering", "consulting"],
  OM: ["engineering", "consulting", "finance"],
  CR: ["technology", "engineering", "consulting", "healthcare"],
  PA: ["finance", "consulting", "legal", "technology"],
  CO: ["technology", "consulting", "marketing"],
  PY: ["consulting", "finance"],
  UY: ["technology", "consulting", "finance"],
  GE: ["technology", "finance", "consulting"],
  KE: ["technology", "finance", "consulting"],
  NG: ["technology", "finance", "consulting"],
  GH: ["finance", "consulting", "technology"],
  EG: ["engineering", "technology", "consulting"],
  MA: ["technology", "consulting", "engineering"],
  TN: ["technology", "engineering", "consulting"],
  TR: ["technology", "engineering", "consulting", "design", "finance"],
  BS: ["finance", "consulting", "legal"],
};

const LANGUAGE_COUNTRIES: Record<string, Set<string>> = {
  en: new Set(["US","GB","AU","NZ","CA","IE","SG","MT","PH","NG","GH","BS","IN","MY","KE"]),
  es: new Set(["ES","MX","CO","AR","CR","PA","PY","UY"]),
  fr: new Set(["FR","BE","CH","MC","MA"]),
  de: new Set(["DE","AT","CH","BE"]),
  pt: new Set(["PT","BR"]),
  ar: new Set(["AE","SA","QA","BH","KW","OM","EG","MA","TN"]),
  zh: new Set(["SG"]),
  ja: new Set(["JP"]),
  ko: new Set(["KR"]),
  th: new Set(["TH"]),
  id: new Set(["ID","MY"]),
  vi: new Set(["VN"]),
  nl: new Set(["NL","BE"]),
  it: new Set(["IT","CH"]),
};

const TOTAL_STEPS = 6;
const STORAGE_KEY = "visa_finder_profile";

const saveProfile = (profile: UserProfile) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
};

const loadProfile = (): UserProfile | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const clearSavedProfile = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export default function VisaFinderPageContent({ onBack }: { onBack?: () => void }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { currency, rates } = useCurrency();
  const currencySymbol = CURRENCY_SYMBOLS[currency]?.symbol ?? currency;

  const PURPOSES = [
    { id: "student", label: t("visa_finder.purposes.student"), icon: "task", description: t("visa_finder.purposes.student_desc") },
    { id: "digital_nomad", label: t("visa_finder.purposes.digital_nomad"), icon: "globe", description: t("visa_finder.purposes.digital_nomad_desc") },
    { id: "work", label: t("visa_finder.purposes.work"), icon: "briefcase", description: t("visa_finder.purposes.work_desc") },
    { id: "retirement", label: t("visa_finder.purposes.retirement"), icon: "wallet", description: t("visa_finder.purposes.retirement_desc") },
    { id: "family", label: t("visa_finder.purposes.family"), icon: "group", description: t("visa_finder.purposes.family_desc") },
    { id: "investor", label: t("visa_finder.purposes.investor"), icon: "calculator", description: t("visa_finder.purposes.investor_desc") },
  ];

  const SKILLS = [
    { id: "technology",  label: t("visa_finder.skills.technology") },
    { id: "healthcare",  label: t("visa_finder.skills.healthcare") },
    { id: "finance",     label: t("visa_finder.skills.finance") },
    { id: "engineering", label: t("visa_finder.skills.engineering") },
    { id: "education",   label: t("visa_finder.skills.education") },
    { id: "marketing",   label: t("visa_finder.skills.marketing") },
    { id: "design",      label: t("visa_finder.skills.design") },
    { id: "legal",       label: t("visa_finder.skills.legal") },
    { id: "consulting",  label: t("visa_finder.skills.consulting") },
    { id: "other",       label: t("visa_finder.skills.other") },
  ];

  const STEP_LABELS = [
    t("visa_finder.steps.purpose"),
    t("visa_finder.steps.nationality"),
    t("visa_finder.steps.finances"),
    t("visa_finder.steps.skills"),
    t("visa_finder.steps.lifestyle"),
    t("visa_finder.steps.background"),
  ];

  const toUSD = (amount: number): number => {
    if (!amount || currency === "USD" || !rates?.[currency]) return amount;
    return amount / rates[currency];
  };

  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    purpose: "",
    nationality: "",
    monthlyIncome: "",
    savings: "",
    skills: [],
    preferences: [],
    language: "",
    cleanRecord: null,
  });
  const [countryProfiles, setCountryProfiles] = useState<CountryProfiles>({});
  const [countries, setCountries] = useState<Country[]>([]);
  const [translatedCountryNames, setTranslatedCountryNames] = useState<Record<string, string>>({});
  const [nationalitySearch, setNationalitySearch] = useState("");
  const [results, setResults] = useState<MatchedVisa[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [shouldAutoSearch, setShouldAutoSearch] = useState(false);

  // (removed dynamic redoLabel state — label is now translated inline where needed)

  // Translate country names for the nationality picker
  useEffect(() => {
    if (!countries.length) return;
    const lang = i18n.language ?? "en";
    if (lang === "en") { setTranslatedCountryNames({}); return; }
    let cancelled = false;
    const names = countries.map((c) => c.name);
    translateTexts(names, lang).then((translated) => {
      if (cancelled) return;
      const map: Record<string, string> = {};
      countries.forEach((c, i) => { map[c.name] = translated[i] ?? c.name; });
      setTranslatedCountryNames(map);
    });
    return () => { cancelled = true; };
  }, [countries, i18n.language]);

  // Extract visas from results for translation
  const rawVisas = useMemo(() => results.map((r) => r.visa as Visa), [results]);
  const translatedVisas = useTranslatedVisas(rawVisas);

  // Merge translated visa data back into results
  const translatedResults = useMemo(() =>
    results.map((r, i) => ({ ...r, visa: { ...r.visa, ...translatedVisas[i] } })),
    [results, translatedVisas]
  );

  useEffect(() => {
    fetch("/api/country-profiles")
      .then((r) => r.json())
      .then((data) => setCountryProfiles(data))
      .catch(() => {});

    supabase
      .from("countries")
      .select("id, name, iso_code, flag_url")
      .order("name")
      .then(({ data }) => setCountries(data || []));

    const savedProfile = loadProfile();
    if (savedProfile && savedProfile.purpose && savedProfile.nationality && savedProfile.cleanRecord !== null) {
      setProfile(savedProfile);
      setShouldAutoSearch(true);
    }
  }, []);

  useEffect(() => {
    if (shouldAutoSearch && profile.purpose && profile.nationality && profile.cleanRecord !== null) {
      handleSearch();
      setShouldAutoSearch(false);
    }
  }, [shouldAutoSearch, profile.purpose, profile.nationality, profile.cleanRecord]);

  useEffect(() => {
    if (showResults && profile.purpose) {
      saveProfile(profile);
    }
  }, [showResults, profile]);

  const classifyVisa = (
    visa: Visa & { country?: Country },
    p: UserProfile,
    profiles: CountryProfiles
  ): MatchedVisa => {
    const reasons: string[] = [];
    const positiveReasons: string[] = [];
    const incomeUSD = toUSD(parseFloat(p.monthlyIncome) || 0);
    const savingsUSD = toUSD(parseFloat(p.savings) || 0);
    const hasFinances = incomeUSD > 0 || savingsUSD > 0;

    // --- Tier 2 check: financial requirements + nationality eligibility ---
    let meetsFinancials = true;
    if (hasFinances) {
      if (visa.min_income && incomeUSD < visa.min_income) {
        meetsFinancials = false;
        reasons.push(`${t("visa_finder.income_below")} ~${visa.min_income_currency ?? "USD"} ${visa.min_income.toLocaleString()}`);
      }
      if (visa.min_savings && savingsUSD < visa.min_savings) {
        meetsFinancials = false;
        reasons.push(`${t("visa_finder.savings_below")} ~${visa.min_savings_currency ?? "USD"} ${visa.min_savings.toLocaleString()}`);
      }
    }
    if (visa.eligible_nationalities?.length && !visa.eligible_nationalities.includes(p.nationality)) {
      meetsFinancials = false;
      reasons.push(t("visa_finder.nationality_may_not"));
    }

    // --- Preference score (used for sorting within tier and determining excellent) ---
    let prefScore = 0;
    if (visa.country?.iso_code) {
      const iso2 = visa.country.iso_code;
      const countryProfile = profiles[iso2];

      if (countryProfile) {
        for (const prefId of p.preferences) {
          let ps: number;
          if (prefId === "warm_climate") ps = countryProfile.climate ?? 0;
          else if (prefId === "cold_climate") ps = countryProfile.climate !== undefined ? 3 - countryProfile.climate : 0;
          else ps = countryProfile[prefId] ?? 0;
          prefScore += ps;
          if (ps >= 2) {
            const prefDef = PREFERENCES.find((pf) => pf.id === prefId);
            if (prefDef) positiveReasons.push(prefDef.id);
          }
        }
        if (p.language) {
          if (p.language === "en") {
            const engScore = countryProfile.english ?? 0;
            prefScore += engScore;
            if (engScore >= 2) positiveReasons.push("en_friendly");
          } else {
            const langSet = LANGUAGE_COUNTRIES[p.language];
            if (langSet?.has(iso2)) {
              prefScore += 3;
              const langDef = LANGUAGE_OPTIONS.find((l) => l.id === p.language);
              if (langDef) positiveReasons.push(`lang_${langDef.id}`);
            }
          }
        }
      }

    }

    // Doesn't meet financial bar → "match"
    if (!meetsFinancials) {
      return { visa, tier: "match", prefScore, reasons, positiveReasons };
    }

    // --- Tier 3 check: preferences + skills ---
    const hasPreferences = p.preferences.length > 0 || !!p.language;
    const skillsMatch =
      p.skills.length === 0 ||
      (visa.country?.iso_code
        ? (COUNTRY_INDUSTRIES[visa.country.iso_code] ?? []).some((ind) => p.skills.includes(ind))
        : true);
    const isExcellent = skillsMatch && (!hasPreferences || positiveReasons.length > 0);

    return { visa, tier: isExcellent ? "excellent" : "good", prefScore, reasons: [], positiveReasons };
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const { data: visas } = await supabase.from("visas").select(
        `id, name, visa_type, description, application_fee_usd, application_fee_currency, application_fee_amount, base_currency,
         processing_time_days, renewable, country_id, min_income, min_income_currency,
         min_savings, min_savings_currency, eligible_nationalities, excluded_nationalities,
         requires_clean_criminal_record, validity_months`
      );

      const { data: countriesData } = await supabase
        .from("countries")
        .select("id, name, iso_code, flag_url");

      const countryMap = Object.fromEntries(
        (countriesData || []).map((c) => [c.id, c])
      );

      const tierOrder = { excellent: 0, good: 1, match: 2 };

      const matched = (visas || [])
        .filter((visa) => {
          if (profile.purpose && visa.visa_type && visa.visa_type !== profile.purpose) return false;
          if (visa.requires_clean_criminal_record && profile.cleanRecord === false) return false;
          if (visa.excluded_nationalities?.includes(profile.nationality)) return false;
          return true;
        })
        .map((visa) => {
          const enriched = { ...visa, country: countryMap[visa.country_id] } as any;
          return classifyVisa(enriched, profile, countryProfiles);
        })
        .sort((a, b) => {
          if (tierOrder[a.tier] !== tierOrder[b.tier]) return tierOrder[a.tier] - tierOrder[b.tier];
          return b.prefScore - a.prefScore;
        });

      setResults(matched);
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };

  const buildAIQuery = () => {
    const purposeLabel = PURPOSES.find((p) => p.id === profile.purpose)?.label || profile.purpose;
    const parts: string[] = [];
    parts.push(`I'm looking for a visa to live abroad.`);
    if (purposeLabel) parts.push(`My purpose is: ${purposeLabel}.`);
    if (profile.nationality) parts.push(`My nationality is ${profile.nationality}.`);
    if (profile.monthlyIncome) parts.push(`Monthly income: ${currency} ${profile.monthlyIncome}.`);
    if (profile.savings) parts.push(`Savings: ${currency} ${profile.savings}.`);
    if (profile.skills.length > 0) parts.push(`Skills: ${profile.skills.join(", ")}.`);
    if (profile.language) {
      const langLabel = LANGUAGE_OPTIONS.find((l) => l.id === profile.language)?.label;
      if (langLabel) parts.push(`Preferred language: ${langLabel}.`);
    }
    if (profile.preferences.length > 0) {
      const prefLabels = profile.preferences
        .map((id) => PREFERENCES.find((p) => p.id === id)?.label)
        .filter(Boolean);
      if (prefLabels.length > 0) parts.push(`Lifestyle preferences: ${prefLabels.join(", ")}.`);
    }
    if (profile.cleanRecord !== null) {
      parts.push(`Clean criminal record: ${profile.cleanRecord ? "yes" : "no"}.`);
    }
    parts.push(`Which visas do I qualify for?`);
    return parts.join(" ");
  };

  const handleAskAI = () => {
    const query = buildAIQuery();
    navigate(`/chats?feature=visa_finder&q=${encodeURIComponent(query)}`);
  };

  const [activeTab, setActiveTab] = useState<"ai" | "filter">("ai");

  const reset = () => {
    clearSavedProfile();
    setStep(1);
    setProfile({ purpose: "", nationality: "", monthlyIncome: "", savings: "", skills: [], preferences: [], language: "", cleanRecord: null });
    setNationalitySearch("");
    setResults([]);
    setShowResults(false);
  };

  const updateProfile = () => {
    setShowResults(false);
    setStep(1);
  };

  const canProceed = () => {
    if (step === 1) return !!profile.purpose;
    if (step === 2) return !!profile.nationality;
    if (step === 3) return true;
    if (step === 4) return true;
    if (step === 5) return true; // preferences are optional
    if (step === 6) return profile.cleanRecord !== null;
    return false;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PurposeStep
            PURPOSES={PURPOSES}
            profile={profile}
            setProfile={setProfile}
            setStep={setStep}
            renderIcon={renderIcon}
            t={t}
          />
        );
      case 2:
        return (
          <NationalityStep
            countries={countries}
            translatedCountryNames={translatedCountryNames}
            nationalitySearch={nationalitySearch}
            setNationalitySearch={setNationalitySearch}
            profile={profile}
            setProfile={setProfile}
            setStep={setStep}
            t={t}
          />
        );
      case 3:
        return (
          <FinancesStep
            currency={currency}
            currencySymbol={currencySymbol}
            profile={profile}
            setProfile={setProfile}
            t={t}
          />
        );
      case 4:
        return <SkillsStep SKILLS={SKILLS} profile={profile} setProfile={setProfile} t={t} />;
      case 5:
        return (
          <LifestyleStep
            PREFERENCES={PREFERENCES}
            profile={profile}
            setProfile={setProfile}
            t={t}
            renderIcon={renderIcon}
            LANGUAGE_OPTIONS={LANGUAGE_OPTIONS}
          />
        );
      case 6:
        return <BackgroundStep profile={profile} setProfile={setProfile} t={t} renderIcon={renderIcon} />;
      default:
        return null;
    }
  };

  if (showResults) {
    return (
      <ResultsSection
        translatedResults={translatedResults}
        results={results}
        t={t}
        updateProfile={updateProfile}
        reset={reset}
        renderIcon={renderIcon}
        onAskAI={handleAskAI}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-[80vw] py-8 sm:py-16 min-h-screen flex flex-col">
      <div className="max-w-2xl mx-auto flex-1 flex flex-col">
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors self-start cursor-pointer font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to landing page
          </button>
        )}

        {/* Mode tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-muted rounded-xl">
          <button
            onClick={() => setActiveTab("ai")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "ai"
                ? "bg-gradient-to-r from-[#8B6949] to-[#D4C2A1] text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {renderIcon("globe", "w-4 h-4")}
            AI Advisor
          </button>
          <button
            onClick={() => setActiveTab("filter")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "filter"
                ? "bg-background text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {renderIcon("list", "w-4 h-4")}
            Filter Manually
          </button>
        </div>

        {activeTab === "ai" ? (
          <div className="bg-card rounded-2xl border border-border p-8 flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B6949] to-[#D4C2A1] flex items-center justify-center">
              {renderIcon("globe", "w-8 h-8 text-white")}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">Find Your Perfect Visa with AI</h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                Describe your situation in your own words — where you want to move, your income, lifestyle preferences, and goals. Our AI advisor will ask the right follow-up questions and match you to real visa programmes.
              </p>
            </div>
            <ul className="text-left text-sm text-muted-foreground space-y-2 w-full max-w-sm">
              <li className="flex items-start gap-2">{renderIcon("check", "w-4 h-4 text-emerald-500 mt-0.5 shrink-0")} Asks about your finances, lifestyle &amp; preferences</li>
              <li className="flex items-start gap-2">{renderIcon("check", "w-4 h-4 text-emerald-500 mt-0.5 shrink-0")} Filters by your target country or region</li>
              <li className="flex items-start gap-2">{renderIcon("check", "w-4 h-4 text-emerald-500 mt-0.5 shrink-0")} Rates visas as Excellent, Good, or Ordinary match</li>
              <li className="flex items-start gap-2">{renderIcon("check", "w-4 h-4 text-emerald-500 mt-0.5 shrink-0")} Uses live government sources for requirements</li>
            </ul>
            <button
              onClick={() => navigate("/chats?feature=visa_finder")}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#8B6949] to-[#D4C2A1] text-white font-semibold hover:opacity-90 transition-opacity text-base"
            >
              {renderIcon("globe", "w-5 h-5")}
              Start AI Visa Chat
            </button>
            <p className="text-xs text-muted-foreground">
              Prefer a structured form?{" "}
              <button onClick={() => setActiveTab("filter")} className="underline hover:text-foreground transition-colors">
                Use the manual filter instead
              </button>
            </p>
          </div>
        ) : (
          <>
            <VisaHeader t={t} />
            <StepProgress step={step} totalSteps={TOTAL_STEPS} stepLabels={STEP_LABELS} t={t} />
            <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 mb-6">
              {renderStep()}
            </div>
            <StepControls
              step={step}
              totalSteps={TOTAL_STEPS}
              canProceed={canProceed}
              setStep={setStep}
              handleSearch={handleSearch}
              loading={loading}
              t={t}
            />
          </>
        )}
      </div>
    </div>
  );
}
