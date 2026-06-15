import type React from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/lib/api";
import type { MessageThread } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  activeThread: MessageThread | null;
  paymentAmount: string;
  submittingPayment: boolean;
  handleStripePayment: () => Promise<void> | void;
}

const PaymentModal: React.FC<Props> = ({ open, onClose, activeThread, paymentAmount, submittingPayment, handleStripePayment }) => {
  const { t } = useTranslation();
  if (!open || !activeThread) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#1f1f1f] rounded-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-border/50 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-2xl">💰</span> {t("messages.payment")}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <strong>How it works:</strong> {t("messages.payment_modal_explainer", "You pay the requested amount. After our 10% service fee, the provider receives the net amount.")}
            </p>
          </div>
          <div className="bg-muted/50 dark:bg-white/5 rounded-lg p-4 space-y-3">
            {(() => {
              if (!paymentAmount) return (<div className="text-muted-foreground">-</div>);
              const amountVal = parseFloat(paymentAmount);
              const amountCents = Math.round(amountVal * 100);
              const commissionCents = Math.round((amountCents * 10) / 100);
              const providerCents = amountCents - commissionCents;
              const ordersData = (activeThread as any)?.orders;
              const threadOrders = Array.isArray(ordersData) ? ordersData : [];
              const matchingOrder = threadOrders.find((o: any) => o.amount === amountCents);
              const firstOrderCurrency = Array.isArray((activeThread as any)?.orders) ? (activeThread as any).orders[0]?.currency : undefined;
              const displayCurrency = matchingOrder?.currency || firstOrderCurrency || (activeThread as any)?.service?.currency || activeThread?.provider?.preferred_currency || 'USD';

              return (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t("messages.you_pay", "You pay")}</span>
                    <span className="text-lg font-semibold text-foreground">{formatCurrency(amountCents, displayCurrency)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">− {t("messages.commission", "Platform fee (10%)")}</span>
                    <span className="text-sm font-medium text-amber-600 dark:text-amber-400">{formatCurrency(commissionCents, displayCurrency)}</span>
                  </div>
                  <div className="border-t border-border/50 pt-3 flex justify-between items-center">
                    <span className="font-semibold text-foreground">{t("messages.provider_receives", "Provider receives")}</span>
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(providerCents, displayCurrency)}</span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
        <div className="border-t border-border/50 px-6 py-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="cursor-pointer">
            {t("common.cancel")}
          </Button>
          <Button onClick={handleStripePayment} className="cursor-pointer bg-amber-600 hover:bg-amber-700" disabled={submittingPayment}>
            {submittingPayment ? t("common.processing") : t("messages.pay_stripe")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
