import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Visa } from "@/lib/types";
import { translateTexts } from "@/lib/deepl";

/**
 * Translates all text fields of a single Visa for the current language.
 * Shows originals immediately, swaps once translations arrive.
 */
export function useTranslatedVisa(visa: Visa | null): Visa | null {
  const { i18n } = useTranslation();
  const [translated, setTranslated] = useState<Visa | null>(visa);

  useEffect(() => {
    setTranslated(visa);
    if (!visa) return;

    const lang = i18n.language ?? "en";
    if (lang === "en") return;

    let cancelled = false;

    const translate = async () => {
      const benefits = visa.benefits ?? [];
      const documents = visa.required_documents ?? [];

      const batch = [
        visa.name,
        visa.description ?? "",
        visa.visa_type ?? "",
        visa.path_to_residency_description ?? "",
        ...benefits,
        ...documents,
      ];

      const result = await translateTexts(batch, lang);
      if (cancelled) return;

      setTranslated({
        ...visa,
        name: result[0] ?? visa.name,
        description: result[1] ?? visa.description,
        visa_type: result[2] ?? visa.visa_type,
        path_to_residency_description: result[3] ?? visa.path_to_residency_description,
        benefits: benefits.map((b, i) => result[4 + i] ?? b),
        required_documents: documents.map((d, i) => result[4 + benefits.length + i] ?? d),
      });
    };

    translate();
    return () => { cancelled = true; };
  }, [visa, i18n.language]);

  return translated;
}
