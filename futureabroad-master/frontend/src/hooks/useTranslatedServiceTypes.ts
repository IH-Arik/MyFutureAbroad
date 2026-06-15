import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { ServiceType } from "@/lib/types";
import { translateTexts } from "@/lib/deepl";

/**
 * Translates ServiceType database content (name, tagline, description)
 * for the current language. Shows originals immediately, swaps to
 * translated versions once the API call resolves.
 */
export function useTranslatedServiceTypes(categories: ServiceType[]): ServiceType[] {
  const { i18n } = useTranslation();
  const [translated, setTranslated] = useState<ServiceType[]>(categories);

  useEffect(() => {
    setTranslated(categories);

    const lang = i18n.language ?? "en";
    if (lang === "en" || categories.length === 0) return;

    let cancelled = false;

    const translate = async () => {
      const names = categories.map((c) => c.name ?? "");
      const taglines = categories.map((c) => c.tagline ?? "");
      const descs = categories.map((c) => c.description ?? "");

      // Single batched request for all fields
      const all = [...names, ...taglines, ...descs];
      const result = await translateTexts(all, lang);

      if (cancelled) return;

      const n = categories.length;
      setTranslated(
        categories.map((c, i) => ({
          ...c,
          name: result[i] ?? c.name,
          tagline: result[n + i] ?? c.tagline,
          description: result[2 * n + i] ?? c.description,
        }))
      );
    };

    translate();
    return () => { cancelled = true; };
  }, [categories, i18n.language]);

  return translated;
}
