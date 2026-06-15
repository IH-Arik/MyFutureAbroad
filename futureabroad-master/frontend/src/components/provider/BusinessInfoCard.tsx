import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { CURRENCY_SYMBOLS } from "@/components/currency/CurrencyProvider";
import type { Provider, ProviderMember } from "@/lib/types";

export default function BusinessInfoCard({
  provider,
  membership,
  providerId,
  onProviderChange,
}: {
  provider: (Provider & { join_code?: string }) | null;
  membership: ProviderMember;
  providerId?: string | undefined;
  onProviderChange: (p: (Provider & { join_code?: string }) | null) => void;
}) {
  const { t } = useTranslation();
  const [typeEdit, setTypeEdit] = useState(false);
  const [typeDraft, setTypeDraft] = useState(provider?.provider_type ?? "");
  const [typeSaving, setTypeSaving] = useState(false);
  const [currencyEdit, setCurrencyEdit] = useState(false);
  const [currencyDraft, setCurrencyDraft] = useState(provider?.preferred_currency ?? "");
  const [currencySaving, setCurrencySaving] = useState(false);
  const [contactEmailEdit, setContactEmailEdit] = useState(false);
  const [contactEmailDraft, setContactEmailDraft] = useState(provider?.contact_email ?? "");
  const [contactEmailSaving, setContactEmailSaving] = useState(false);

  useEffect(() => {
    setTypeDraft(provider?.provider_type ?? "");
    setCurrencyDraft(provider?.preferred_currency ?? "");
    setContactEmailDraft(provider?.contact_email ?? "");
  }, [provider]);

  const PROVIDER_TYPES = [
    { value: "agency", label: t("provider.type_agency") },
    { value: "law_firm", label: t("provider.type_law_firm") },
    { value: "freelancer", label: t("provider.type_freelancer") },
    { value: "consultancy", label: t("provider.type_consultancy") },
  ];

  const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    active: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    completed: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };

  const ROLE_COLORS: Record<string, string> = {
    owner: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    admin: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    member: "bg-muted text-muted-foreground",
  };

  async function saveType() {
    if (!providerId) return;
    setTypeSaving(true);
    const { error } = await supabase.from("providers").update({ provider_type: typeDraft }).eq("id", providerId);
    if (!error) {
      onProviderChange(provider ? { ...provider, provider_type: typeDraft } : provider);
      setTypeEdit(false);
    }
    setTypeSaving(false);
  }

  async function saveCurrency() {
    if (!providerId) return;
    setCurrencySaving(true);
    const { error } = await supabase.from("providers").update({ preferred_currency: currencyDraft }).eq("id", providerId);
    if (!error) {
      onProviderChange(provider ? { ...provider, preferred_currency: currencyDraft } : provider);
      setCurrencyEdit(false);
    }
    setCurrencySaving(false);
  }

  async function saveContactEmail() {
    if (!providerId) return;
    setContactEmailSaving(true);
    const { error } = await supabase.from("providers").update({ contact_email: contactEmailDraft }).eq("id", providerId);
    if (!error) {
      onProviderChange(provider ? { ...provider, contact_email: contactEmailDraft } : provider);
      setContactEmailEdit(false);
    }
    setContactEmailSaving(false);
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-white p-6 shadow-sm dark:bg-[#1a1a1a] dark:border-white/10">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">{t("provider.business_info")}</h2>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t("provider.name")}</dt>
          <dd className="font-medium">{provider?.company_name ?? "—"}</dd>
        </div>

        <div className="flex justify-between items-center gap-4">
          <dt className="text-muted-foreground shrink-0">{t("provider.type")}</dt>
          {typeEdit ? (
            <dd className="flex items-center gap-2">
              <select value={typeDraft} onChange={(e) => setTypeDraft(e.target.value)} className="rounded-lg border border-border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 dark:bg-[#2a2a2a]">
                {PROVIDER_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <button onClick={saveType} disabled={typeSaving} className="text-xs font-medium hover:text-foreground transition-colors">{typeSaving ? "…" : t("common.save")}</button>
              <button onClick={() => setTypeEdit(false)} disabled={typeSaving} className="text-xs text-muted-foreground hover:text-foreground transition-colors">{t("common.cancel")}</button>
            </dd>
          ) : (
            <dd className="flex items-center gap-2">
              <span className="font-medium capitalize">{provider?.provider_type ?? "—"}</span>
              <button onClick={() => { setTypeDraft(provider?.provider_type ?? "agency"); setTypeEdit(true); }} className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{t("common.edit")}</button>
            </dd>
          )}
        </div>

        <div className="flex justify-between items-center gap-4">
          <dt className="text-muted-foreground shrink-0">{t("provider.preferred_currency")}</dt>
          {currencyEdit ? (
            <dd className="flex items-center gap-2">
              <select value={currencyDraft} onChange={(e) => setCurrencyDraft(e.target.value)} className="rounded-lg border border-border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 dark:bg-[#2a2a2a]">
                <option value="">{t("provider.default_usd")}</option>
                {Object.entries(CURRENCY_SYMBOLS).map(([code, meta]) => (
                  <option key={code} value={code}>{code} - {meta.name}</option>
                ))}
              </select>
              <button onClick={saveCurrency} disabled={currencySaving} className="text-xs font-medium hover:text-foreground transition-colors">{currencySaving ? "…" : t("common.save")}</button>
              <button onClick={() => setCurrencyEdit(false)} disabled={currencySaving} className="text-xs text-muted-foreground hover:text-foreground transition-colors">{t("common.cancel")}</button>
            </dd>
          ) : (
            <dd className="flex items-center gap-2">
              <span className="font-medium uppercase">{provider?.preferred_currency ?? t("provider.default_usd")}</span>
              <button onClick={() => { setCurrencyDraft(provider?.preferred_currency ?? ""); setCurrencyEdit(true); }} className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{t("common.edit")}</button>
            </dd>
          )}
        </div>

        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t("provider.status")}</dt>
          <dd>
            <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", STATUS_COLORS[provider?.status ?? "pending"])}>
              {provider?.status ?? "pending"}
            </span>
          </dd>
        </div>

        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t("provider.your_role")}</dt>
          <dd>
            <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", ROLE_COLORS[membership?.role ?? "member"])}>
              {membership?.role}
            </span>
          </dd>
        </div>

        {provider?.contact_email && (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{t("provider.contact")}</dt>
            <dd className="flex items-center gap-2">
              {contactEmailEdit ? (
                <>
                  <input type="email" value={contactEmailDraft} onChange={(e) => setContactEmailDraft(e.target.value)} className="rounded-lg border border-border bg-background px-2 py-1 text-sm" />
                  <button onClick={saveContactEmail} disabled={contactEmailSaving} className="text-xs font-medium hover:text-foreground transition-colors">{contactEmailSaving ? "…" : t("common.save")}</button>
                  <button onClick={() => setContactEmailEdit(false)} disabled={contactEmailSaving} className="text-xs text-muted-foreground hover:text-foreground transition-colors">{t("common.cancel")}</button>
                </>
              ) : (
                <>
                  <span className="font-medium">{provider.contact_email}</span>
                  <button onClick={() => { setContactEmailDraft(provider?.contact_email ?? ""); setContactEmailEdit(true); }} className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{t("common.edit")}</button>
                </>
              )}
            </dd>
          </div>
        )}

        {provider?.website && (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{t("provider.website")}</dt>
            <dd className="font-medium truncate max-w-[180px]">{provider.website}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
