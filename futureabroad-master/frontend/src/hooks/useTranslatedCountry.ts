import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Country } from "@/lib/types";
import { translateTexts } from "@/lib/deepl";

// Backend rejects batches > 10 000 chars — split long texts individually.
async function translateField(text: string | null | undefined, lang: string): Promise<string | null | undefined> {
  if (!text) return text;
  const [result] = await translateTexts([text], lang);
  return result ?? text;
}

/**
 * Translates all user-visible text fields of a Country for the current language.
 * Shows originals immediately, swaps once translations arrive.
 * Long fields (longdescription, tax_advice, local_tips, extra_info) are each
 * sent as separate requests to stay under the 10 000-char backend limit.
 */
export function useTranslatedCountry(country: Country | null): Country | null {
  const { i18n } = useTranslation();
  const [translated, setTranslated] = useState<Country | null>(country);

  useEffect(() => {
    setTranslated(country);
    if (!country) return;

    const lang = i18n.language ?? "en";
    if (lang === "en") return;

    let cancelled = false;

    const translate = async () => {
      const reqEntries = Object.entries(country.citizenship_requirements ?? {});
      const reqCategories = reqEntries.map(([k]) => k);
      const reqDescs = reqEntries.map(([, v]) => v.desc ?? "");

      // Short fields — safe to batch together
      const shortBatch = [country.name, country.description ?? "", ...reqCategories, ...reqDescs];
      const [shortResult, longDesc, taxAdvice, localTips, extraInfo] = await Promise.all([
        translateTexts(shortBatch, lang),
        translateField(country.longdescription, lang),
        translateField(country.tax_advice, lang),
        translateField(country.local_tips, lang),
        translateField(country.extra_info, lang),
      ]);
      if (cancelled) return;

      // Rebuild citizenship_requirements with translated keys + descs
      const translatedReqs: Country["citizenship_requirements"] = {};
      reqEntries.forEach(([, v], i) => {
        const translatedCategory = shortResult[2 + i] ?? reqCategories[i];
        const translatedDesc = shortResult[2 + reqCategories.length + i] ?? reqDescs[i];
        translatedReqs[translatedCategory] = { ...v, desc: translatedDesc };
      });

      setTranslated({
        ...country,
        name: shortResult[0] ?? country.name,
        description: shortResult[1] || country.description,
        longdescription: longDesc || country.longdescription,
        tax_advice: taxAdvice || country.tax_advice,
        local_tips: localTips || country.local_tips,
        extra_info: extraInfo || country.extra_info,
        citizenship_requirements: reqEntries.length > 0 ? translatedReqs : country.citizenship_requirements,
      });
    };

    translate();
    return () => { cancelled = true; };
  }, [country, i18n.language]);

  return translated;
}
