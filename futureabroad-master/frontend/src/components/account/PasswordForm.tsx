import type React from "react";
import { Button } from "@/components/ui/button";

export default function PasswordForm({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  loading,
  onSubmit,
  t,
}: {
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  t: (k: string) => string;
}) {
  return (
    <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-lg border border-border shadow-sm mb-6">
      <h2 className="text-xl font-semibold mb-4 text-foreground">{t("account.password_title")}</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t("account.new_password")}</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:bg-[#1f1f1f]"
            placeholder={t("account.password_placeholder")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t("account.confirm_password")}</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:bg-[#1f1f1f]"
            placeholder={t("account.password_placeholder")}
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-lg font-medium cursor-pointer"
        >
          {loading ? t("account.updating") : t("account.update_password")}
        </Button>
      </form>
    </div>
  );
}
