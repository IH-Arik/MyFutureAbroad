import type React from "react";
import { Button } from "@/components/ui/button";

export default function JoinBusinessForm({
  joinCode,
  setJoinCode,
  onSubmit,
  joinError,
  joining,
  t,
}: {
  joinCode: string;
  setJoinCode: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  joinError: string | null;
  joining: boolean;
  t: (k: string) => string;
}) {
  return (
    <section className="rounded-2xl border border-border/50 bg-white px-6 py-6 shadow-sm dark:bg-[#1a1a1a] dark:border-white/10">
      <h2 className="text-lg font-semibold mb-1">{t("provider.join_business_title")}</h2>
      <p className="text-sm text-muted-foreground mb-4">{t("provider.join_business_desc")}</p>
      <form onSubmit={onSubmit} className="flex gap-3">
        <input
          type="text"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          placeholder={t("provider.join_code_placeholder")}
          maxLength={6}
          className="w-36 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-mono uppercase tracking-widest text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:bg-[#2a2a2a]"
        />
        <Button type="submit" disabled={joining || joinCode.trim().length !== 6} className="rounded-lg h-10">
          {joining ? t("provider.joining") : t("provider.join")}
        </Button>
      </form>
      {joinError && <p className="mt-2 text-sm text-destructive">{joinError}</p>}
    </section>
  );
}
