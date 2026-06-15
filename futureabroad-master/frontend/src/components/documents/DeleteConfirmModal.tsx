import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

type Props = {
  deleteConfirmDocId: string | null;
  setDeleteConfirmDocId: (id: string | null) => void;
  deleteDocument: (id: string) => Promise<void>;
  isDeletingDocId: string | null;
};

export default function DeleteConfirmModal({ deleteConfirmDocId, setDeleteConfirmDocId, deleteDocument, isDeletingDocId }: Props) {
  const { t } = useTranslation();
  if (!deleteConfirmDocId) return null;
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirmDocId(null)}>
      <div className="bg-white dark:bg-[#1f1f1f] rounded-lg max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-border/50 px-6 py-4">
          <h2 className="text-xl font-semibold">{t("documents.delete_title")}</h2>
        </div>

        <div className="px-6 py-4">
          <p className="text-base text-muted-foreground">{t("documents.delete_confirm")}</p>
        </div>

        <div className="border-t border-border/50 px-6 py-4 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteConfirmDocId(null)} className="cursor-pointer">
            {t("common.cancel")}
          </Button>
          <Button onClick={() => deleteDocument(deleteConfirmDocId)} disabled={isDeletingDocId === deleteConfirmDocId} className="cursor-pointer bg-destructive hover:bg-destructive/90 text-destructive-foreground">
            {isDeletingDocId === deleteConfirmDocId ? t("common.deleting") : t("common.delete")}
          </Button>
        </div>
      </div>
    </div>
  );
}
