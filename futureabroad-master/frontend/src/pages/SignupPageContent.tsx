import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { signUp, signUpWithRole } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { ConsentBanner } from "@/components/ConsentBanner";
import { CookieBanner } from "@/components/CookieBanner";
import VerifyView from "@/components/signup/VerifyView";
import AccountTypePicker from "@/components/signup/AccountTypePicker";
import SignupForm from "@/components/signup/SignupForm";

type AccountType = "client" | "provider" | null;

const inputClass =
  "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:bg-[#1f1f1f]";

export default function SignupPageContent() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [accountType, setAccountType] = useState<AccountType>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const SIGNUP_LEGAL_KEY = "mfa-legal-agreed-signup";
  const [legalAccepted, setLegalAccepted] = useState<boolean>(() => {
    try { return !!localStorage.getItem(SIGNUP_LEGAL_KEY); } catch { return false; }
  });

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!fullName.trim()) { setError("Please enter your full name"); return; }
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (!legalAccepted) { setError("You must agree to the Terms & Conditions and Privacy Notice"); return; }
    setLoading(true);
    const { error: signUpError } = accountType === "provider"
      ? await signUpWithRole(email, password, "provider", fullName, legalAccepted)
      : await signUp(email, password, fullName, legalAccepted);
    if (signUpError) { setError(signUpError.message); setLoading(false); return; }
    try { localStorage.setItem(SIGNUP_LEGAL_KEY, "true"); } catch {}
    setSuccess(true);
    setLoading(false);
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setVerifying(true);
    const { error: verifyError } = await supabase.auth.verifyOtp({ email, token: otp, type: "signup" });
    if (verifyError) {
      setError(verifyError.message);
      setVerifying(false);
      return;
    }
    navigate(accountType === "provider" ? "/provider" : "/");
  }

  // ── Success / Verification ─────────────────────────────────
  if (success) {
    return (
      <>
        <VerifyView
          email={email}
          error={error}
          otp={otp}
          setOtp={setOtp}
          verifying={verifying}
          onVerify={handleVerify}
          onCancel={() => setSuccess(false)}
          t={t}
        />
        <CookieBanner />
        <ConsentBanner />
      </>
    );
  }

  // ── Step 1: account type picker ───────────────────────────────
  if (!accountType) {
    return (
      <>
        <AccountTypePicker setAccountType={setAccountType} t={t} />
        <CookieBanner />
        <ConsentBanner />
      </>
    );
  }

  // ── Step 2: credentials ───────────────────────────────────────
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-lg border border-border/50 bg-white p-8 shadow-sm dark:bg-[#1f1f1f]">
        <div className="mb-6">
          <button
            onClick={() => { setAccountType(null); setError(null); }}
            className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-bold tracking-tight">
            {accountType === "provider" ? t("signup.provider_btn") : t("signup.account_btn")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {accountType === "provider" ? t("signup.provider_hint") : t("signup.setup_title")}
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
        )}

        <SignupForm
          accountType={accountType}
          fullName={fullName}
          setFullName={setFullName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          legalAccepted={legalAccepted}
          setLegalAccepted={setLegalAccepted}
          inputClass={inputClass}
          onSubmit={handleSignup}
          loading={loading}
          t={t}
        />

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {t("signup.have_account")} {" "}
            <Link to="/login" className="font-medium text-primary hover:underline">{t("signup.sign_in")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
