import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/api";

function getDefaultCurrency(thread: any): string {
  if (!thread) return "USD";
  const orders = Array.isArray(thread.orders) ? thread.orders : [];
  const firstOrder = orders[0];
  return firstOrder?.currency || thread?.service?.currency || thread?.provider?.preferred_currency || "USD";
}

export default function ProviderPaymentModal({
  open,
  onClose,
  paymentAmount,
  setPaymentAmount,
  paymentCurrency,
  setPaymentCurrency,
  paymentNotes,
  setPaymentNotes,
  submittingPayment,
  submitPaymentRequest,
  activeThread,
  t,
}: {
  open: boolean;
  onClose: () => void;
  paymentAmount: string;
  setPaymentAmount: (v: string) => void;
  paymentCurrency: string;
  setPaymentCurrency: (v: string) => void;
  paymentNotes: string;
  setPaymentNotes: (v: string) => void;
  submittingPayment: boolean;
  submitPaymentRequest: () => Promise<void>;
  activeThread: any;
  t: any;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#1f1f1f] rounded-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-border/50 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">{t("provider.request_payment")}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">{t("messages.amount")}</label>
            <p className="text-xs text-muted-foreground mb-2">{t("provider.payment_amount_note")}</p>
            <input type="number" step="0.01" min="0" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="0.00" className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground dark:bg-[#1f1f1f] dark:border-white/10" />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Payment Currency</label>
            <p className="text-xs text-muted-foreground mb-2">{t("provider.payment_currency_note")}</p>
            <select value={paymentCurrency} onChange={(e) => setPaymentCurrency(e.target.value)} className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground dark:bg-[#1f1f1f] dark:border-white/10">
              <option value="">{`Default (${getDefaultCurrency(activeThread)})`}</option>
              <option value="USD">USD - United States Dollar ($)</option>
              <option value="EUR">EUR - Euro (€)</option>
              <option value="GBP">GBP - British Pound (£)</option>
            </select>
          </div>

          {paymentAmount && (
            <div className="mt-3 space-y-1 text-sm bg-muted/50 dark:bg-white/5 p-3 rounded">
              <p className="text-muted-foreground">− {t("messages.commission")} (10%): <span className="text-foreground font-medium">{formatCurrency(Math.round(parseFloat(paymentAmount) * 10), paymentCurrency || getDefaultCurrency(activeThread))}</span></p>
              <p className="font-semibold text-foreground border-t border-border/50 pt-2">{t("provider.you_receive")} {formatCurrency(Math.round(parseFloat(paymentAmount) * 90), paymentCurrency || getDefaultCurrency(activeThread))}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t("provider.notes_optional")}</label>
            <textarea value={paymentNotes} onChange={(e) => setPaymentNotes(e.target.value)} placeholder={t("provider.notes_placeholder")} rows={3} className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground resize-none dark:bg-[#1f1f1f] dark:border-white/10" />
          </div>
        </div>

        <div className="border-t border-border/50 px-6 py-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="cursor-pointer">{t("common.cancel")}</Button>
          <Button onClick={submitPaymentRequest} disabled={!paymentAmount || submittingPayment} className="cursor-pointer">{submittingPayment ? t("common.saving") : t("provider.send_request")}</Button>
        </div>
      </div>
    </div>
  );
}
