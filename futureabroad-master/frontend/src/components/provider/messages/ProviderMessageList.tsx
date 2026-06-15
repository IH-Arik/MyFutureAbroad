import type React from "react";
import type { MessageThread, Message } from "@/lib/types";
import { formatCurrency } from "@/lib/api";

function formatTime(ts?: string) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ProviderMessageList({
  messages,
  activeThread,
  userId,
  t,
  viewSharedDocument,
  bottomRef,
}: {
  messages: Message[];
  activeThread: MessageThread;
  userId: string;
  t: any;
  viewSharedDocument: (docName: string, docId?: string) => Promise<void>;
  bottomRef: React.RefObject<HTMLDivElement | null> | null;
}) {
  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
      {messages.map((msg) => {
        const isMe = msg.sender_id === userId;

        const isPaymentRequest = msg.body.includes("💰 Payment Requested:");
        const isDocumentRequest = msg.body.startsWith("📄 Document Requested:");
        const isDocumentShared = msg.body.startsWith("📎 Document Shared:");

        if (isPaymentRequest && isMe) {
          // Extract order ID from the message body: "[ORDER:uuid] 💰 Payment Requested: ..."
          const orderIdMatch = msg.body.match(/^\[ORDER:([a-f0-9-]+)\]/);
          const extractedOrderId = orderIdMatch ? orderIdMatch[1] : null;

          const lines = msg.body.split('\n');
          const firstLine = lines[0];
          // Strip [ORDER:uuid] prefix before extracting amount
          const cleanLine = firstLine.replace(/^\[ORDER:[a-f0-9-]+\]\s*/, "");
          const amountMatch = cleanLine.match(/[\d,.]+/);
          const amount = amountMatch ? parseFloat(amountMatch[0].replace(/,/g, "")) : 0;
          const currencyFromMsg = firstLine.match(/([A-Z]{3})\s*$/);
          const msgCurrency = currencyFromMsg ? currencyFromMsg[1] : "";
          const notes = lines.slice(1).join('\n').trim();

          const threadOrders = Array.isArray((activeThread as any)?.orders) ? (activeThread as any).orders : [];
          // Match by the extracted order ID from the message body (supports multiple payments)
          const matchingOrder = extractedOrderId
            ? threadOrders.find((o: any) => o.id === extractedOrderId)
            : threadOrders.find((o: any) => o.amount === Math.round(amount * 100));

          const paymentStatus = matchingOrder?.payment_status;
          const isPaid = paymentStatus === "paid";
          const isCancelled = paymentStatus === "cancelled";

          let cardColor = "border-amber-500/50 bg-amber-50 dark:bg-amber-950/20";
          let icon = "💰";
          let statusText = t("messages.payment_requested");
          let amountColor = "text-amber-600 dark:text-amber-400";

          if (isPaid && matchingOrder) {
            cardColor = "border-green-500/50 bg-green-50 dark:bg-green-950/20";
            icon = "✓";
            statusText = t("messages.payment_completed");
            amountColor = "text-green-600 dark:text-green-400";
          } else if (isCancelled && matchingOrder) {
            cardColor = "border-gray-400/50 bg-gray-100 dark:bg-gray-800/30";
            icon = "✕";
            statusText = t("messages.payment_cancelled") || "Cancelled";
            amountColor = "text-gray-500 dark:text-gray-400";
          }

          const displayCurrency = msgCurrency || matchingOrder?.currency || (activeThread as any)?.service?.currency || activeThread?.provider?.preferred_currency || "USD";
          const amountCents = Math.round(amount * 100);
          const commissionCents = Math.round((amountCents * 10) / 100);
          const totalCents = amountCents + commissionCents;

          return (
            <div key={msg.id} className="flex justify-end">
              <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl border-2 px-4 py-3 ${cardColor}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{icon}</span>
                  <span className="font-semibold text-foreground">{statusText}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="text-foreground font-medium">
                    {t("messages.amount")}:
                    <span className={`text-lg ${amountColor}`}> {formatCurrency(amountCents, displayCurrency)}</span>
                  </div>
                  <div className="text-muted-foreground text-xs">+ {t("messages.commission")} : <span className={`${amountColor} font-medium`}>{formatCurrency(commissionCents, displayCurrency)}</span></div>
                  <div className="text-muted-foreground text-xs">{t("messages.total")} : <span className={`font-semibold ${amountColor}`}>{formatCurrency(totalCents, displayCurrency)}</span></div>
                  {notes && <div className="mt-2 pt-2 border-t border-amber-200 dark:border-amber-900/50 text-muted-foreground italic">"{notes}"</div>}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{formatTime(msg.created_at)}</p>
              </div>
            </div>
          );
        }

        if (isDocumentRequest && isMe) {
          const titleMatch = msg.body.match(/Document Requested: "([^"]+)"/);
          const title = titleMatch ? titleMatch[1] : "Document";
          const lines = msg.body.split('\n');
          const description = lines.slice(1).join('\n').trim();

          return (
            <div key={msg.id} className="flex justify-end">
              <div className="max-w-[85%] sm:max-w-[70%] rounded-2xl border-2 border-blue-500/50 bg-blue-50 dark:bg-blue-950/20 px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">📄</span>
                  <span className="font-semibold text-foreground">{t("messages.doc_requested")}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="font-semibold text-foreground">{title}</div>
                  {description && <div className="text-muted-foreground text-xs">{description}</div>}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{formatTime(msg.created_at)}</p>
              </div>
            </div>
          );
        }

        if (isDocumentShared) {
          const parts = msg.body.split("||||");
          const docName = parts[0].replace("📎 Document Shared: ", "");
          const docId = parts[2] || parts[1] || undefined;

          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[85%] sm:max-w-[70%] rounded-2xl border-2 border-green-500/50 bg-green-50 dark:bg-green-950/20 px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">📎</span>
                  <span className="font-semibold text-foreground">{t("messages.doc_shared")}</span>
                </div>
                <div className="text-sm font-medium text-foreground mb-3">{docName}</div>
                {!isMe && (
                  <button onClick={() => viewSharedDocument(docName, docId)} className="w-full px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors cursor-pointer">{t("messages.view_doc")}</button>
                )}
                <p className="mt-2 text-xs text-muted-foreground">{formatTime(msg.created_at)}</p>
              </div>
            </div>
          );
        }

        return (
          <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${isMe ? "bg-foreground text-background rounded-br-sm" : "bg-muted dark:bg-white/10 rounded-bl-sm"}`}>
              {!isMe && <p className="mb-1 text-xs font-medium text-muted-foreground">{t("provider.client")}</p>}
              <p>{msg.body}</p>
              <p className={`mt-1 text-xs ${isMe ? "text-background/60" : "text-muted-foreground"}`}>{formatTime(msg.created_at)}</p>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
