import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Resource } from "@/lib/types";
import { translateTexts } from "@/lib/deepl";

/**
 * Translates resource listing fields (title, excerpt, type, tags) for the
 * current language. Shows originals immediately, swaps once translations arrive.
 */
export function useTranslatedResources(resources: Resource[]): Resource[] {
  const { i18n } = useTranslation();
  const [translated, setTranslated] = useState<Resource[]>(resources);

  useEffect(() => {
    setTranslated(resources);

    const lang = i18n.language ?? "en";
    if (lang === "en" || resources.length === 0) return;

    let cancelled = false;

    const translate = async () => {
      const n = resources.length;

      // Flatten all tags across all resources, tracking per-resource offsets
      const tagOffsets: number[] = [];
      const allTags: string[] = [];
      for (const r of resources) {
        tagOffsets.push(allTags.length);
        allTags.push(...(r.tags ?? []));
      }

      // Single batch: [titles, excerpts, types, ...allTags]
      const batch = [
        ...resources.map((r) => r.title ?? ""),
        ...resources.map((r) => r.excerpt ?? ""),
        ...resources.map((r) => r.type ?? ""),
        ...allTags,
      ];

      const result = await translateTexts(batch, lang);
      if (cancelled) return;

      const tTitles = result.slice(0, n);
      const tExcerpts = result.slice(n, 2 * n);
      const tTypes = result.slice(2 * n, 3 * n);
      const tTags = result.slice(3 * n);

      setTranslated(
        resources.map((r, i) => {
          const tagStart = tagOffsets[i];

          return {
            ...r,
            title: tTitles[i] ?? r.title,
            excerpt: tExcerpts[i] ?? r.excerpt,
            type: tTypes[i] ?? r.type,
            tags: (r.tags ?? []).map((tag, j) => tTags[tagStart + j] ?? tag),
          };
        })
      );
    };

    translate();
    return () => { cancelled = true; };
  }, [resources, i18n.language]);

  return translated;
}
