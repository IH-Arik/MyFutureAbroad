import type React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function SignupForm({
  accountType,
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  legalAccepted,
  setLegalAccepted,
  inputClass,
  onSubmit,
  loading,
  t,
}: {
  accountType: "client" | "provider" | null;
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  legalAccepted: boolean;
  setLegalAccepted: (v: boolean) => void;
  inputClass: string;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  t: (k: string) => string;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium mb-2">{t("signup.full_name")}</label>
        <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
          placeholder={t("signup.name_placeholder")} required className={inputClass} />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">{t("signup.email")}</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder={t("signup.email_placeholder")} required className={inputClass} />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">{t("signup.password")}</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder={t("signup.password_placeholder")} required className={inputClass} />
        <p className="mt-1 text-xs text-muted-foreground">{t("signup.password_hint")}</p>
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">{t("signup.confirm_password")}</label>
        <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={t("signup.confirm_placeholder")} required className={inputClass} />
      </div>
      <div>
        <label className="inline-flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300 mb-3">
          <input
            type="checkbox"
            checked={legalAccepted}
            onChange={(e) => setLegalAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border border-slate-300 bg-white dark:bg-[#111]"
          />
          <span>
            I agree to the <Link to="/terms" className="font-semibold text-[#8B6949] hover:underline">Terms &amp; Conditions</Link> and <Link to="/privacy" className="font-semibold text-[#8B6949] hover:underline">Privacy Notice</Link>.
          </span>
        </label>
        <Button type="submit" disabled={loading || !legalAccepted} className="w-full h-11 rounded-lg font-medium">
          {loading ? t("signup.creating") : accountType === "provider" ? t("signup.provider_btn") : t("signup.account_btn")}
        </Button>
      </div>
    </form>
  );
}
