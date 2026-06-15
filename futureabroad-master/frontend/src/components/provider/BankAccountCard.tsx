import { useTranslation } from "react-i18next";
import { StripeConnectButton } from "@/components/StripeConnectButton";
import type { Provider } from "@/lib/types";

export default function BankAccountCard({ provider, userId }: { provider: (Provider & { join_code?: string }) | null; userId?: string | null | undefined; }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-border/50 bg-white p-6 shadow-sm dark:bg-[#1a1a1a] dark:border-white/10 sm:col-span-2">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">{t("provider.bank_account_title")}</h2>
      <p className="text-xs text-muted-foreground mb-4">{t("provider.bank_account_desc")}</p>
      {provider && userId ? (
        <StripeConnectButton userId={userId} providerId={provider.id} />
      ) : (
        <p className="text-xs text-muted-foreground">{t("common.loading")}</p>
      )}
    </div>
  );
}
