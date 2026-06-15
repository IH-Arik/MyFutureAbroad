import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onClose: () => void;
  categories: any[];
  onRefresh: () => void;
}

export default function CategoryManagerModal({ open, onClose, categories, onRefresh }: Props) {
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleAdd = async () => {
    const name = newName.trim();
    if (!name) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("document_categories").insert({ name, description: newDesc.trim() || null });
      if (error) throw error;
      setNewName("");
      setNewDesc("");
      setShowAddForm(false);
      onRefresh();
    } catch (err: any) {
      alert(err?.message || "Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  const handleRename = async (id: string) => {
    const name = renameValue.trim();
    if (!name) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("document_categories").update({ name }).eq("id", id);
      if (error) throw error;
      setRenamingId(null);
      setRenameValue("");
      onRefresh();
    } catch (err: any) {
      alert(err?.message || "Failed to rename category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("documents.delete_category_confirm") || "Delete this category? Documents in it won't be deleted.")) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("document_categories").delete().eq("id", id);
      if (error) throw error;
      onRefresh();
    } catch (err: any) {
      alert(err?.message || "Failed to delete category");
    } finally {
      setSaving(false);
    }
  };

  const startRename = (cat: any) => {
    setRenamingId(cat.id);
    setRenameValue(cat.name);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#1f1f1f] rounded-lg max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-border/50 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">{t("documents.manage_categories") || "Manage Categories"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {categories.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">{t("documents.no_categories") || "No categories yet"}</p>
          )}

          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 dark:border-white/10">
              {renamingId === cat.id ? (
                <>
                  <input
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    className="flex-1 border border-border rounded-md px-2 py-1 text-sm bg-background dark:bg-[#1f1f1f] dark:border-white/10"
                    autoFocus
                    onKeyDown={(e) => { if (e.key === "Enter") handleRename(cat.id); if (e.key === "Escape") setRenamingId(null); }}
                  />
                  <Button size="sm" onClick={() => handleRename(cat.id)} disabled={saving || !renameValue.trim()} className="h-7 text-xs cursor-pointer">
                    {t("common.save")}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setRenamingId(null)} className="h-7 text-xs cursor-pointer">
                    {t("common.cancel")}
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{cat.name}</p>
                    {cat.description && <p className="text-xs text-muted-foreground truncate">{cat.description}</p>}
                  </div>
                  <button
                    onClick={() => startRename(cat)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0 cursor-pointer"
                    title={t("common.edit")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors shrink-0 cursor-pointer"
                    title={t("common.delete")}
                    disabled={saving}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-border/50 px-6 py-4 space-y-3">
          {showAddForm ? (
            <div className="space-y-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={t("documents.category_name_placeholder") || "Category name"}
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background dark:bg-[#1f1f1f] dark:border-white/10"
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setShowAddForm(false); }}
              />
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder={t("documents.category_desc_placeholder") || "Description (optional)"}
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background dark:bg-[#1f1f1f] dark:border-white/10"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)} className="cursor-pointer">{t("common.cancel")}</Button>
                <Button size="sm" onClick={handleAdd} disabled={saving || !newName.trim()} className="cursor-pointer">
                  {saving ? t("common.creating") : t("common.save")}
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setShowAddForm(true)} className="w-full cursor-pointer">
              + {t("documents.add_category") || "Add Category"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
