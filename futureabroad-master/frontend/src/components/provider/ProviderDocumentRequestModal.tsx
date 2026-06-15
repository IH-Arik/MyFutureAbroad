import { Button } from "@/components/ui/button";

export default function ProviderDocumentRequestModal({
  open,
  onClose,
  documentTitle,
  setDocumentTitle,
  documentDescription,
  setDocumentDescription,
  submittingDocument,
  submitDocumentRequest,
  t,
}: {
  open: boolean;
  onClose: () => void;
  documentTitle: string;
  setDocumentTitle: (v: string) => void;
  documentDescription: string;
  setDocumentDescription: (v: string) => void;
  submittingDocument: boolean;
  submitDocumentRequest: () => Promise<void>;
  t: any;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#1f1f1f] rounded-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-border/50 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">{t("provider.request_document")}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t("provider.doc_title")}</label>
            <input type="text" value={documentTitle} onChange={(e) => setDocumentTitle(e.target.value)} placeholder={t("provider.doc_title_placeholder")} className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground dark:bg-[#1f1f1f] dark:border-white/10" />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t("provider.notes_optional")}</label>
            <textarea value={documentDescription} onChange={(e) => setDocumentDescription(e.target.value)} placeholder={t("provider.doc_desc_placeholder")} rows={3} className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground resize-none dark:bg-[#1f1f1f] dark:border-white/10" />
          </div>
        </div>

        <div className="border-t border-border/50 px-6 py-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="cursor-pointer">{t("common.cancel")}</Button>
          <Button onClick={submitDocumentRequest} disabled={!documentTitle.trim() || submittingDocument} className="cursor-pointer">{submittingDocument ? t("common.saving") : t("provider.send_request")}</Button>
        </div>
      </div>
    </div>
  );
}
