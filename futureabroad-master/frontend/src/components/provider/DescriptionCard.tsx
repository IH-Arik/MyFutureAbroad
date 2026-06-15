import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import type { Provider } from "@/lib/types";

export default function DescriptionCard({
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
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(provider?.description ?? "");
  }, [provider]);

  async function save() {
    if (!providerId) return;
    setSaving(true);
    const { error } = await supabase.from("providers").update({ description: draft }).eq("id", providerId);
    if (!error) {
      onProviderChange(provider ? { ...provider, description: draft } : provider);
      setEdit(false);
    }
    setSaving(false);
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-white p-6 shadow-sm dark:bg-[#1a1a1a] dark:border-white/10 sm:col-span-2">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t("provider.description")}</h2>
        {!edit && (
          <button
            onClick={() => { setDraft(provider?.description ?? ""); setEdit(true); }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {t("common.edit")}
          </button>
        )}
      </div>

      {edit ? (
        <div className="space-y-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            placeholder={t("provider.business_desc_placeholder")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-foreground/20 dark:bg-[#2a2a2a]"
          />
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
        <p className="text-sm text-muted-foreground leading-relaxed">
          {provider?.description || <span className="italic">{t("provider.no_description")}</span>}
        </p>
      )}
    </div>
  );
}
