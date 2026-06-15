import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth-context";
import type { Checklist, ChecklistItem, ChecklistCategory, ChecklistTag } from "@/lib/types";
import { useTranslation } from "react-i18next";
import ChecklistHeader from "@/components/checklist/ChecklistHeader";
import ChecklistStats from "@/components/checklist/ChecklistStats";
import ChecklistItemRow from "@/components/checklist/ChecklistItemRow";
import AddChecklistModal from "@/components/checklist/AddChecklistModal";
import EditChecklistModal from "@/components/checklist/EditChecklistModal";
import EditCategoriesModal from "@/components/checklist/EditCategoriesModal";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const PRESET_CATEGORIES = ["general", "documents", "housing", "packing", "other"];

export function CheckListProfile() {
  const { t } = useTranslation();
  const tCat = (c: string | null) => c ? t(`checklists.cat_${c}`, { defaultValue: c.replace(/_/g, " ") }) : "";
  const { checklistId } = useParams<{ checklistId: string }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [items, setItems] = useState<ChecklistItem[]>([]);

  // Categories
  const [customCategories, setCustomCategories] = useState<ChecklistCategory[]>([]);

  // Tags
  const [tags, setTags] = useState<ChecklistTag[]>([]);
  const [itemTagsMap, setItemTagsMap] = useState<Record<string, string[]>>({});

  const [editingName, setEditingName] = useState("");
  const [notes, setNotes] = useState<string>("");

  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<string>("general");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditCategories, setShowEditCategories] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("general");
  const [editSelectedTags, setEditSelectedTags] = useState<string[]>([]);

  // ---- helpers ----
  const allCategories = useCallback(() => {
    const preset = [...PRESET_CATEGORIES];
    const custom = customCategories.map((c) => c.name);
    // deduplicate
    const seen = new Set(preset);
    for (const c of custom) {
      if (!seen.has(c)) {
        preset.push(c);
        seen.add(c);
      }
    }
    return preset;
  }, [customCategories]);

  // ---- load data ----
  useEffect(() => {
    if (!checklist || !editingName.trim()) return;
    const timer = setTimeout(async () => {
      await handleSaveChecklist();
    }, 800);
    return () => clearTimeout(timer);
  }, [editingName, notes]);

  useEffect(() => {
    if (!checklistId || !user) return;
    const load = async () => {
      try {
        const { data: c } = await supabase.from("checklists").select("*").eq("id", checklistId).single();
        setChecklist(c || null);
        setEditingName(c?.name || "");
        setNotes(c?.notes || "");

        const { data: its } = await supabase.from("checklist_items").select("*").eq("checklist_id", checklistId).order("sort_order", { ascending: true });
        setItems(its || []);

        // Load custom categories
        const { data: cats } = await supabase.from("checklist_categories").select("*").eq("user_id", user.id).order("name");
        setCustomCategories(cats || []);

        // Load tags
        const { data: tgs } = await supabase.from("checklist_tags").select("*").eq("user_id", user.id).order("name");
        setTags(tgs || []);

        // Load item-tag mappings for this checklist
        if (its && its.length > 0) {
          const itemIds = its.map((i) => i.id);
          const { data: mappings } = await supabase
            .from("checklist_item_tags")
            .select("*")
            .in("checklist_item_id", itemIds);
          if (mappings) {
            const map: Record<string, string[]> = {};
            for (const m of mappings) {
              if (!map[m.checklist_item_id]) map[m.checklist_item_id] = [];
              map[m.checklist_item_id].push(m.tag_id);
            }
            setItemTagsMap(map);
          }
        }
      } catch (err) {
        console.error("Error loading checklist:", err);
      }
    };
    load();
  }, [checklistId, user]);

  // ---- derived ----
  const stats = {
    total: items.length,
    completed: items.filter((i) => i.status).length,
    remaining: items.filter((i) => !i.status).length,
  };

  const visibleItems = items.filter((i) => {
    if (filterCategory !== "all" && i.category !== filterCategory) return false;
    if (filterTags.length > 0) {
      const itemTagIds = itemTagsMap[i.id] || [];
      if (!filterTags.some((ft) => itemTagIds.includes(ft))) return false;
    }
    return true;
  });

  // ---- actions ----
  async function handleSaveChecklist() {
    if (!checklist) return;
    setSaving(true);
    try {
      const payload: any = { name: editingName.trim(), notes };
      const { data, error } = await supabase.from("checklists").update(payload).eq("id", checklist.id).select("*").single();
      if (error) throw error;
      setChecklist(data);
    } catch (err) {
      console.error("Error saving checklist:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteChecklist() {
    if (!checklist) return;
    if (!confirm(t("checklists.delete_confirm"))) return;
    try {
      const { error } = await supabase.from("checklists").delete().eq("id", checklist.id);
      if (error) throw error;
      navigate("/checklists");
    } catch (err) {
      console.error("Error deleting checklist:", err);
    }
  }

  async function ensureTag(name: string): Promise<string | null> {
    if (!user) return null;
    const trimmed = name.trim().toLowerCase().replace(/\s+/g, "_");
    if (!trimmed) return null;
    // Check if tag already exists locally
    const existing = tags.find((t) => t.name === trimmed);
    if (existing) return existing.id;
    // Insert
    const { data, error } = await supabase
      .from("checklist_tags")
      .insert({ user_id: user.id, name: trimmed })
      .select("*")
      .single();
    if (error) { console.error("Error creating tag:", error); return null; }
    setTags((prev) => [...prev, data]);
    return data.id;
  }

  async function ensureCategory(name: string): Promise<string> {
    const trimmed = name.trim().toLowerCase().replace(/\s+/g, "_");
    if (!trimmed) return "general";
    // Check if it's a preset
    if (PRESET_CATEGORIES.includes(trimmed)) return trimmed;
    // Check if already a custom category
    const existing = customCategories.find((c) => c.name === trimmed);
    if (existing) return existing.name;
    // Insert
    if (!user) return trimmed;
    const { data, error } = await supabase
      .from("checklist_categories")
      .insert({ user_id: user.id, name: trimmed })
      .select("*")
      .single();
    if (error) { console.error("Error creating category:", error); return trimmed; }
    setCustomCategories((prev) => [...prev, data]);
    return data.name;
  }

  async function setItemTags(itemId: string, tagIds: string[]) {
    // Remove existing mappings
    await supabase.from("checklist_item_tags").delete().eq("checklist_item_id", itemId);
    if (tagIds.length === 0) return;
    // Insert new
    const rows = tagIds.map((tag_id) => ({ checklist_item_id: itemId, tag_id }));
    const { error } = await supabase.from("checklist_item_tags").insert(rows);
    if (error) console.error("Error setting item tags:", error);
    setItemTagsMap((prev) => ({ ...prev, [itemId]: tagIds }));
  }

  async function handleAddCategory(name: string) {
    if (!user) return;
    const trimmed = name.trim().toLowerCase().replace(/\s+/g, "_");
    if (!trimmed || PRESET_CATEGORIES.includes(trimmed)) return;
    // Check duplicate
    if (customCategories.find((c) => c.name === trimmed)) return;
    const { data, error } = await supabase
      .from("checklist_categories")
      .insert({ user_id: user.id, name: trimmed })
      .select("*")
      .single();
    if (error) { console.error("Error adding category:", error); return; }
    setCustomCategories((prev) => [...prev, data]);
  }

  async function handleRenameCategory(id: string, newName: string) {
    const trimmed = newName.trim().toLowerCase().replace(/\s+/g, "_");
    if (!trimmed || PRESET_CATEGORIES.includes(trimmed)) return;
    const { error } = await supabase
      .from("checklist_categories")
      .update({ name: trimmed })
      .eq("id", id);
    if (error) { console.error("Error renaming category:", error); return; }
    setCustomCategories((prev) => prev.map((c) => c.id === id ? { ...c, name: trimmed } : c));
  }

  async function handleDeleteCategory(id: string) {
    // Reassign items in this category to "general"
    const cat = customCategories.find((c) => c.id === id);
    if (cat) {
      await supabase
        .from("checklist_items")
        .update({ category: "general" })
        .eq("checklist_id", checklistId)
        .eq("category", cat.name);
      setItems((prev) => prev.map((i) => i.category === cat.name ? { ...i, category: "general" } : i));
    }
    const { error } = await supabase.from("checklist_categories").delete().eq("id", id);
    if (error) { console.error("Error deleting category:", error); return; }
    setCustomCategories((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleAddItem(e?: React.FormEvent) {
    e?.preventDefault();
    if (!checklist || !newName.trim()) return;
    try {
      const category = await ensureCategory(newCategory);
      const payload = {
        checklist_id: checklist.id,
        name: newName.trim(),
        category,
        status: false,
        sort_order: items.length, // place at the bottom by default
      };
      const { data, error } = await supabase.from("checklist_items").insert(payload).select("*").single();
      if (error) throw error;

      // Save tags
      if (selectedTags.length > 0) {
        await setItemTags(data.id, selectedTags);
      }

      setItems((s) => [...s, data]);
      setNewName("");
      setNewCategory("general");
      setSelectedTags([]);
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  }

  async function handleToggleItem(item: ChecklistItem) {
    try {
      const { data, error } = await supabase.from("checklist_items").update({ status: !item.status }).eq("id", item.id).select("*").single();
      if (error) throw error;
      setItems((s) => s.map((it) => (it.id === item.id ? data : it)));
    } catch (err) {
      console.error("Error toggling item:", err);
    }
  }

  async function handleDeleteItem(id: string) {
    if (!confirm(t("checklists.delete_item_confirm"))) return;
    try {
      const { error } = await supabase.from("checklist_items").delete().eq("id", id);
      if (error) throw error;
      setItems((s) => s.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  }

  async function handleUpdateItem(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem || !editName.trim()) return;
    try {
      const category = await ensureCategory(editCategory);
      const { data, error } = await supabase.from("checklist_items")
        .update({ name: editName.trim(), category })
        .eq("id", editingItem.id)
        .select("*")
        .single();
      if (error) throw error;

      // Update tags
      if (editSelectedTags) {
        await setItemTags(data.id, editSelectedTags);
      }

      setItems((s) => s.map((it) => (it.id === editingItem.id ? data : it)));
      setEditingItem(null);
    } catch (err) {
      console.error("Error updating item:", err);
    }
  }

  // ---- tag filter helpers ----
  function toggleFilterTag(tagId: string) {
    setFilterTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  }

  // ---- drag & drop ----
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = visibleItems.findIndex((i) => i.id === active.id);
    const newIndex = visibleItems.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    // Reorder the visible items
    const reordered = [...visibleItems];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    // Merge back into full items list preserving hidden items
    const visibleIds = new Set(visibleItems.map((i) => i.id));
    const hidden = items.filter((i) => !visibleIds.has(i.id));
    const newItems = [...hidden, ...reordered];

    // Assign new sort_order values
    const updated = newItems.map((item, idx) => ({ ...item, sort_order: idx }));
    setItems(updated);

    // Batch update sort_order in DB
    const updates = updated.map((item) => ({
      id: item.id,
      sort_order: item.sort_order,
    }));
    // Use a simple upsert-like approach via individual updates
    for (const u of updates) {
      await supabase.from("checklist_items").update({ sort_order: u.sort_order }).eq("id", u.id);
    }
  }

  if (loading) return <div className="text-center py-20 text-muted-foreground">{t("checklists.detail_loading")}</div>;
  if (!checklist) return <div className="text-center py-20 text-muted-foreground">{t("checklists.detail_not_found")}</div>;

  return (
    <div className="min-h-screen px-3 lg:px-4 py-6 lg:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 lg:mb-6">
          <Link to="/checklists" className="inline-flex items-center gap-2 text-xs lg:text-sm text-muted-foreground hover:text-foreground cursor-pointer font-medium">{t("checklists.detail_back")}</Link>
        </div>

        <ChecklistHeader editingName={editingName} setEditingName={setEditingName} saving={saving} onAddClick={() => setShowAddModal(true)} handleDeleteChecklist={handleDeleteChecklist} notes={notes} setNotes={setNotes} t={t} />

        <ChecklistStats stats={stats} t={t} />

        {/* ---- Category filter ---- */}
        <div className="mb-3 flex flex-wrap items-center gap-1.5 lg:gap-2">
          <button onClick={() => setFilterCategory("all")} className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-full whitespace-nowrap text-xs lg:text-sm font-medium capitalize transition-colors cursor-pointer ${filterCategory === "all" ? "bg-foreground text-background" : "bg-white dark:bg-[#1f1f1f] border border-border text-foreground hover:bg-slate-50 dark:hover:bg-[#252525]"}`}>{t("common.all")}</button>
          {allCategories().map((c) => (
            <button key={c} onClick={() => setFilterCategory(c)} className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-full whitespace-nowrap text-xs lg:text-sm font-medium capitalize transition-colors cursor-pointer ${filterCategory === c ? "bg-foreground text-background" : "bg-white dark:bg-[#1f1f1f] border border-border text-foreground hover:bg-slate-50 dark:hover:bg-[#252525]"}`}>
              {tCat(c)}
            </button>
          ))}
          <button
            onClick={() => setShowEditCategories(true)}
            className="px-2.5 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-medium transition-colors cursor-pointer bg-white dark:bg-[#1f1f1f] text-foreground border border-dashed border-border hover:bg-slate-50 dark:hover:bg-[#252525]"
          >
            <svg className="w-3.5 h-3.5 inline-block mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {t("checklists.edit_categories")}
          </button>
        </div>

        {/* ---- Tag filter ---- */}
        {tags.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-1.5 lg:gap-2">
            <span className="text-xs font-medium text-muted-foreground mr-1">{t("checklists.filter_by_tag")}:</span>
            {tags.map((tag) => {
              const active = filterTags.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleFilterTag(tag.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    active
                      ? "bg-[#1f4865] text-white"
                      : "bg-white dark:bg-[#1f1f1f] text-muted-foreground border border-border hover:bg-slate-50 dark:hover:bg-[#252525]"
                  }`}
                >
                  {tag.name.replace(/_/g, " ")}
                </button>
              );
            })}
            {filterTags.length > 0 && (
              <button
                onClick={() => setFilterTags([])}
                className="px-2.5 py-1 rounded-full text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors cursor-pointer"
              >
                {t("common.clear")}
              </button>
            )}
          </div>
        )}

        <AddChecklistModal
          show={showAddModal}
          newName={newName}
          setNewName={setNewName}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          categories={allCategories()}
          tags={tags}
          setTags={setTags}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          ensureTag={ensureTag}
          ensureCategory={ensureCategory}
          handleAddItem={handleAddItem}
          setShowAddModal={setShowAddModal}
          t={t}
          tCat={tCat}
        />

        <EditChecklistModal
          show={!!editingItem}
          editingItem={editingItem}
          editName={editName}
          setEditName={setEditName}
          editCategory={editCategory}
          setEditCategory={setEditCategory}
          categories={allCategories()}
          tags={tags}
          setTags={setTags}
          editSelectedTags={editSelectedTags}
          setEditSelectedTags={setEditSelectedTags}
          ensureTag={ensureTag}
          ensureCategory={ensureCategory}
          handleUpdateItem={handleUpdateItem}
          setEditingItem={setEditingItem}
          t={t}
          tCat={tCat}
        />

        <EditCategoriesModal
          show={showEditCategories}
          customCategories={customCategories}
          presetCategories={PRESET_CATEGORIES}
          onAddCategory={handleAddCategory}
          onRenameCategory={handleRenameCategory}
          onDeleteCategory={handleDeleteCategory}
          onClose={() => setShowEditCategories(false)}
          t={t}
          tCat={tCat}
        />

        <div className="bg-white dark:bg-[#1f1f1f] rounded-lg border border-border overflow-hidden">
          {visibleItems.length === 0 ? (
            <div className="p-6 lg:p-8 text-center text-xs lg:text-sm text-muted-foreground">{t("checklists.no_tasks")}</div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={visibleItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                <div className="divide-y divide-border">
                  {visibleItems.map((item) => (
                    <ChecklistItemRow
                      key={item.id}
                      item={item}
                      tags={tags}
                      itemTagIds={itemTagsMap[item.id] || []}
                      onToggle={() => handleToggleItem(item)}
                      onEdit={() => {
                        setEditingItem(item);
                        setEditName(item.name);
                        setEditCategory(item.category);
                        setEditSelectedTags(itemTagsMap[item.id] || []);
                      }}
                      onDelete={() => handleDeleteItem(item.id)}
                      tCat={tCat}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
}