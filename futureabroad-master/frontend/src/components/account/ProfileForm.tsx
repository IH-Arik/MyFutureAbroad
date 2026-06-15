import type React from "react";
import { Button } from "@/components/ui/button";

export default function ProfileForm({
  fullName,
  setFullName,
  email,
  setEmail,
  user,
  loading,
  onSubmit,
  t,
}: {
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  user: any;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  t: (k: string) => string;
}) {
  return (
    <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-lg border border-border shadow-sm mb-6">
      <h2 className="text-xl font-semibold mb-6 text-foreground">{t("account.profile_title")}</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t("account.full_name")}</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t("account.name_placeholder")}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:bg-[#1f1f1f]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t("account.email")}</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("account.email_placeholder")}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:bg-[#1f1f1f]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t("account.user_id")}</label>
          <input
            type="text"
            disabled
            className="w-full rounded-md border border-border bg-muted px-3 py-2 text-muted-foreground text-sm font-mono"
            value={user.id}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-lg font-medium cursor-pointer"
        >
          {loading ? t("common.saving") : t("account.save")}
        </Button>
      </form>
    </div>
  );
}
