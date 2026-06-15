import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Visa } from "@/lib/types";
import { translateTexts } from "@/lib/deepl";

/**
 * Translates an array of visas (name, visa_type, description) for the current
 * language. Shows originals immediately, swaps to translated once ready.
 * All fields are batched into a single API call per language change.
 */
export function useTranslatedVisas(visas: Visa[]): Visa[] {
  const { i18n } = useTranslation();
  const [translatedVisas, setTranslatedVisas] = useState<Visa[]>(visas);

  useEffect(() => {
    setTranslatedVisas(visas);

    const lang = i18n.language ?? "en";
    if (lang === "en" || visas.length === 0) return;

    let cancelled = false;

    const translate = async () => {
      const names = visas.map((v) => v.name ?? "");
      const types = visas.map((v) => v.visa_type ?? "");
      const descs = visas.map((v) => v.description ?? "");
      const countryNames = visas.map((v) => (v as any).country?.name ?? "");

      const all = [...names, ...types, ...descs, ...countryNames];
      const translated = await translateTexts(all, lang);

      if (cancelled) return;

      const n = visas.length;
      setTranslatedVisas(
        visas.map((v, i) => ({
          ...v,
          name: translated[i] ?? v.name,
          visa_type: translated[n + i] ?? v.visa_type,
          description: translated[2 * n + i] ?? v.description,
          country: (v as any).country
            ? { ...(v as any).country, name: translated[3 * n + i] || (v as any).country.name }
            : (v as any).country,
        }))
      );
    };

    translate();
    return () => { cancelled = true; };
  }, [visas, i18n.language]);

  return translatedVisas;
}
