import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-context";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:bg-[#242424]";

export function AccountPage() {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
    }
    if (user) setEmail(user.email || "");
  }, [profile, user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    const updates: any = { id: user.id, full_name: fullName };

    const { error: profileError } = await supabase.from("profiles").upsert(updates);
    if (profileError) { setError(profileError.message); setSaving(false); return; }

    if (email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({ email });
      if (emailError) { setError(emailError.message); setSaving(false); return; }
    }

    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  if (!user) return null;

  return (
    <div className="mx-auto w-full max-w-xl py-12 px-4">
      <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white mb-2">{t("account.title")}</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-10">{t("account.subtitle")}</p>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">{t("account.full_name")}</label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder={t("account.name_placeholder")}
            className={inputClass}
          />
        </div>

        {/* Date of birth removed */}

        <div>
          <label className="block text-sm font-medium mb-2">{t("account.email")}</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t("account.email_placeholder")}
            className={inputClass}
          />
          {email !== user.email && (
            <p className="mt-1 text-xs text-muted-foreground">{t("account.email_note")}</p>
          )}
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
        )}
        {success && (
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-3 text-sm text-emerald-700 dark:text-emerald-400">
            {t("account.saved_success")}
          </div>
        )}

        <Button type="submit" disabled={saving} className="h-11 rounded-full px-8 font-medium">
          {saving ? t("common.saving") : t("account.save")}
        </Button>
      </form>
    </div>
  );
}
