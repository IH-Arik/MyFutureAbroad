import type React from "react";
import { Button } from "@/components/ui/button";

export default function VerifyView({
  email,
  error,
  otp,
  setOtp,
  verifying,
  onVerify,
  onCancel,
  t,
}: {
  email: string;
  error: string | null;
  otp: string;
  setOtp: (v: string) => void;
  verifying: boolean;
  onVerify: (e: React.FormEvent) => void;
  onCancel: () => void;
  t: (k: string) => string;
}) {
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
        <h2 className="text-2xl font-bold">{t("signup.verify_title")}</h2>
        <p className="mt-2 mb-6 text-muted-foreground">
          {t("signup.verify_desc")} <strong>{email}</strong>.
          {t("signup.verify_hint")}
        </p>

        {error && (
          <div className="mb-5 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
        )}

        <form onSubmit={onVerify} className="space-y-4">
          <div>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder={t("signup.code_placeholder")}
              required
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-center tracking-widest text-lg text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:bg-[#1f1f1f]"
              maxLength={6}
            />
          </div>
          <Button type="submit" disabled={verifying} className="cursor-pointer w-full h-11 rounded-lg font-medium">
            {t("signup.verify_btn")}
          </Button>
        </form>

        <div className="mt-6">
          <button onClick={onCancel} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">
            {t("signup.cancel_email")}
          </button>
        </div>
      </div>
    </div>
  );
}
