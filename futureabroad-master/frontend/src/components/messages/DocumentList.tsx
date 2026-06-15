import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Props {
  userDocuments: any[];
  loadingDocuments: boolean;
  onSelect: (doc: any) => void;
  showAttachmentModal?: boolean;
}

export default function DocumentList({ userDocuments, loadingDocuments, onSelect, showAttachmentModal }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <div className="text-sm text-muted-foreground">
        {showAttachmentModal
          ? 'Select a document to attach to your message or upload a new one.'
          : t("messages.select_doc_to_share")}
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">{t("messages.your_documents")}</h3>
        {loadingDocuments ? (
          <div className="text-xs text-muted-foreground">{t("messages.loading_docs")}</div>
        ) : userDocuments.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {userDocuments.map((doc) => (
              <button
                key={doc.id}
                onClick={() => onSelect(doc)}
                className="w-full text-left p-2 rounded-lg border border-border/50 hover:bg-muted dark:hover:bg-white/5 transition-colors"
              >
                <p className="text-sm font-medium text-foreground truncate">{doc.name || t("messages.unnamed")}</p>
                <p className="text-xs text-muted-foreground">{doc.document_categories?.name}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">{t("messages.no_documents")}</div>
        )}
      </div>
      <Link to="/documents" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
        {t("messages.upload_document")}
      </Link>
    </>
  );
}
