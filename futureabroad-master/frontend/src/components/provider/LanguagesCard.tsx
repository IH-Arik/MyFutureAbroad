import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import type { Provider } from "@/lib/types";

export const LANGUAGES = [
  { code: "en", name: "English" }, { code: "de", name: "German" },
  { code: "fr", name: "French" }, { code: "es", name: "Spanish" },
  { code: "pt", name: "Portuguese" }, { code: "it", name: "Italian" },
  { code: "nl", name: "Dutch" }, { code: "pl", name: "Polish" },
  { code: "ru", name: "Russian" }, { code: "ar", name: "Arabic" },
  { code: "zh", name: "Chinese" }, { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" }, { code: "tr", name: "Turkish" },
  { code: "uk", name: "Ukrainian" }, { code: "cs", name: "Czech" },
  { code: "sv", name: "Swedish" }, { code: "da", name: "Danish" },
  { code: "fi", name: "Finnish" }, { code: "no", name: "Norwegian" },
  { code: "hi", name: "Hindi" }, { code: "th", name: "Thai" },
  { code: "he", name: "Hebrew" }, { code: "ro", name: "Romanian" },
  { code: "hu", name: "Hungarian" }, { code: "vi", name: "Vietnamese" },
];

export default function LanguagesCard({
  provider,
  providerId,
  onProviderChange,
}: {
  provider: (Provider & { join_code?: string }) | null;
  providerId?: string | undefined;
  onProviderChange: (p: (Provider & { join_code?: string }) | null) => void;
}) {
  const { t } = useTranslation();
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(provider?.languages ?? []);
  }, [provider]);

  async function save() {
    if (!providerId) return;
    setSaving(true);
    const { error } = await supabase.from("providers").update({ languages: draft }).eq("id", providerId);
    if (!error) {
      onProviderChange(provider ? { ...provider, languages: draft } : provider);
      setEdit(false);
    }
    setSaving(false);
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-white p-6 shadow-sm dark:bg-[#1a1a1a] dark:border-white/10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t("provider.languages_offered")}</h2>
        {!edit && (
          <button
            onClick={() => { setDraft(provider?.languages ?? []); setEdit(true); }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {t("common.edit")}
          </button>
        )}
      </div>

      {edit ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto pr-1">
            {LANGUAGES.map((lang) => (
              <label key={lang.code} className="flex items-center gap-2 text-sm cursor-pointer hover:text-foreground py-0.5">
                <input
                  type="checkbox"
                  checked={draft.includes(lang.code)}
                  onChange={(e) => {
                    setDraft(prev =>
                      e.target.checked ? [...prev, lang.code] : prev.filter(c => c !== lang.code)
                    );
                  }}
                  className="rounded"
                />
                <span>{lang.name}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setEdit(false)} disabled={saving}>
              {t("common.cancel")}
            </Button>
            <Button size="sm" className="rounded-xl" onClick={save} disabled={saving}>
              {saving ? t("common.saving") : t("common.save")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {(provider?.languages ?? []).length > 0
            ? (provider?.languages ?? []).map((code) => (
                <span key={code} className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                  {LANGUAGES.find(l => l.code === code)?.name ?? code.toUpperCase()}
                </span>
              ))
            : <p className="text-sm text-muted-foreground italic">{t("provider.no_languages")}</p>
          }
        </div>
      )}
    </div>
  );
}
