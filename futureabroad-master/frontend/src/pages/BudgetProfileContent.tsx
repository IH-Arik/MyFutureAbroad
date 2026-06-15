import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth-context";
import { useCurrency, CURRENCY_SYMBOLS } from "@/components/currency/CurrencyProvider";
import type { Budget, BudgetItem } from "@/lib/types";
import { useTranslation } from "react-i18next";
import BudgetHeader from "@/components/budget/BudgetHeader";
import BudgetStats from "@/components/budget/BudgetStats";
import ExpenseRow from "@/components/budget/ExpenseRow";
import AddExpenseModal from "@/components/budget/AddExpenseModal";
import EditExpenseModal from "@/components/budget/EditExpenseModal";

export default function BudgetProfileContent() {
  const { t } = useTranslation();
  const { budgetId } = useParams<{ budgetId: string }>();
  const { user, loading } = useAuth();
  const { formatAmount } = useCurrency();
  const navigate = useNavigate();

  const [budget, setBudget] = useState<Budget | null>(null);
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [editingName, setEditingName] = useState("");
  const [notes, setNotes] = useState<string>("");

  const [newName, setNewName] = useState("");
  const [newCost, setNewCost] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("other");
  const [newCurrency, setNewCurrency] = useState<string>("USD");
  const [newStatus, setNewStatus] = useState(false);

  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [saving, setSaving] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [editingItemName, setEditingItemName] = useState("");
  const [editingItemCost, setEditingItemCost] = useState("");
  const [editingItemCategory, setEditingItemCategory] = useState("");

  useEffect(() => {
    if (!budget || !editingName.trim()) return;
    const timer = setTimeout(async () => {
      await handleSaveBudget();
    }, 800);
    return () => clearTimeout(timer);
  }, [editingName, notes]);

  useEffect(() => {
    if (!budgetId || !user) return;
    const load = async () => {
      try {
        const { data: b } = await supabase.from("budgets").select("*").eq("id", budgetId).single();
        setBudget(b || null);
        setEditingName(b?.name || "");
        setNotes(b?.notes || "");

        const { data: its } = await supabase.from("budget_items").select("*").eq("budget_id", budgetId).order("created_at", { ascending: false });
        setItems(its || []);

        const { data: sTypes } = await supabase.from("service_types").select("id");
        const cats = (sTypes || []).map((s: any) => s.id);
        setCategories(["other", ...cats]);
      } catch (err) {
        console.error("Error loading budget:", err);
      }
    };
    load();
  }, [budgetId, user]);

  const convertToUSD = (amount: number, itemCurrency: string): number => {
    if (itemCurrency === "USD") return amount;
    return amount;
  };

  const stats = useMemo(() => {
    const paid = items.filter((i) => i.status).reduce((s, i) => s + convertToUSD(Number(i.cost || 0), i.currency || "USD"), 0);
    const remaining = items.filter((i) => !i.status).reduce((s, i) => s + convertToUSD(Number(i.cost || 0), i.currency || "USD"), 0);
    const totalBudget = items.reduce((s, i) => s + convertToUSD(Number(i.cost || 0), i.currency || "USD"), 0);
    return { paid, remaining, totalBudget };
  }, [items]);

  async function handleSaveBudget() {
    if (!budget) return;
    setSaving(true);
    try {
      const payload: any = { name: editingName.trim(), notes };
      const { data, error } = await supabase.from("budgets").update(payload).eq("id", budget.id).select("*").single();
      if (error) throw error;
      setBudget(data);
    } catch (err) {
      console.error("Error saving budget:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteBudget() {
    if (!budget) return;
    if (!confirm(t("budgets.delete_confirm"))) return;
    try {
      const { error } = await supabase.from("budgets").delete().eq("id", budget.id);
      if (error) throw error;
      navigate("/budgets");
    } catch (err) {
      console.error("Error deleting budget:", err);
    }
  }

  async function handleAddExpense(e?: FormEvent) {
    e?.preventDefault?.();
    if (!budget || !newName.trim() || newCost.trim() === "") return;
    try {
      const payload = {
        budget_id: budget.id,
        name: newName.trim(),
        cost: Number(newCost),
        category: newCategory,
        currency: newCurrency,
        status: newStatus,
      };
      const { data, error } = await supabase.from("budget_items").insert(payload).select("*").single();
      if (error) throw error;
      setItems((s) => [data, ...s]);
      setNewName("");
      setNewCost("");
      setNewCategory("other");
      setNewCurrency("USD");
      setNewStatus(false);
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  }

  async function handleToggleItem(item: BudgetItem) {
    try {
      const { data, error } = await supabase.from("budget_items").update({ status: !item.status }).eq("id", item.id).select("*").single();
      if (error) throw error;
      setItems((s) => s.map((it) => (it.id === item.id ? data : it)));
    } catch (err) {
      console.error("Error toggling item:", err);
    }
  }

  async function handleDeleteItem(id: string) {
    if (!confirm(t("budgets.delete_item_confirm"))) return;
    try {
      const { error } = await supabase.from("budget_items").delete().eq("id", id);
      if (error) throw error;
      setItems((s) => s.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  }

  async function handleUpdateItem(id: string, fields: Partial<BudgetItem>) {
    try {
      const { data, error } = await supabase.from("budget_items").update(fields).eq("id", id).select("*").single();
      if (error) throw error;
      setItems((s) => s.map((it) => (it.id === id ? data : it)));
    } catch (err) {
      console.error("Error updating item:", err);
    }
  }

  const tCat = (c: string) => t(`budgets.cat_${c}`, { defaultValue: c.replace(/_/g, " ") });

  const visibleItems = items.filter((i) => filterCategory === "all" || i.category === filterCategory);

  if (loading) return <div className="text-center py-20 text-slate-500 dark:text-slate-400">{t("budgets.detail_loading")}</div>;
  if (!budget) return <div className="text-center py-20 text-slate-500 dark:text-slate-400">{t("budgets.detail_not_found")}</div>;

  return (
    <div className="min-h-screen px-3 sm:px-4 py-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 sm:mb-6">
          <Link to="/budgets" className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer font-medium">{t("budgets.detail_back")}</Link>
        </div>

        <BudgetHeader editingName={editingName} setEditingName={setEditingName} saving={saving} handleDeleteBudget={handleDeleteBudget} notes={notes} setNotes={setNotes} t={t} />

        <BudgetStats stats={stats} formatAmount={formatAmount} t={t} />

        <div className="mb-6 flex justify-end">
          <button onClick={() => setShowAddExpenseModal(true)} className="rounded-md bg-[#9b8b6f] text-white px-3 sm:px-4 py-2 cursor-pointer flex items-center gap-2 text-sm sm:text-base hover:bg-[#8a7a60] transition-colors">
            {t("budgets.add_expense")}
          </button>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button onClick={() => setFilterCategory("all")} className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap text-xs sm:text-sm cursor-pointer transition-colors ${filterCategory === "all" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white"}`}>{t("common.all")}</button>
          {categories.map((c) => (
            <button key={c} onClick={() => setFilterCategory(c)} className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap text-xs sm:text-sm cursor-pointer transition-colors ${filterCategory === c ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white"}`}>{tCat(c)}</button>
          ))}
        </div>

        <div className="space-y-2 sm:space-y-3">
          {visibleItems.map((it) => (
            <ExpenseRow
              key={it.id}
              item={it}
              onToggle={() => handleToggleItem(it)}
              onEdit={() => {
                setEditingItem(it);
                setEditingItemName(it.name);
                setEditingItemCost(String(it.cost));
                setEditingItemCategory(it.category);
                setShowEditExpenseModal(true);
              }}
              formatAmount={formatAmount}
              tCat={tCat}
              t={t}
            />
          ))}
        </div>

        <AddExpenseModal
          show={showAddExpenseModal}
          newName={newName}
          setNewName={setNewName}
          newCost={newCost}
          setNewCost={setNewCost}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          newCurrency={newCurrency}
          setNewCurrency={setNewCurrency}
          newStatus={newStatus}
          setNewStatus={setNewStatus}
          categories={categories}
          CURRENCY_SYMBOLS={CURRENCY_SYMBOLS}
          handleAddExpense={handleAddExpense}
          setShowAddExpenseModal={setShowAddExpenseModal}
          t={t}
          tCat={tCat}
        />

        <EditExpenseModal
          show={showEditExpenseModal}
          editingItem={editingItem}
          editingItemName={editingItemName}
          setEditingItemName={setEditingItemName}
          editingItemCost={editingItemCost}
          setEditingItemCost={setEditingItemCost}
          editingItemCategory={editingItemCategory}
          setEditingItemCategory={setEditingItemCategory}
          categories={categories}
          handleUpdateItem={handleUpdateItem}
          handleDeleteItem={handleDeleteItem}
          setShowEditExpenseModal={setShowEditExpenseModal}
          t={t}
          tCat={tCat}
        />

      </div>
    </div>
  );
}
