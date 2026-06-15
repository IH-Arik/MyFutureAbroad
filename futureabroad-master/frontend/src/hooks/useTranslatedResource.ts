import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Resource } from "@/lib/types";
import { translateTexts } from "@/lib/deepl";

/**
 * Translates a single Resource (title, excerpt, type, content) for the current
 * language. Shows the original immediately, swaps once translations arrive.
 * Content may be long — it is sent as a single string to preserve structure.
 */
export function useTranslatedResource(resource: Resource | null): Resource | null {
  const { i18n } = useTranslation();
  const [translated, setTranslated] = useState<Resource | null>(resource);

  useEffect(() => {
    setTranslated(resource);

    const lang = i18n.language ?? "en";
    if (lang === "en" || !resource) return;

    let cancelled = false;

    const translate = async () => {
      // Batch: [title, excerpt, type, content, ...tags]
      const batch = [
        resource.title ?? "",
        resource.excerpt ?? "",
        resource.type ?? "",
        resource.content ?? "",
        ...(resource.tags ?? []),
      ];

      const result = await translateTexts(batch, lang);
      if (cancelled) return;

      const [tTitle, tExcerpt, tType, tContent, ...tTags] = result;

      setTranslated({
        ...resource,
        title: tTitle ?? resource.title,
        excerpt: tExcerpt ?? resource.excerpt,
        type: tType ?? resource.type,
        content: tContent ?? resource.content,
        tags: (resource.tags ?? []).map((tag, i) => tTags[i] ?? tag),
      });
    };

    translate();
    return () => { cancelled = true; };
  }, [resource, i18n.language]);

  return translated;
}
