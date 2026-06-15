import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Service } from "@/lib/types";
import { translateTexts } from "@/lib/deepl";

/**
 * Translates Service database content (title, description) for the current
 * language. Shows originals immediately, swaps once translations arrive.
 */
export function useTranslatedServices(services: Service[]): Service[] {
  const { i18n } = useTranslation();
  const [translated, setTranslated] = useState<Service[]>(services);

  useEffect(() => {
    setTranslated(services);

    const lang = i18n.language ?? "en";
    if (lang === "en" || services.length === 0) return;

    let cancelled = false;

    const translate = async () => {
      const titles = services.map((s) => s.title ?? "");
      const descs = services.map((s) => s.description ?? "");
      const types = services.map((s) => (s.service_type ?? "").replace(/_/g, " "));

      const all = [...titles, ...descs, ...types];
      const result = await translateTexts(all, lang);

      if (cancelled) return;

      const n = services.length;
      setTranslated(
        services.map((s, i) => ({
          ...s,
          title: result[i] ?? s.title,
          description: result[n + i] ?? s.description,
          service_type: result[2 * n + i] ?? s.service_type,
        }))
      );
    };

    translate();
    return () => { cancelled = true; };
  }, [services, i18n.language]);

  return translated;
}
