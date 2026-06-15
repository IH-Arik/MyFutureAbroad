import type React from "react";

const ExpenseRow: React.FC<any> = ({ item, onToggle, onEdit, formatAmount, tCat, t }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border border-slate-200 dark:border-slate-700 p-3 sm:p-4 bg-white dark:bg-slate-900 hover:shadow-sm dark:hover:shadow-lg transition-shadow gap-2 sm:gap-0">
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <input type="checkbox" checked={item.status} onChange={onToggle} className="cursor-pointer w-4 h-4 shrink-0" />
        <div className="min-w-0">
          <div className={`font-medium text-sm sm:text-base truncate ${item.status ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>{item.name}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{tCat(item.category)} • {item.currency || "USD"}</div>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
        <div className="text-xs sm:text-sm font-semibold text-right min-w-max dark:text-white">{formatAmount(Number(item.cost), item.currency || "USD")}</div>
        <button onClick={onEdit} className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 whitespace-nowrap">{t("common.edit")}</button>
      </div>
    </div>
  );
};

export default ExpenseRow;
