import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Props {
  open: boolean;
  onClose: () => void;
  providerDocs: any[];
  loadingProviderDocs: boolean;
  selectedSendDoc: any | null;
  setSelectedSendDoc: (d: any | null) => void;
  sendDocPin: string;
  setSendDocPin: (s: string) => void;
  sendDocPinValidated: boolean;
  sendDocValidatingPin: boolean;
  validateSendDocPin: () => Promise<void> | void;
  sendDocumentToClient: () => Promise<void> | void;
  sendingDoc: boolean;
}

export default function SendDocModal({
  open,
  onClose,
  providerDocs,
  loadingProviderDocs,
  selectedSendDoc,
  setSelectedSendDoc,
  sendDocPin,
  setSendDocPin,
  sendDocPinValidated,
  sendDocValidatingPin,
  validateSendDocPin,
  sendDocumentToClient,
  sendingDoc,
}: Props) {
  const { t } = useTranslation();
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#1f1f1f] rounded-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-border/50 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2"><span className="text-2xl">📎</span> {t("provider.send_document") || "Send document"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
        </div>

        <div className="px-6 py-4 space-y-4">
          {!selectedSendDoc ? (
            <>
              <p className="text-sm text-muted-foreground">{t("provider.pick_document") || "Pick a document from your library to send to this client."}</p>
              {loadingProviderDocs ? (
                <div className="text-xs text-muted-foreground">{t("messages.loading_docs")}</div>
              ) : providerDocs.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {providerDocs.map((doc) => (
                    <button key={doc.id} onClick={() => setSelectedSendDoc(doc)} className="w-full text-left p-2 rounded-lg border border-border/50 hover:bg-muted dark:hover:bg-white/5 transition-colors">
                      <p className="text-sm font-medium text-foreground truncate">{doc.name || t("messages.unnamed")}</p>
                      <p className="text-xs text-muted-foreground">{doc.document_categories?.name}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">{t("provider.no_documents") || "No documents in your library yet."}</div>
              )}
              <Link to="/documents" className="text-sm text-blue-600 hover:underline dark:text-blue-400">{t("messages.upload_document")}</Link>
            </>
          ) : (
            <>
              <div className="bg-muted/50 dark:bg-white/5 rounded-lg p-4">
                <p className="text-sm font-semibold text-foreground">{selectedSendDoc.name}</p>
                <p className="text-xs text-muted-foreground">{selectedSendDoc.document_categories?.name}</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-foreground">{t("provider.verify_pin") || "Verify PIN to release encryption key"}</label>
                  {sendDocPinValidated && <span className="text-xs text-green-600 dark:text-green-400 font-semibold">✓ {t("messages.verified")}</span>}
                </div>
                <input type="password" value={sendDocPin} onChange={(e) => setSendDocPin(e.target.value)} placeholder={t("provider.enter_pin") || "Enter your PIN"} disabled={sendDocPinValidated} className={`w-full border rounded-md px-3 py-2 bg-background text-foreground dark:bg-[#1f1f1f] transition-colors ${sendDocPinValidated ? "border-green-500/50 dark:border-green-500/30 bg-green-50/50 dark:bg-green-950/20" : "border-border dark:border-white/10"}`} />
                {!sendDocPinValidated && <Button onClick={validateSendDocPin} disabled={!sendDocPin || sendDocValidatingPin} className="mt-2" size="sm">{sendDocValidatingPin ? t("common.verifying") : t("common.verify")}</Button>}
              </div>
            </>
          )}
        </div>

        <div className="border-t border-border/50 px-6 py-4 flex justify-end gap-3">
          <Button variant="outline" onClick={() => { if (selectedSendDoc) { setSelectedSendDoc(null); setSendDocPin(""); } else { onClose(); } }} className="cursor-pointer">{selectedSendDoc ? t("common.back") : t("common.cancel")}</Button>
          {selectedSendDoc && <Button onClick={sendDocumentToClient} disabled={!sendDocPinValidated || sendingDoc} className="cursor-pointer">{sendingDoc ? t("common.sending") : t("provider.send")}</Button>}
        </div>
      </div>
    </div>
  );
}
