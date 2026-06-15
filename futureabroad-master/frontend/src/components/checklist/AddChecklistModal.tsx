import type React from "react";
import { useState } from "react";

const AddChecklistModal: React.FC<any> = ({
  show, newName, setNewName, newCategory, setNewCategory, categories,
  tags, setTags: _setTags, selectedTags, setSelectedTags,
  ensureTag, ensureCategory: _ensureCategory,
  handleAddItem, setShowAddModal, t, tCat
}) => {
  const [newTagInput, setNewTagInput] = useState("");
  const [showNewTagInput, setShowNewTagInput] = useState(false);

  if (!show) return null;

  const handleAddTag = async () => {
    const name = newTagInput.trim();
    if (!name) return;
    const id = await ensureTag(name);
    if (id) {
      setSelectedTags((prev: string[]) => [...prev, id]);
    }
    setNewTagInput("");
    setShowNewTagInput(false);
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev: string[]) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const categoryOptions = categories.map((c: string) => ({ value: c, label: tCat(c) }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-border/50 bg-white dark:bg-[#1f1f1f] shadow-xl overflow-hidden">
        <div className="sticky top-0 flex items-center justify-between border-b border-border/40 bg-white dark:bg-[#1f1f1f] px-4 lg:px-6 py-3 lg:py-4 rounded-t-2xl">
          <h2 className="text-base lg:text-lg font-semibold text-foreground">{t("checklists.add_task_title")}</h2>
          <button onClick={() => setShowAddModal(false)} className="rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleAddItem} className="space-y-4 p-4 lg:p-6">
          <div>
            <label className="block text-xs lg:text-sm font-medium text-foreground mb-1">{t("checklists.task_name")}</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t("checklists.task_placeholder")}
              required
              className="w-full rounded-md border border-border bg-background dark:bg-[#1f1f1f] text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs lg:text-sm font-medium text-foreground mb-1">{t("checklists.category")}</label>
            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full rounded-md border border-border bg-background dark:bg-[#1f1f1f] text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring capitalize">
              {categoryOptions.map((opt: any) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs lg:text-sm font-medium text-foreground mb-1">{t("checklists.tags")}</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag: any) => {
                const active = selectedTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      active
                        ? "bg-[#1f4865] text-white"
                        : "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
                    }`}
                  >
                    {tag.name.replace(/_/g, " ")}
                  </button>
                );
              })}
            </div>
            {showNewTagInput ? (
              <div className="flex gap-2">
                <input
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder={t("checklists.new_tag_placeholder")}
                  className="flex-1 rounded-md border border-border bg-background dark:bg-[#1f1f1f] text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTag(); } }}
                />
                <button type="button" onClick={handleAddTag} className="rounded-md bg-[#1f4865] text-white px-3 py-2 text-sm cursor-pointer hover:bg-[#1f4865]/90 transition-colors whitespace-nowrap">{t("common.add")}</button>
              </div>
            ) : (
              <button type="button" onClick={() => setShowNewTagInput(true)} className="text-xs text-[#1f4865] dark:text-[#8ab4d0] hover:underline cursor-pointer">
                + {t("checklists.add_new_tag")}
              </button>
            )}
          </div>

          <div className="flex flex-col-reverse lg:flex-row items-center justify-end gap-2 pt-2 border-t border-border">
            <button type="button" onClick={() => setShowAddModal(false)} className="w-full lg:w-auto rounded-md border border-border bg-white dark:bg-[#1f1f1f] text-foreground px-3 lg:px-4 py-2 text-sm cursor-pointer hover:bg-muted transition-colors">{t("common.cancel")}</button>
            <button type="submit" className="w-full lg:w-auto rounded-md bg-[#1f4865] text-white px-3 lg:px-4 py-2 text-sm cursor-pointer hover:bg-[#1f4865]/90 transition-colors whitespace-nowrap">{t("checklists.add_task")}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChecklistModal;
