import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import type { Provider } from "@/lib/types";

export default function JoinCodeCard({ provider }: { provider: (Provider & { join_code?: string }) | null }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  function copyJoinCode() {
    if (!provider?.join_code) return;
    navigator.clipboard.writeText(provider.join_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-white p-6 shadow-sm dark:bg-[#1a1a1a] dark:border-white/10">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-1">{t("provider.join_code")}</h2>
      <p className="text-xs text-muted-foreground mb-4">{t("provider.join_code_desc")}</p>
      <div className="flex items-center gap-3">
        <div className="flex-1 rounded-xl border border-border bg-muted/40 px-5 py-3 text-center font-mono text-2xl font-bold tracking-[0.3em] dark:bg-[#2a2a2a]">
          {provider?.join_code ?? "——"}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-12 rounded-xl px-4 shrink-0"
          onClick={copyJoinCode}
          disabled={!provider?.join_code}
        >
          {copied ? (
            <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          )}
        </Button>
      </div>
    </div>
  );
}
