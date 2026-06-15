import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface Props {
  show: boolean;
  viewingSharedDocument: any | null;
  onClose: () => void;
  viewPin: string;
  setViewPin: (s: string) => void;
  viewPinValidating: boolean;
  onDecrypt: () => void;
}

export default function ViewDocumentModal({ show, viewingSharedDocument, onClose, viewPin, setViewPin, viewPinValidating, onDecrypt }: Props) {
  const { t } = useTranslation();

  if (!show || !viewingSharedDocument) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#1f1f1f] rounded-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-border/50 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-2xl">📎</span> {t("messages.shared_doc")}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="px-6 py-4 space-y-4">
          {viewingSharedDocument.loading ? (
            <div className="text-center py-8">
              <div className="text-sm text-muted-foreground">{t("messages.loading_doc")}</div>
            </div>
          ) : (
            <>
              <div className="bg-muted/50 dark:bg-white/5 rounded-lg p-4">
                <p className="text-sm font-semibold text-foreground">{viewingSharedDocument.name}</p>
                {viewingSharedDocument?.document_categories?.name && (
                  <p className="text-xs text-muted-foreground mt-1">{viewingSharedDocument.document_categories.name}</p>
                )}
              </div>
              {viewingSharedDocument.needsPin ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">{t("messages.enter_pin_to_decrypt") || "Enter your PIN to decrypt this document."}</p>
                  <input type="password" value={viewPin} onChange={(e) => setViewPin(e.target.value)} placeholder={t("provider.enter_pin") || "Enter your PIN"} className="w-full border rounded-md px-3 py-2 bg-background text-foreground border-border dark:border-white/10" />
                  <Button onClick={onDecrypt} disabled={!viewPin || viewPinValidating} className="w-full cursor-pointer">{viewPinValidating ? t("common.verifying") : t("common.verify")}</Button>
                </div>
              ) : viewingSharedDocument.fileUrl ? (
                <a
                  href={viewingSharedDocument.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors text-center cursor-pointer"
                >
                  {t("documents.download")}
                </a>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">{t("documents.preview_unavailable")}</div>
              )}
            </>
          )}
        </div>
        <div className="border-t border-border/50 px-6 py-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="cursor-pointer">
            {t("common.close")}
          </Button>
        </div>
      </div>
    </div>
  );
}
