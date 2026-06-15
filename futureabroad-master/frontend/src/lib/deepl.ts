function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit int
  }
  return Math.abs(hash);
}

function getCacheKey(text: string, lang: string): string {
  return `deepl_${lang}_${simpleHash(text).toString(36)}`;
}

/**
 * Translates an array of texts to the target language via the backend proxy
 * (which calls DeepL). Results are cached in localStorage to avoid repeated
 * API calls. Returns original texts if translation fails or lang is English.
 */
export async function translateTexts(
  texts: string[],
  targetLang: string
): Promise<string[]> {
  if (targetLang === "en") return texts;

  // Separate cached from uncached
  const results: string[] = new Array(texts.length);
  const uncachedIndices: number[] = [];
  const uncachedTexts: string[] = [];

  for (let i = 0; i < texts.length; i++) {
    const text = texts[i];
    if (!text || !text.trim()) {
      results[i] = text;
      continue;
    }
    const cached = localStorage.getItem(getCacheKey(text, targetLang));
    if (cached !== null) {
      results[i] = cached;
    } else {
      results[i] = text; // fallback while loading
      uncachedIndices.push(i);
      uncachedTexts.push(text);
    }
  }

  if (uncachedTexts.length === 0) return results;

  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts: uncachedTexts, targetLang }),
    });

    if (!response.ok) return results;

    const data: { translations: string[] } = await response.json();
    const translations = data.translations ?? [];

    for (let i = 0; i < uncachedIndices.length; i++) {
      const idx = uncachedIndices[i];
      const translated = translations[i] ?? texts[idx];
      results[idx] = translated;
      try {
        localStorage.setItem(getCacheKey(texts[idx], targetLang), translated);
      } catch {
        // localStorage may be full — ignore
      }
    }
  } catch {
    // Network error — return originals
  }

  return results;
}
