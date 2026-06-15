import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { useToast } from "@/components/Toast";
import { supabase } from "@/lib/supabase";
import type { ProviderMember, Provider } from "@/lib/types";
import CreateBusinessFormFields from "@/components/provider/CreateBusinessFormFields";
import CreateBusinessFormActions from "@/components/provider/CreateBusinessFormActions";

export default function CreateBusinessFormContent({
  userId,
  userEmail,
  onCreated,
  onCancel,
}: {
  userId: string;
  userEmail: string;
  onCreated: (member: ProviderMember) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const PROVIDER_TYPES = [
    { value: "agency", label: t("provider.type_agency") },
    { value: "law_firm", label: t("provider.type_law_firm") },
    { value: "freelancer", label: t("provider.type_freelancer") },
    { value: "consultancy", label: t("provider.type_consultancy") },
  ];
  const { currency } = useCurrency();
  const { addToast } = useToast();
  const [companyName, setCompanyName] = useState("");
  const [providerType, setProviderType] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [securityKey, setSecurityKey] = useState("");
  const [keyIsValid, setKeyIsValid] = useState(false);
  const [preferredCurrency, setPreferredCurrency] = useState(currency || "USD");
  const [saving, setSaving] = useState(false);
  const [validatingKey, setValidatingKey] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function validateSecurityKey(key: string) {
    if (!key.trim()) return false;
    setValidatingKey(true);
    setError(null);

    try {
      const { data, error: keyError } = await supabase
        .rpc("validate_provider_security_key", { p_key: key.trim() });

      setValidatingKey(false);

      if (keyError) {
        console.error("Security key validation error:", keyError);
        setError(`${t("provider.invalid_key")} (${keyError.message})`);
        setKeyIsValid(false);
        return false;
      }

      const result = String(data).trim();

      if (result === "already_used") {
        setError(t("provider.key_already_used"));
        setKeyIsValid(false);
        return false;
      }

      if (result === "valid") {
        setError(null);
        setKeyIsValid(true);
        return true;
      }

      setError(t("provider.invalid_key"));
      setKeyIsValid(false);
      return false;
    } catch (err) {
      setValidatingKey(false);
      console.error("Exception during security key validation:", err);
      setError(t("provider.invalid_key"));
      setKeyIsValid(false);
      return false;
    }
  }

  async function markKeyAsUsed(key: string) {
    try {
      const { error: markError } = await supabase
        .rpc("mark_security_key_used", { p_key: key.trim() });
      if (markError) {
        console.error("Failed to mark key as used:", markError);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Exception when marking key as used:", err);
      return false;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!keyIsValid) {
      setError(t("provider.invalid_key"));
      return;
    }

    setSaving(true);

    const { data: providerRow, error: providerError } = await supabase
      .from("providers")
      .insert({
        user_id: userId,
        company_name: companyName,
        provider_type: providerType || null,
        description: description || null,
        contact_email: contactEmail || userEmail,
        website: website || null,
        preferred_currency: preferredCurrency,
        status: "pending",
      })
      .select("id, company_name, provider_type, status")
      .single();

    if (providerError || !providerRow) {
      setError(providerError?.message ?? "Failed to create business profile");
      setSaving(false);
      return;
    }

    const { data: memberRow } = await supabase
      .from("provider_members")
      .select("*, provider:providers(*)")
      .eq("user_id", userId)
      .eq("provider_id", providerRow.id)
      .single();

    const member: ProviderMember = memberRow ?? {
      id: crypto.randomUUID(),
      user_id: userId,
      provider_id: providerRow.id,
      role: "owner",
      provider: providerRow as unknown as Provider,
    };

    await markKeyAsUsed(securityKey);

    setCompanyName("");
    setProviderType("");
    setDescription("");
    setContactEmail("");
    setWebsite("");
    setSecurityKey("");
    setKeyIsValid(false);
    setPreferredCurrency(currency || "USD");

    addToast(t("provider.business_created"), "success");
    setSaving(false);
    onCreated(member);
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-white p-8 shadow-sm dark:bg-[#1a1a1a] dark:border-white/10">
      <div className="mb-6">
        <h2 className="text-xl font-bold">{t("provider.create_business_title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("provider.create_business_desc")}</p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <CreateBusinessFormFields
          t={t}
          PROVIDER_TYPES={PROVIDER_TYPES}
          companyName={companyName}
          setCompanyName={setCompanyName}
          providerType={providerType}
          setProviderType={setProviderType}
          description={description}
          setDescription={setDescription}
          contactEmail={contactEmail}
          setContactEmail={setContactEmail}
          userEmail={userEmail}
          website={website}
          setWebsite={setWebsite}
          securityKey={securityKey}
          setSecurityKey={setSecurityKey}
          setKeyIsValid={setKeyIsValid}
          validateSecurityKey={validateSecurityKey}
          validatingKey={validatingKey}
          preferredCurrency={preferredCurrency}
          setPreferredCurrency={setPreferredCurrency}
          currency={currency}
        />

        <CreateBusinessFormActions saving={saving} validatingKey={validatingKey} keyIsValid={keyIsValid} onCancel={onCancel} t={t} />
      </form>
    </div>
  );
}
