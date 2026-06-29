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
      const steps = visa.application_process_steps ?? [];

      const batch = [
        visa.name,
        visa.description ?? "",
        visa.visa_type ?? "",
        visa.path_to_residency_description ?? "",
        visa.target_applicant ?? "",
        visa.tax_implications ?? "",
        visa.renewal_conditions ?? "",
        ...benefits,
        ...documents,
        ...steps,
      ];

      const result = await translateTexts(batch, lang);
      if (cancelled) return;

      const offset = 7;
      setTranslated({
        ...visa,
        name: result[0] ?? visa.name,
        description: result[1] ?? visa.description,
        visa_type: result[2] ?? visa.visa_type,
        path_to_residency_description: result[3] ?? visa.path_to_residency_description,
        target_applicant: result[4] ?? visa.target_applicant,
        tax_implications: result[5] ?? visa.tax_implications,
        renewal_conditions: result[6] ?? visa.renewal_conditions,
        benefits: benefits.map((b, i) => result[offset + i] ?? b),
        required_documents: documents.map((d, i) => result[offset + benefits.length + i] ?? d),
        application_process_steps: steps.map((s, i) => result[offset + benefits.length + documents.length + i] ?? s),
      });
    };

    translate();
    return () => { cancelled = true; };
  }, [visa, i18n.language]);

  return translated;
}
