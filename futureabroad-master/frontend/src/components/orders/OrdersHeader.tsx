import type React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const OrdersHeader: React.FC<any> = ({ filterStatus, setFilterStatus }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <Link to="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        {t("tools.back")}
      </Link>

      <div className="mb-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">{t("orders.title")}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{t("orders.subtitle")}</p>
      </div>

      <div className="flex gap-2 mb-6">
        {(["all", "pending", "paid", "failed"] as const).map((status) => {
          const labels: Record<string, string> = {
            all: t("common.all"),
            pending: t("orders.pending"),
            paid: t("orders.paid"),
            failed: t("orders.failed"),
          };
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                filterStatus === status
                  ? "bg-foreground text-background"
                  : "bg-muted text-foreground hover:bg-muted/80 dark:bg-white/10 dark:hover:bg-white/15"
              }`}
            >
              {labels[status]}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersHeader;
