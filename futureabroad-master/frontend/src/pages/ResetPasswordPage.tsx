import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [token, setToken] = useState(searchParams.get("token") || searchParams.get("access_token") || "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // If the URL contains an access_token or session fragment, Supabase client may detect it automatically.
    // We keep email/token fields prefilled when provided via query parameters.
  }, [searchParams]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) return setError(t("forgot.enter_email") || "Please enter your email");
    if (password.length < 6) return setError(t("forgot.short_password") || "Password must be at least 6 characters");
    if (password !== confirm) return setError(t("forgot.password_mismatch") || "Passwords do not match");

    setLoading(true);
    try {
      // If a token/OTP is present, verify it first (recovery type)
      if (token) {
        const { error: verifyError } = await supabase.auth.verifyOtp({ email, token, type: "recovery" as any });
        if (verifyError) {
          setError(verifyError.message);
          setLoading(false);
          return;
        }
      }

      // Attempt to update the user's password (requires a session)
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        // If update failed due to missing session, instruct user to use the recovery email link
        setError(updateError.message || String(updateError));
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      // Redirect to login after brief delay
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err?.message || String(err));
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-lg border border-border/50 bg-white p-8 shadow-sm dark:bg-[#1f1f1f] text-center">
          <h2 className="text-2xl font-bold">{t("forgot.reset_success") || "Password reset"}</h2>
          <p className="mt-3 text-muted-foreground">{t("forgot.reset_success_desc") || "Your password has been updated. Redirecting to sign in..."}</p>
          <div className="mt-6">
            <Link to="/login" className="text-sm text-primary hover:underline">{t("forgot.back_to_login") || "Back to sign in"}</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-lg border border-border/50 bg-white p-8 shadow-sm dark:bg-[#1f1f1f]">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">{t("forgot.reset_title") || "Reset your password"}</h1>
          <p className="mt-2 text-muted-foreground">{t("forgot.reset_subtitle") || "Enter the code from your email (if provided) and a new password."}</p>
        </div>

        {error && <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label htmlFor="rp-email" className="block text-sm font-medium mb-2">{t("login.email") || "Email"}</label>
            <input id="rp-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:bg-[#1f1f1f]" />
          </div>

          <div>
            <label htmlFor="rp-token" className="block text-sm font-medium mb-2">{t("forgot.code") || "Recovery code (if you received one)"}</label>
            <input id="rp-token" type="text" value={token} onChange={(e) => setToken(e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:bg-[#1f1f1f]" />
          </div>

          <div>
            <label htmlFor="rp-password" className="block text-sm font-medium mb-2">{t("login.password") || "New password"}</label>
            <input id="rp-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:bg-[#1f1f1f]" />
          </div>

          <div>
            <label htmlFor="rp-confirm" className="block text-sm font-medium mb-2">{t("forgot.confirm_password") || "Confirm password"}</label>
            <input id="rp-confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:bg-[#1f1f1f]" />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11 rounded-lg font-medium cursor-pointer">
            {loading ? t("forgot.saving") || "Saving..." : t("forgot.reset_btn") || "Reset password"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-primary hover:underline">{t("forgot.back_to_login") || "Back to sign in"}</Link>
        </div>
      </div>
    </div>
  );
}
