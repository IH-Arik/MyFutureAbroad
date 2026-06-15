import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import type { Provider } from "@/lib/types";

export default function CountriesCard({
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
  const [draft, setDraft] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [allCountries, setAllCountries] = useState<{ id: number; name: string }[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setDraft(provider?.countries_served ?? []);
  }, [provider]);

  useEffect(() => {
    supabase.from("countries").select("id, name").order("name").then(({ data }) => {
      if (data) setAllCountries(data as { id: number; name: string }[]);
    });
  }, []);

  async function save() {
    if (!providerId) return;
    setSaving(true);
    const { error } = await supabase.from("providers").update({ countries_served: draft }).eq("id", providerId);
    if (!error) {
      onProviderChange(provider ? { ...provider, countries_served: draft } : provider);
      setEdit(false);
    }
    setSaving(false);
  }

  const visible = allCountries.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="rounded-2xl border border-border/50 bg-white p-6 shadow-sm dark:bg-[#1a1a1a] dark:border-white/10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t("provider.countries_served")}</h2>
        {!edit && (
          <button
            onClick={() => { setDraft(provider?.countries_served ?? []); setEdit(true); }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {t("common.edit")}
          </button>
        )}
      </div>

      {edit ? (
        <div className="space-y-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search countries…"
            className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 dark:bg-[#2a2a2a]"
          />

          <div className="grid grid-cols-1 gap-0.5 max-h-48 overflow-y-auto pr-1">
            {visible.map((country) => (
              <label key={country.id} className="flex items-center gap-2 text-sm cursor-pointer hover:text-foreground py-0.5">
                <input
                  type="checkbox"
                  checked={draft.includes(country.id)}
                  onChange={(e) => {
                    setDraft((prev) => (e.target.checked ? [...prev, country.id] : prev.filter((id) => id !== country.id)));
                  }}
                  className="rounded"
                />
                <span>{country.name}</span>
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
          {(provider?.countries_served ?? []).length > 0
            ? (provider?.countries_served ?? []).map((id) => {
                const c = allCountries.find((c) => c.id === id);
                return c ? (
                  <span key={id} className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">{c.name}</span>
                ) : null;
              })
            : <p className="text-sm text-muted-foreground italic">{t("provider.no_countries")}</p>
          }
        </div>
      )}
    </div>
  );
}
