import type React from "react";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Attachment01Icon } from "@hugeicons/core-free-icons";

const ChatComposer: React.FC<any> = ({ attachedDocument, setAttachedDocument, setShowAttachmentModal, draft, setDraft, handleKeyDown, sendMessage, sending, t }) => {
  return (
    <div className="border-t border-border/40 px-2 sm:px-4 py-2 sm:py-3 dark:border-white/10 space-y-2">
      {attachedDocument && (
        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-700 rounded-lg p-2 sm:p-3 text-sm">
          <span className="text-base sm:text-lg shrink-0">📎</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-foreground truncate">{attachedDocument.name}</p>
            <p className="text-xs text-muted-foreground truncate">{attachedDocument.document_categories?.name}</p>
          </div>
          <button onClick={() => setAttachedDocument(null)} className="text-muted-foreground hover:text-foreground transition-colors shrink-0"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
        </div>
      )}
      <div className="flex items-end gap-2">
        <button onClick={() => setShowAttachmentModal(true)} className="h-9 sm:h-10 w-9 sm:w-10 rounded-lg sm:rounded-xl border border-border bg-background hover:bg-muted transition-colors flex items-center justify-center shrink-0 dark:bg-[#242424]" title="Attach document"><HugeiconsIcon icon={Attachment01Icon} className="w-4 h-4" /></button>
        <textarea value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={handleKeyDown} placeholder={t("messages.type_message")} rows={1} className="flex-1 resize-none rounded-lg sm:rounded-xl border border-border bg-background px-3 sm:px-4 py-2 text-xs sm:text-sm focus:border-primary focus:outline-none dark:bg-[#242424]" />
        <Button onClick={sendMessage} disabled={(!draft.trim() && !attachedDocument) || sending} className="h-9 sm:h-10 rounded-lg sm:rounded-xl px-3 sm:px-4 text-xs sm:text-sm shrink-0">{t("messages.send")}</Button>
      </div>
    </div>
  );
};

export default ChatComposer;
