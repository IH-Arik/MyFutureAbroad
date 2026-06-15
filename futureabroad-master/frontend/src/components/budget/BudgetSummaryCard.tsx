export interface BudgetSummaryData {
  id: string;
  name: string;
  total_spent: number;
  total_budget: number;
  currency: string;
}

export default function BudgetSummaryCard({ b }: { b: BudgetSummaryData }) {
  return (
    <a
      href={`/budgets/${b.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose flex items-center justify-between gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#252525] px-3 sm:px-5 py-3 sm:py-4 my-2 sm:my-3 hover:border-[#1f4865] dark:hover:border-[#5b9abf] hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="flex h-8 sm:h-9 w-8 sm:w-9 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-[#1f4865]/10 dark:bg-[#1f4865]/20 text-[#1f4865] dark:text-[#5b9abf]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">Budget created</p>
          <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">{b.name}</p>
        </div>
      </div>
      <span className="shrink-0 text-[10px] sm:text-[11px] font-medium text-[#1f4865] dark:text-[#5b9abf] whitespace-nowrap">
        Open →
      </span>
    </a>
  );
}
