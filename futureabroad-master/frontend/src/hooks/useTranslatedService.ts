import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Service } from "@/lib/types";
import { translateTexts } from "@/lib/deepl";

/**
 * Translates all user-visible text fields on a single Service object:
 * title, description, includes[], requirements[].
 * Returns the original service immediately, then swaps to translated once ready.
 */
export function useTranslatedService(service: Service | null): Service | null {
  const { i18n } = useTranslation();
  const [translated, setTranslated] = useState<Service | null>(service);

  useEffect(() => {
    setTranslated(service);

    const lang = i18n.language ?? "en";
    if (lang === "en" || !service) return;

    let cancelled = false;

    const translate = async () => {
      const includes = service.includes ?? [];
      const requirements = service.requirements ?? [];

      // Batch everything in one request:
      // [title, description, ...includes, ...requirements]
      const batch = [
        service.title ?? "",
        service.description ?? "",
        ...includes,
        ...requirements,
      ];

      const result = await translateTexts(batch, lang);
      if (cancelled) return;

      const tTitle = result[0] ?? service.title;
      const tDesc = result[1] ?? service.description;
      const tIncludes = result.slice(2, 2 + includes.length);
      const tRequirements = result.slice(2 + includes.length);

      setTranslated({
        ...service,
        title: tTitle,
        description: tDesc,
        includes: includes.map((item, i) => tIncludes[i] ?? item),
        requirements: requirements.map((item, i) => tRequirements[i] ?? item),
      });
    };

    translate();
    return () => { cancelled = true; };
  }, [service, i18n.language]);

  return translated;
}
