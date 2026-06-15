import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { ConsentBanner } from "@/components/ConsentBanner";
import { CookieBanner } from "@/components/CookieBanner";

const LoginPageContent: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [needsVerification, setNeedsVerification] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      if (signInError.message.toLowerCase().includes("email not confirmed")) {
        setNeedsVerification(true);
      } else {
        setError(signInError.message);
      }
      setLoading(false);
    } else {
      const redirect = searchParams.get("redirect");
      navigate(redirect ?? "/");
    }
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
    
    const redirect = searchParams.get("redirect");
    navigate(redirect ?? "/");
  }

  async function handleResendCode() {
    setError(null);
    const { error: resendError } = await supabase.auth.resend({ type: "signup", email });
    if (resendError) {
      setError(resendError.message);
    } else {
      setError("A new code has been sent to your email."); 
    }
  }

  if (needsVerification) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-lg border border-border/50 bg-white p-8 shadow-sm dark:bg-[#1f1f1f] text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold">{t("login.verify_title")}</h2>
          <p className="mt-2 mb-6 text-muted-foreground">
            {t("login.verify_desc")} <strong>{email}</strong>.
          </p>
          
          {error && (
            <div className={`mb-5 rounded-lg p-4 text-sm ${error.includes("sent") ? "bg-green-100/10 text-green-600" : "bg-destructive/10 text-destructive"}`}>
              {error}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder={t("login.code_placeholder")}
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-center tracking-widest text-lg text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:bg-[#1f1f1f]"
                maxLength={6}
              />
            </div>
            <Button type="submit" disabled={verifying} className="cursor-pointer w-full h-11 rounded-lg font-medium">
              {t("login.verify_btn")}
            </Button>
          </form>

          <div className="mt-6 flex flex-col gap-4">
            <button onClick={handleResendCode} className="text-sm text-primary hover:underline cursor-pointer">
              {t("login.resend")}
            </button>
            <button onClick={() => { setNeedsVerification(false); setError(null); }} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">
              {t("login.back_to_login")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen relative items-center justify-center bg-background px-4">
        <Link to="/" className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t("login.back")}
        </Link>
        <div className="w-full max-w-md rounded-lg border border-border/50 bg-white p-8 shadow-sm dark:bg-[#1f1f1f]">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">{t("login.title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("login.subtitle")}</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              {t("login.email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("login.email_placeholder")}
              required
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:bg-[#1f1f1f]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              {t("login.password")}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("login.password_placeholder")}
              required
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:bg-[#1f1f1f]"
            />
            <div className="mt-2 text-right">
              <Link to="/forgot" className="text-sm text-primary hover:underline">{t("login.forgot_password") || "Forgot password?"}</Link>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg font-medium cursor-pointer"
          >
            {loading ? t("login.signing_in") : t("login.sign_in")}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {t("login.no_account")} {" "}
            <Link
              to="/signup"
              className="font-medium text-primary hover:underline"
            >
              {t("login.sign_up")}
            </Link>
          </p>
        </div>
        </div>
      </div>
      <CookieBanner />
      <ConsentBanner />
    </>
  );
}

export default LoginPageContent;
