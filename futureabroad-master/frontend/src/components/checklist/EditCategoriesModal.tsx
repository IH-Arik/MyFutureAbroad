import type React from "react";
import { useState } from "react";
import type { ChecklistCategory } from "@/lib/types";

const EditCategoriesModal: React.FC<any> = ({
  show,
  customCategories,
  presetCategories,
  onAddCategory,
  onRenameCategory,
  onDeleteCategory,
  onClose,
  t,
  tCat,
}) => {
  const [newCatName, setNewCatName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  if (!show) return null;

  const handleAdd = async () => {
    const name = newCatName.trim();
    if (!name) return;
    await onAddCategory(name);
    setNewCatName("");
  };

  const handleStartRename = (cat: ChecklistCategory) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const handleSaveRename = async () => {
    if (!editingId || !editingName.trim()) return;
    await onRenameCategory(editingId, editingName.trim());
    setEditingId(null);
    setEditingName("");
  };

  const handleDelete = async (cat: ChecklistCategory) => {
    const msg = t("checklists.delete_category_confirm", { name: cat.name.replace(/_/g, " ") });
    if (!confirm(msg)) return;
    await onDeleteCategory(cat.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-border/50 bg-white dark:bg-[#1f1f1f] shadow-xl overflow-hidden">
        <div className="sticky top-0 flex items-center justify-between border-b border-border/40 bg-white dark:bg-[#1f1f1f] px-4 lg:px-6 py-3 lg:py-4 rounded-t-2xl">
          <h2 className="text-base lg:text-lg font-semibold text-foreground">{t("checklists.edit_categories_title")}</h2>
          <button onClick={onClose} className="rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 p-4 lg:p-6">
          {/* Preset categories (read-only) */}
          <div>
            <label className="block text-xs lg:text-sm font-medium text-foreground mb-2">{t("checklists.categories_presets")}</label>
            <div className="flex flex-wrap gap-1.5">
              {presetCategories.map((c: string) => (
                <span key={c} className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-white dark:bg-[#1f1f1f] text-muted-foreground border border-border capitalize">
                  {tCat(c)}
                </span>
              ))}
            </div>
          </div>

          {/* Custom categories */}
          <div>
            <label className="block text-xs lg:text-sm font-medium text-foreground mb-2">{t("checklists.categories_custom")}</label>
            {customCategories.length === 0 ? (
              <p className="text-xs text-muted-foreground">{t("checklists.categories_no_custom")}</p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {customCategories.map((cat: ChecklistCategory) => (
                  <div key={cat.id} className="flex items-center gap-2 rounded-md border border-border bg-white dark:bg-[#1f1f1f] px-3 py-2">
                    {editingId === cat.id ? (
                      <>
                        <input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1 rounded border border-border bg-background text-foreground px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          autoFocus
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSaveRename(); } if (e.key === "Escape") { setEditingId(null); } }}
                        />
                        <button onClick={handleSaveRename} className="rounded bg-[#1f4865] text-white px-2 py-1 text-xs cursor-pointer hover:bg-[#1f4865]/90 transition-colors">{t("common.save")}</button>
                        <button onClick={() => setEditingId(null)} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">{t("common.cancel")}</button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-sm text-foreground capitalize truncate">{cat.name.replace(/_/g, " ")}</span>
                        <button onClick={() => handleStartRename(cat)} className="p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title={t("common.edit")}>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(cat)} className="p-1 text-muted-foreground hover:text-red-600 transition-colors cursor-pointer" title={t("common.delete")}>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add new category */}
          <div className="pt-2 border-t border-border">
            <label className="block text-xs lg:text-sm font-medium text-foreground mb-2">{t("checklists.categories_add_new")}</label>
            <div className="flex gap-2">
              <input
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder={t("checklists.new_category_placeholder")}
                className="flex-1 rounded-md border border-border bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); } }}
              />
              <button onClick={handleAdd} className="rounded-md bg-[#1f4865] text-white px-3 py-2 text-sm cursor-pointer hover:bg-[#1f4865]/90 transition-colors whitespace-nowrap">{t("common.add")}</button>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button onClick={onClose} className="rounded-md border border-border bg-white dark:bg-[#1f1f1f] text-foreground px-4 py-2 text-sm cursor-pointer hover:bg-muted transition-colors">{t("common.close")}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategoriesModal;
