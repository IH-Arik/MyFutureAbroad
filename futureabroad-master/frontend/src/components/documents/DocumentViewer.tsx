import { useTranslation } from "react-i18next";

type Doc = any;

type Props = {
  viewingDocument: Doc;
  decryptedDocumentUrl: string;
  closeDocument: () => void;
};

export default function DocumentViewer({ viewingDocument, decryptedDocumentUrl, closeDocument }: Props) {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={closeDocument}>
      <div className="bg-white dark:bg-[#1f1f1f] rounded-lg max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="border-b border-border/50 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">{viewingDocument.name}</h2>
            <p className="text-sm text-muted-foreground">{viewingDocument.document_categories?.name}</p>
          </div>
          <button onClick={closeDocument} className="text-muted-foreground hover:text-foreground transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-black/20">
          {viewingDocument.content_type.startsWith("image/") ? (
            <img src={decryptedDocumentUrl} alt={viewingDocument.name} className="max-w-full max-h-full mx-auto" />
          ) : viewingDocument.content_type === "application/pdf" ? (
            <iframe src={decryptedDocumentUrl} style={{ height: "90vh" }} className="w-full h-full border-0" title={viewingDocument.name}></iframe>
          ) : (
            <div className="text-center text-muted-foreground">
              <p className="mb-4">{t("documents.preview_unavailable")}</p>
              <a href={decryptedDocumentUrl} download={viewingDocument.name} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                {t("documents.download")}
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border/50 px-6 py-4 flex justify-end gap-3">
          <button onClick={closeDocument} className="inline-flex items-center justify-center px-4 py-2 bg-transparent border rounded-lg">
            {t("common.close")}
          </button>
          <a href={decryptedDocumentUrl} download={viewingDocument.name} className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer">
            {t("documents.download_btn")}
          </a>
        </div>
      </div>
    </div>
  );
}
