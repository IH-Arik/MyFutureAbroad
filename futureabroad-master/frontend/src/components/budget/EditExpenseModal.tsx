import type React from "react";

const EditExpenseModal: React.FC<any> = ({ show, editingItem, editingItemName, setEditingItemName, editingItemCost, setEditingItemCost, editingItemCategory, setEditingItemCategory, categories, handleUpdateItem, handleDeleteItem, setShowEditExpenseModal, t, tCat }) => {
  if (!show || !editingItem) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-border/50 bg-white shadow-xl dark:bg-[#1a1a1a] overflow-hidden">
        <div className="sticky top-0 flex items-center justify-between border-b border-border/40 bg-white px-4 sm:px-6 py-3 sm:py-4 dark:bg-[#1a1a1a] rounded-t-2xl">
          <h2 className="text-base sm:text-lg font-semibold">{t("budgets.edit_expense")}</h2>
          <button onClick={() => setShowEditExpenseModal(false)} className="rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 p-4 sm:p-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1">{t("budgets.expense_name")}</label>
            <input value={editingItemName} onChange={(e) => setEditingItemName(e.target.value)} className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-600" />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1">{t("budgets.cost")}</label>
            <input value={editingItemCost} onChange={(e) => setEditingItemCost(e.target.value)} type="number" className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-600" />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1">{t("budgets.category")}</label>
            <select value={editingItemCategory} onChange={(e) => setEditingItemCategory(e.target.value)} className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-600">
              {categories.map((c: any) => (<option key={c} value={c}>{tCat(c)}</option>))}
            </select>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <button onClick={() => {
              handleDeleteItem(editingItem.id);
              setShowEditExpenseModal(false);
            }} className="w-full sm:w-auto rounded-md bg-red-600 text-white px-3 sm:px-4 py-2 text-sm cursor-pointer hover:bg-red-700 transition-colors">{t("common.delete")}</button>
            <div className="flex flex-col-reverse sm:flex-row items-center gap-2 w-full sm:w-auto">
              <button type="button" onClick={() => setShowEditExpenseModal(false)} className="w-full sm:w-auto rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 sm:px-4 py-2 text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">{t("common.cancel")}</button>
              <button type="button" onClick={async () => {
                await handleUpdateItem(editingItem.id, { name: editingItemName.trim(), cost: Number(editingItemCost), category: editingItemCategory });
                setShowEditExpenseModal(false);
              }} className="w-full sm:w-auto rounded-md bg-[#1f4865] text-white px-3 sm:px-4 py-2 text-sm cursor-pointer hover:bg-[#173a52] transition-colors">{t("common.save")}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditExpenseModal;
