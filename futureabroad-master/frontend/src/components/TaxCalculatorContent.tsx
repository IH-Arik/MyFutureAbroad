import { useState, useEffect } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { useTranslation } from "react-i18next";
import { translateTexts } from "@/lib/deepl";
import TaxInputs from "@/components/tax/TaxInputs";
import TaxResult from "@/components/tax/TaxResult";

interface TaxBreakdown {
  incomeTax: number;
  subnationalTaxes: number;
  socialContributions: number;
  surcharges: number;
}

interface TaxResult {
  country: string;
  countryCode: string;
  currency: string;
  gross: number;
  net: number;
  tax: {
    total: number;
    rate: number;
    breakdown: TaxBreakdown;
  };
  assumptions?: { subnationalRegion?: string; notes?: string[] };
}

interface Props {
  countryCode?: string;
  countryName?: string;
}

const STATIC_EN = [
  /* 0  */ "Income Tax Calculator",
  /* 1  */ "Estimate your annual take-home pay",
  /* 2  */ "Country",
  /* 3  */ "Select a country…",
  /* 4  */ "Annual Gross Income",
  /* 5  */ "Currency",
  /* 6  */ "Calculate Tax",
  /* 7  */ "Calculating…",
  /* 8  */ "Could not calculate. Please try again.",
  /* 9  */ "Tax data for this country isn't available yet.",
  /* 10 */ "Gross",
  /* 11 */ "Total Tax",
  /* 12 */ "Take-home",
  /* 13 */ "Breakdown",
  /* 14 */ "Tax data by",
  /* 15 */ "Income Tax",
  /* 16 */ "Subnational Taxes",
  /* 17 */ "Social Contributions",
  /* 18 */ "Surcharges",
  /* 19 */ "effective",
  /* 20 */ "Rates based on",
];



export function TaxCalculator({ countryCode, countryName }: Props) {
  const { currency } = useCurrency();
  const { i18n } = useTranslation();
  const [tr, setTr] = useState<string[]>(STATIC_EN);
  const [income, setIncome] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const [selectedCountry, setSelectedCountry] = useState(countryCode ?? "");
  const [countries, setCountries] = useState<{ name: string; code: string }[]>([]);
  const [result, setResult] = useState<TaxResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unsupported, setUnsupported] = useState(false);

  useEffect(() => {
    const lang = i18n.language ?? "en";
    if (lang === "en") { setTr(STATIC_EN); return; }
    let cancelled = false;
    translateTexts(STATIC_EN, lang).then((result) => {
      if (!cancelled) setTr(result);
    });
    return () => { cancelled = true; };
  }, [i18n.language]);

  useEffect(() => {
    if (countryCode) return;
    fetch("/api/tax/countries")
      .then((r) => r.json())
      .then((d) => setCountries(d))
      .catch(() => {});
  }, [countryCode]);

  useEffect(() => {
    setSelectedCurrency(currency);
  }, [currency]);

  const calculate = async () => {
    const amt = Number(income);
    if (!amt || !selectedCountry) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setUnsupported(false);
    try {
      const res = await fetch("/api/tax/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amt, currency: selectedCurrency, countries: [selectedCountry] }),
      });
      if (res.status === 404) { setUnsupported(true); return; }
      if (!res.ok) throw new Error();
      const data: TaxResult[] = await res.json();
      if (data.length > 0) setResult(data[0]);
    } catch {
      setError(tr[8]);
    } finally {
      setLoading(false);
    }
  };

  const breakdown = result
    ? [
        { label: tr[15], value: result.tax.breakdown.incomeTax },
        { label: tr[16], value: result.tax.breakdown.subnationalTaxes },
        { label: tr[17], value: result.tax.breakdown.socialContributions },
        { label: tr[18], value: result.tax.breakdown.surcharges },
      ].filter((r) => r.value > 0)
    : [];

  return (
    <div className="rounded-lg p-6 bg-white dark:bg-[#1f1f1f] border border-slate-200 dark:border-white/10 ">
      <h2 className="text-xl font-semibold mb-1">
        {countryName ? `${countryName} ${tr[0]}` : tr[0]}
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{tr[1]}</p>

      <TaxInputs
        countryCode={countryCode}
        tr={tr}
        selectedCountry={selectedCountry}
        setSelectedCountry={(v: any) => { setSelectedCountry(v); setResult(null); setUnsupported(false); }}
        countries={countries}
        income={income}
        setIncome={setIncome}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        calculate={calculate}
        loading={loading}
      />

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      {unsupported && <p className="mt-4 text-sm text-slate-500">{tr[9]}</p>}

      <TaxResult result={result} breakdown={breakdown} tr={tr} />

      <p className="mt-5 text-xs text-slate-400">
        {tr[14]}{" "}
        <a href="https://globaltaxcalculator.net" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">
          globaltaxcalculator.net
        </a>
      </p>
    </div>
  );
}
