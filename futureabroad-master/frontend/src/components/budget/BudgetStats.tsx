import type React from "react";

const BudgetStats: React.FC<any> = ({ stats, formatAmount, t }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
    <div className="bg-white dark:bg-slate-900 rounded-lg p-3 sm:p-4 border border-slate-200 dark:border-slate-700">
      <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{t("budgets.total_budget")}</div>
      <div className="text-xl sm:text-2xl font-bold mt-2 dark:text-white">{formatAmount(stats.totalBudget, "USD")}</div>
    </div>
    <div className="bg-white dark:bg-slate-900 rounded-lg p-3 sm:p-4 border border-slate-200 dark:border-slate-700">
      <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{t("budgets.paid")}</div>
      <div className="text-xl sm:text-2xl font-bold mt-2 dark:text-white">{formatAmount(stats.paid, "USD")}</div>
    </div>
    <div className="bg-white dark:bg-slate-900 rounded-lg p-3 sm:p-4 border border-slate-200 dark:border-slate-700">
      <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{t("budgets.remaining")}</div>
      <div className="text-xl sm:text-2xl font-bold mt-2 dark:text-white">{formatAmount(stats.remaining, "USD")}</div>
    </div>
  </div>
);

export default BudgetStats;
