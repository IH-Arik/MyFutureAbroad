import { Button } from "@/components/ui/button";
import type { MessageThread, Message } from "@/lib/types";
import { formatCurrency as _formatCurrency } from "@/lib/api";

function formatTime(ts?: string) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessageList({
  messages,
  activeThread,
  user,
  profile,
  t,
  formatCurrency = _formatCurrency,
  viewSharedDocument,
  setPaymentAmount,
  setShowPaymentModal,
  setShowDocumentModal,
}: {
  messages: Message[];
  activeThread: MessageThread;
  user: any;
  profile: any;
  t: any;
  formatCurrency?: (amountInCents: number, currency?: string) => string;
  viewSharedDocument: (docName: string, docId?: string) => Promise<void>;
  setPaymentAmount: (v: string) => void;
  setShowPaymentModal: (v: boolean) => void;
  setShowDocumentModal: (v: boolean) => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto px-2 sm:px-6 py-3 sm:py-4 space-y-3 max-w-full">
      {activeThread.order && (
        <div className="flex justify-center mb-4">
          <div className="rounded-lg sm:rounded-xl border border-blue-200/50 bg-blue-50/50 dark:border-blue-900/30 dark:bg-blue-950/20 px-3 sm:px-4 py-2 sm:py-3 max-w-md text-center text-xs sm:text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-200">✨ {t("messages.new_order_created")}</p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">{t("messages.provider_in_touch")}</p>
            {(activeThread.order as any)?.service?.id && (activeThread.order as any)?.service?.service_type && (
              <a href={`/services/${(activeThread.order as any).service.service_type}/${(activeThread.order as any).service.id}`} className="mt-3 inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium transition-colors">{t("messages.view_service")}</a>
            )}
          </div>
        </div>
      )}

      {messages.map((msg) => {
        const isMe = msg.sender_id === user.id;
        const senderName = isMe ? (profile?.full_name || user.email) : (activeThread.provider?.company_name || (t("messages.deleted_company") || "Deleted Company"));

        const isPaymentRequest = msg.body.includes("💰 Payment Requested:");
        const isDocumentRequest = msg.body.startsWith("📄 Document Requested:");

        if (isPaymentRequest && !isMe) {
          // Extract order ID from the message body: "[ORDER:uuid] 💰 Payment Requested: ..."
          const orderIdMatch = msg.body.match(/^\[ORDER:([a-f0-9-]+)\]/);
          const extractedOrderId = orderIdMatch ? orderIdMatch[1] : null;

          const lines = msg.body.split("\n");
          const firstLine = lines[0];
          // Strip [ORDER:uuid] prefix before extracting amount
          const cleanLine = firstLine.replace(/^\[ORDER:[a-f0-9-]+\]\s*/, "");
          const amountMatch = cleanLine.match(/[\d,.]+/);
          const amount = amountMatch ? parseFloat(amountMatch[0].replace(/,/g, "")) : 0;
          const currencyFromMsg = firstLine.match(/([A-Z]{3})\s*$/);
          const msgCurrency = currencyFromMsg ? currencyFromMsg[1] : "";
          const notes = lines.slice(1).join("\n").trim();

          const threadOrders = Array.isArray((activeThread as any)?.orders) ? (activeThread as any).orders : [];
          // Match by extracted order ID from the message body (supports multiple payments)
          const matchingOrder = extractedOrderId
            ? threadOrders.find((o: any) => o.id === extractedOrderId)
            : threadOrders.find((o: any) => o.amount === Math.round(amount * 100));

          const paymentStatus = matchingOrder?.payment_status;
          const isPaid = paymentStatus === 'paid';
          const isCancelled = paymentStatus === 'cancelled';
          const isCompleted = isPaid || isCancelled;

          let cardColor = 'border-amber-500/50 bg-amber-50 dark:bg-amber-950/20';
          let icon = '💰';
          let statusText = t("messages.payment_request");
          let amountColor = 'text-amber-600 dark:text-amber-400';

          if (isPaid && matchingOrder) {
            cardColor = 'border-green-500/50 bg-green-50 dark:bg-green-950/20';
            icon = '✓';
            statusText = t("messages.payment_completed");
            amountColor = 'text-green-600 dark:text-green-400';
          } else if (isCancelled && matchingOrder) {
            cardColor = 'border-gray-400/50 bg-gray-100 dark:bg-gray-800/30';
            icon = '✕';
            statusText = t("messages.payment_cancelled") || 'Cancelled';
            amountColor = 'text-gray-500 dark:text-gray-400';
          }

          const displayCurrency = msgCurrency || matchingOrder?.currency || (activeThread as any)?.service?.currency || activeThread?.provider?.preferred_currency || 'USD';
          const amountInCents = Math.round(amount * 100);
          const commissionCents = Math.round((amountInCents * 10) / 100);
          const providerReceivesCents = amountInCents - commissionCents;

          return (
            <div key={msg.id} className="flex flex-col items-start">
              <p className="text-xs text-muted-foreground mb-1 px-1">{senderName}</p>
              <div className={`max-w-[95%] sm:max-w-[85%] lg:max-w-[70%] rounded-2xl border-2 px-3 sm:px-4 py-2 sm:py-3 ${cardColor}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base sm:text-lg">{icon}</span>
                  <span className="font-semibold text-xs sm:text-sm text-foreground">{statusText}</span>
                </div>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="text-foreground font-medium text-xs sm:text-sm">{t("messages.amount")} : <span className={`text-sm sm:text-lg ${amountColor}`}>{formatCurrency(amountInCents, displayCurrency)}</span></div>
                  <div className="text-muted-foreground text-xs">− {t("messages.commission")} : <span className={`${amountColor} font-medium`}>{formatCurrency(commissionCents, displayCurrency)}</span></div>
                  <div className="text-muted-foreground text-xs">{t("messages.provider_receives")} : <span className={`font-semibold ${amountColor}`}>{formatCurrency(providerReceivesCents, displayCurrency)}</span></div>
                  {notes && (<div className="mt-2 pt-2 border-t border-amber-200 dark:border-amber-900/50 text-muted-foreground italic">"{notes}"</div>)}
                </div>
                {!isCompleted && (
                  <Button onClick={() => { setPaymentAmount(amount.toString()); setShowPaymentModal(true); }} className="mt-3 w-full cursor-pointer bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm">{t("messages.pay_now")}</Button>
                )}
                <p className="mt-2 text-xs text-muted-foreground">{formatTime(msg.created_at)}</p>
              </div>
            </div>
          );
        }

        if (isDocumentRequest && !isMe) {
          const lines = msg.body.split('\n');
          const titleMatch = lines[0].match(/Document Requested: "([^\"]+)"/);
          const title = titleMatch ? titleMatch[1] : "Document";
          const description = lines.slice(1).join('\n').trim();

          return (
            <div key={msg.id} className="flex flex-col items-start">
              <p className="text-xs text-muted-foreground mb-1 px-1">{senderName}</p>
              <div className="max-w-[95%] sm:max-w-[85%] lg:max-w-[70%] rounded-2xl border-2 border-blue-500/50 bg-blue-50 dark:bg-blue-950/20 px-3 sm:px-4 py-2 sm:py-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base sm:text-lg">📄</span>
                  <span className="font-semibold text-sm sm:text-base text-foreground">{t("messages.doc_requested")}</span>
                </div>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="font-semibold text-foreground">{title}</div>
                  {description && (<div className="text-muted-foreground text-xs">{description}</div>)}
                </div>
                <Button onClick={() => setShowDocumentModal(true)} className="mt-3 w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm">{t("messages.share_doc")}</Button>
                <p className="mt-2 text-xs text-muted-foreground">{formatTime(msg.created_at)}</p>
              </div>
            </div>
          );
        }

        const isDocumentShared = msg.body.startsWith("📎 Document Shared:");

        if (isDocumentShared) {
          const parts = msg.body.split("||||");
          const docName = parts[0].replace("📎 Document Shared: ", "");
          const docId = parts[2] || parts[1] || undefined;

          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              <p className="text-xs text-muted-foreground mb-1 px-1">{senderName}</p>
              <div className="max-w-[95%] sm:max-w-[85%] lg:max-w-[70%] rounded-2xl border-2 border-green-500/50 bg-green-50 dark:bg-green-950/20 px-3 sm:px-4 py-2 sm:py-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base sm:text-lg">📎</span>
                  <span className="font-semibold text-sm sm:text-base text-foreground">{t("messages.doc_shared")}</span>
                </div>
                <div className="text-xs sm:text-sm font-medium text-foreground mb-3 break-words">{docName}</div>
                {!isMe && (
                  <button onClick={() => viewSharedDocument(docName, docId)} className="w-full px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer">{t("messages.view_doc")}</button>
                )}
                <p className="mt-2 text-xs text-muted-foreground">{formatTime(msg.created_at)}</p>
              </div>
            </div>
          );
        }

        return (
          <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
            <p className="text-xs text-muted-foreground mb-1 px-1">{senderName}</p>
            <div className={`max-w-[95%] sm:max-w-[85%] lg:max-w-[70%] rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm break-words ${isMe ? "bg-foreground text-background rounded-br-sm" : "bg-muted dark:bg-white/10 rounded-bl-sm"}`}>
              <p>{msg.body}</p>
              <p className={`mt-1 text-xs ${isMe ? "text-background/60" : "text-muted-foreground"}`}>{formatTime(msg.created_at)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
