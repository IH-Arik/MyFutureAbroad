import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!email.trim()) return setError(t("forgot.enter_email") || "Please enter your email");
    setLoading(true);
    try {
      // Ask Supabase to send a password recovery email
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) {
        setError(error.message || String(error));
      } else {
        setMessage(t("forgot.email_sent") || "If an account exists with that email, a recovery link or code has been sent.");
      }
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-lg border border-border/50 bg-white p-8 shadow-sm dark:bg-[#1f1f1f]">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">{t("forgot.title") || "Forgot your password?"}</h1>
          <p className="mt-2 text-muted-foreground">{t("forgot.subtitle") || "Enter your email and we'll send recovery instructions."}</p>
        </div>

        {message && <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</div>}
        {error && <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fp-email" className="block text-sm font-medium mb-2">{t("login.email") || "Email"}</label>
            <input id="fp-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:bg-[#1f1f1f]" />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11 rounded-lg font-medium cursor-pointer">
            {loading ? t("forgot.sending") || "Sending..." : t("forgot.send_link") || "Send recovery email"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-primary hover:underline">{t("forgot.back_to_login") || "Back to sign in"}</Link>
        </div>
      </div>
    </div>
  );
}
