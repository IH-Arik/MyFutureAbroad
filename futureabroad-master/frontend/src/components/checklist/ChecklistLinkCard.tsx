export default function ChecklistLinkCard({ id, name, items_created }: { id: string; name: string; items_created?: number | null }) {
  return (
    <a
      href={`/checklists/${id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose flex items-center justify-between gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#252525] px-3 sm:px-5 py-3 sm:py-4 my-2 sm:my-3 hover:border-[#1f4865] dark:hover:border-[#5b9abf] hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="flex h-8 sm:h-9 w-8 sm:w-9 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-[#1f4865]/10 dark:bg-[#1f4865]/20 text-[#1f4865] dark:text-[#5b9abf]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">Checklist created{items_created != null ? ` · ${items_created} items` : ""}</p>
          <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">{name}</p>
        </div>
      </div>
      <span className="shrink-0 text-[10px] sm:text-[11px] font-medium text-[#1f4865] dark:text-[#5b9abf] whitespace-nowrap">
        Open →
      </span>
    </a>
  );
}
