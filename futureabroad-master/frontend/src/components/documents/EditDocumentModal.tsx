import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

type Doc = any;

type Props = {
  editingDocument: Doc;
  categories: any[];
  editName: string;
  setEditName: (s: string) => void;
  editCategory: string;
  setEditCategory: (s: string) => void;
  isSavingEdit: boolean;
  isDeletingDocId: string | null;
  confirmDelete: (id: string) => void;
  closeEditModal: () => void;
  saveEdit: () => Promise<void>;
};

export default function EditDocumentModal({ editingDocument, categories, editName, setEditName, editCategory, setEditCategory, isSavingEdit, isDeletingDocId, confirmDelete, closeEditModal, saveEdit }: Props) {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={closeEditModal}>
      <div className="bg-white dark:bg-[#1f1f1f] rounded-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="border-b border-border/50 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">{t("documents.edit_title")}</h2>
          <button onClick={closeEditModal} className="text-muted-foreground hover:text-foreground transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t("documents.doc_name")}</label>
            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full border border-input rounded-md px-3 py-2 dark:bg-[#1f1f1f] dark:border-white/10" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t("documents.category")}</label>
            <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="w-full border border-input rounded-md px-3 py-2 bg-background dark:bg-[#1f1f1f] dark:border-white/10 dark:text-white">
              <option value="">{t("documents.select_category")}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border/50 px-6 py-4 flex justify-between gap-3">
          <Button variant="outline" onClick={() => confirmDelete(editingDocument.id)} disabled={isDeletingDocId === editingDocument.id} className="cursor-pointer text-destructive hover:text-destructive">
            {isDeletingDocId === editingDocument.id ? t("common.deleting") : t("common.delete")}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={closeEditModal} className="cursor-pointer">
              {t("common.cancel")}
            </Button>
            <Button onClick={saveEdit} disabled={isSavingEdit} className="cursor-pointer">
              {isSavingEdit ? t("common.saving") : t("common.save")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
