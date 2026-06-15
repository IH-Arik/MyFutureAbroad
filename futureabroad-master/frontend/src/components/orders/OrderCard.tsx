import type React from "react";
import { Button } from "@/components/ui/button";
import { VerifiedBadge } from "@/components/provider/VerifiedBadge";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/lib/api";

const OrderCard: React.FC<any> = ({ order, onPay, onViewInvoice, payingOrderId, loadingInvoiceId }) => {
  const { t } = useTranslation();

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="rounded-lg border border-border/50 bg-white dark:bg-[#1f1f1f] overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              {order.providers?.company_name || "Company"}
              <VerifiedBadge verified={(order.providers as any)?.verified ?? false} size="md" />
            </h3>
            <p className="text-sm text-muted-foreground">{order.services?.title || "Service"}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.payment_status)}`}>
            {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
          </span>
        </div>

        {order.amount && (
          <div className="space-y-3 mb-4 p-4 bg-muted/50 dark:bg-white/5 rounded-lg">
            <p className="text-xs text-muted-foreground italic">
              {order.commission_percentage > 0 && t("orders.commission_note")}
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("orders.you_pay")}</span>
              <span className="font-medium text-foreground">{formatCurrency(order.amount, order.currency)}</span>
            </div>
            {order.commission_percentage > 0 && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">− {t("orders.service_fee")} ({order.commission_percentage}%):</span>
                  <span className="text-muted-foreground">{formatCurrency(Math.round((order.amount * order.commission_percentage) / 100), order.currency)}</span>
                </div>
                <div className="border-t border-border/50 pt-3 flex justify-between text-sm font-medium">
                  <span>{t("orders.provider_receives")}</span>
                  <span className="text-foreground">{formatCurrency(Math.round(order.amount * (1 - order.commission_percentage / 100)), order.currency)}</span>
                </div>
              </>
            )}
          </div>
        )}

        {order.notes && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">{t("orders.notes")}</p>
            <p className="text-sm text-foreground">{order.notes}</p>
          </div>
        )}

        {order.payment_date && (
          <p className="text-xs text-muted-foreground">{t("orders.paid_on")} {new Date(order.payment_date).toLocaleDateString()}</p>
        )}

        {order.payment_status === "pending" && (
          <Button onClick={() => onPay(order)} disabled={payingOrderId === order.id} className="w-full mt-4">
            {payingOrderId === order.id ? t("common.processing") : t("orders.pay_now")}
          </Button>
        )}

        {order.payment_status === "paid" && (
          <Button onClick={() => onViewInvoice(order)} disabled={loadingInvoiceId === order.id} variant="outline" className="w-full mt-4 cursor-pointer">
            {loadingInvoiceId === order.id ? t("common.loading") : "📄 View Invoice"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
