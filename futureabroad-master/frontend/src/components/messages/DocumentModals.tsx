import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import DocumentList from "@/components/messages/DocumentList";
import ViewDocumentModal from "@/components/messages/ViewDocumentModal";

interface Props {
  showDocumentModal: boolean;
  showAttachmentModal: boolean;
  onCloseAll: () => void;
  selectedDocument: any | null;
  setSelectedDocument: (d: any | null) => void;
  userDocuments: any[];
  loadDocuments: () => void;
  loadingDocuments: boolean;
  pinInput: string;
  setPinInput: (s: string) => void;
  pinValidated: boolean;
  setPinValidated: (b: boolean) => void;
  validatingPin: boolean;
  submittingDocument: boolean;
  validatePin: () => Promise<void> | void;
  shareDocument: () => Promise<void> | void;
  setShowAttachmentModal: (b: boolean) => void;
  showViewDocumentModal: boolean;
  viewingSharedDocument: any | null;
  setShowViewDocumentModal: (b: boolean) => void;
  setAttachedDocument: (d: any | null) => void;
  viewPin: string;
  setViewPin: (s: string) => void;
  viewPinValidating: boolean;
  onDecrypt: () => void;
}

const DocumentModals: React.FC<Props> = ({
  showDocumentModal,
  showAttachmentModal,
  onCloseAll,
  selectedDocument,
  setSelectedDocument,
  userDocuments,
  loadDocuments,
  loadingDocuments,
  pinInput,
  setPinInput,
  pinValidated,
  setPinValidated,
  validatingPin,
  submittingDocument,
  validatePin,
  shareDocument,
  setShowAttachmentModal,
  showViewDocumentModal,
  viewingSharedDocument,
  setShowViewDocumentModal,
  setAttachedDocument,
  viewPin,
  setViewPin,
  viewPinValidating,
  onDecrypt,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if ((showDocumentModal || showAttachmentModal) && loadDocuments) {
      loadDocuments();
    }
  }, [showDocumentModal, showAttachmentModal]);

  if (!showDocumentModal && !showAttachmentModal && !showViewDocumentModal) return null;

  return (
    <>
      {(showDocumentModal || showAttachmentModal) && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onCloseAll}>
          <div className="bg-white dark:bg-[#1f1f1f] rounded-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-border/50 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="text-2xl">📎</span>{' '}
                {showAttachmentModal ? t("messages.share_doc") : t("messages.select_doc_to_share")}
              </h2>
              <button onClick={onCloseAll} className="text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              {!selectedDocument ? (
                <DocumentList userDocuments={userDocuments} loadingDocuments={loadingDocuments} onSelect={setSelectedDocument} showAttachmentModal={showAttachmentModal} />
              ) : (
                <>
                  <div className="bg-muted/50 dark:bg-white/5 rounded-lg p-4">
                    <p className="text-sm font-semibold text-foreground mb-1">{selectedDocument.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedDocument.document_categories?.name}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-foreground">{t("messages.verify_pin")}</label>
                      {pinValidated && (
                        <span className="text-xs text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                          ✓ {t("messages.verified")}
                        </span>
                      )}
                    </div>
                    <input
                      type="password"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      placeholder={t("messages.enter_pin")}
                      disabled={pinValidated}
                      className={`w-full border rounded-md px-3 py-2 bg-background text-foreground dark:bg-[#1f1f1f] transition-colors ${
                        pinValidated
                          ? "border-green-500/50 dark:border-green-500/30 bg-green-50/50 dark:bg-green-950/20"
                          : "border-border dark:border-white/10"
                      }`}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-border/50 px-6 py-4 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  if (selectedDocument) {
                    setSelectedDocument(null);
                    setPinInput("");
                    setPinValidated(false);
                  } else {
                    onCloseAll();
                  }
                }}
                className="cursor-pointer"
              >
                {selectedDocument ? t("common.back") : t("common.cancel")}
              </Button>
              {selectedDocument && (
                <>
                  {!pinValidated ? (
                    <Button
                      onClick={validatePin}
                      className="cursor-pointer bg-amber-600 hover:bg-amber-700"
                      disabled={!pinInput || validatingPin}
                    >
                      {validatingPin ? t("common.verifying") : t("messages.verify_btn")}
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => { setPinValidated(false); setPinInput(""); }}
                        className="cursor-pointer"
                      >
                        {t("messages.change_pin")}
                      </Button>
                      <Button
                        onClick={() => {
                          if (showAttachmentModal) {
                            // attach mode: notify parent to attach this document to the message
                            setAttachedDocument(selectedDocument);
                            setShowAttachmentModal(false);
                            setSelectedDocument(null);
                            setPinInput("");
                            setPinValidated(false);
                          } else {
                            shareDocument();
                          }
                        }}
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700"
                        disabled={submittingDocument}
                      >
                        {submittingDocument ? t("messages.sharing") : (showAttachmentModal ? 'Attach' : t("messages.share"))}
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <ViewDocumentModal show={showViewDocumentModal} viewingSharedDocument={viewingSharedDocument} onClose={() => setShowViewDocumentModal(false)} viewPin={viewPin} setViewPin={setViewPin} viewPinValidating={viewPinValidating} onDecrypt={onDecrypt} />
    </>
  );
};

export default DocumentModals;
