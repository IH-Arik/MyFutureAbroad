import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import CategoryManagerModal from "./CategoryManagerModal";

type Props = {
  file: File | null;
  setFile: (f: File | null) => void;
  selectedCategory: string;
  setSelectedCategory: (s: string) => void;
  isUploading: boolean;
  uploadFile: () => Promise<void>;
  categories: any[];
  onRefreshCategories?: () => void;
};

export default function UploadForm({ file, setFile, selectedCategory, setSelectedCategory, isUploading, uploadFile, categories, onRefreshCategories }: Props) {
  const { t } = useTranslation();
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  return (
    <div className="mb-8 rounded-lg border border-border/50 bg-white p-8 dark:bg-[#1f1f1f]">
      <h2 className="text-xl font-semibold mb-4">{t("documents.upload_btn")}</h2>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-center flex-wrap">
          <label className="flex items-center gap-2 border border-input rounded-md px-3 py-2 cursor-pointer hover:bg-muted transition-colors text-sm">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <span>{t("documents.choose_file")}</span>
            <span className="text-muted-foreground truncate max-w-[180px]">{file ? file.name : t("documents.no_file_chosen")}</span>
          </label>

          <div className="flex gap-2 items-center">
            <select className="border border-input rounded-md px-3 py-2 max-w-xs bg-background dark:bg-[#1f1f1f] dark:border-white/10 dark:text-white" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">{t("documents.select_category")}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowCategoryManager(true)}
              className="text-xs text-[#1f4865] hover:text-[#173b55] dark:text-[#5b9abf] dark:hover:text-[#7bb5d0] underline underline-offset-2 whitespace-nowrap transition-colors"
            >
              {t("documents.manage") || "Manage"}
            </button>
          </div>

          <Button onClick={uploadFile} disabled={!file || !selectedCategory || isUploading}>
            {isUploading ? t("documents.encrypting") : t("documents.upload_secure")}
          </Button>
        </div>
        {isUploading && <p className="text-xs text-muted-foreground animate-pulse">{t("documents.encrypting_desc")}</p>}
      </div>

      {/* Category Manager Modal */}
      <CategoryManagerModal
        open={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
        categories={categories}
        onRefresh={() => {
          // Refresh categories and clear selected if it was deleted
          onRefreshCategories?.();
        }}
      />
    </div>
  );
}
