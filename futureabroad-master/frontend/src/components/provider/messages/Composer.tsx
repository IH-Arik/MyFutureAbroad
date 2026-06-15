import type React from "react";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Attachment01Icon } from "@hugeicons/core-free-icons";

const Composer: React.FC<any> = ({ draft, setDraft, handleKeyDown, sendMessage, sending, setShowPaymentModal, setShowDocumentModal, openSendDocModal, activeThread, setPaymentCurrency, t }) => {
  return (
    <div className="border-t border-border/40 px-4 py-3 dark:border-white/10 space-y-2">
      <div className="flex items-end gap-2">
        <textarea value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={handleKeyDown} placeholder={t("messages.type_message")} rows={1} className="flex-1 resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none dark:bg-[#1a1a1a]" />
        <Button onClick={sendMessage} disabled={!draft.trim() || sending} className="h-10 rounded-xl px-4">{t("messages.send")}</Button>
      </div>

      <div className="flex items-center gap-2 pl-0">
        <button onClick={() => { const firstOrder = Array.isArray((activeThread as any)?.orders) ? (activeThread as any).orders[0] : null; const svcCurrency = (activeThread as any)?.service?.currency || firstOrder?.currency || ""; if (svcCurrency) setPaymentCurrency(svcCurrency); setShowPaymentModal(true); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors dark:hover:bg-white/5" title={t("provider.request_payment")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg> {t("messages.payment")}
        </button>

        <button onClick={() => setShowDocumentModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors dark:hover:bg-white/5" title={t("provider.request_document")}>
          <HugeiconsIcon icon={Attachment01Icon} className="w-4 h-4" />
          {t("provider.document")}
        </button>

        <button onClick={openSendDocModal} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors dark:hover:bg-white/5" title="Send document">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"></path></svg>
          Send doc
        </button>
      </div>
    </div>
  );
};

export default Composer;
