import type React from "react";

const BudgetHeader: React.FC<any> = ({ editingName, setEditingName, saving, handleDeleteBudget, notes, setNotes, t }) => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 sm:gap-4">
        <input value={editingName} onChange={(e) => setEditingName(e.target.value)} className="text-xl sm:text-2xl lg:text-3xl font-bold border-b-2 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white pb-1 focus:outline-none flex-1 min-w-0" />
        {saving && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 shrink-0">
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        <button onClick={handleDeleteBudget} className="rounded-md px-2 sm:px-3 py-1 text-xs sm:text-sm bg-red-600 text-white cursor-pointer hover:bg-red-700 transition-colors shrink-0">{t("common.delete")}</button>
      </div>
      <div className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t("common.notes")}</div>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("budgets.notes_placeholder")} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-400 dark:focus:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-100 dark:focus:ring-slate-800 transition-all" rows={3} />
    </div>
  );
};

export default BudgetHeader;
