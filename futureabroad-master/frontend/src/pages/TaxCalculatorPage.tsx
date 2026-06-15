import { useState, useEffect } from "react";
import { TaxCalculator } from "@/components/TaxCalculator";
import { useTranslation } from "react-i18next";
import { translateTexts } from "@/lib/deepl";

const STATIC_EN = [
  "Tax Calculator",
  "Estimate your take-home pay in any supported country",
];

export function TaxCalculatorPage() {
  const { i18n } = useTranslation();
  const [tr, setTr] = useState(STATIC_EN);

  useEffect(() => {
    const lang = i18n.language ?? "en";
    if (lang === "en") { setTr(STATIC_EN); return; }
    let cancelled = false;
    translateTexts(STATIC_EN, lang).then((r) => { if (!cancelled) setTr(r); });
    return () => { cancelled = true; };
  }, [i18n.language]);

  return (
    <div className="mx-auto w-full max-w-[80vw] py-8 sm:px-4 lg:px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">{tr[0]}</h1>
        <p className="text-muted-foreground text-lg">{tr[1]}</p>
      </div>
      <div className="max-w-xl">
        <TaxCalculator />
      </div>
    </div>
  );
}
