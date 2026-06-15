

export interface VisaCardData {
  id: number;
  name: string;
  visa_type: string | null;
  country: string | null;
  processing_time_days: number | null;
  validity_months: number | null;
  application_fee_usd: number | null;
  renewable: boolean | null;
}

export default function VisaCardGrid({ visas }: { visas: VisaCardData[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 my-2 sm:my-3 not-prose">
      {visas.map((v) => (
        <a
          key={v.id}
          href={`/visas/${v.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl sm:rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#252525] p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 hover:border-[#1f4865] dark:hover:border-[#5b9abf] hover:shadow-sm transition-all cursor-pointer"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">{v.name}</p>
              {v.country && (
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">{v.country}</p>
              )}
            </div>
            {v.visa_type && (
              <span className="shrink-0 text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded-full bg-[#1f4865]/10 dark:bg-[#1f4865]/30 text-[#1f4865] dark:text-[#5b9abf]">
                {v.visa_type}
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-1 text-center">
            {v.processing_time_days != null && (
              <div className="rounded-lg sm:rounded-xl bg-white dark:bg-[#1f1f1f] border border-slate-100 dark:border-white/10 px-1.5 sm:px-2 py-1 sm:py-1.5">
                <p className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500">Process</p>
                <p className="text-[10px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200">{v.processing_time_days}d</p>
              </div>
            )}
            {v.validity_months != null && (
              <div className="rounded-lg sm:rounded-xl bg-white dark:bg-[#1f1f1f] border border-slate-100 dark:border-white/10 px-1.5 sm:px-2 py-1 sm:py-1.5">
                <p className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500">Valid</p>
                <p className="text-[10px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200">{v.validity_months}m</p>
              </div>
            )}
            {v.application_fee_usd != null && (
              <div className="rounded-lg sm:rounded-xl bg-white dark:bg-[#1f1f1f] border border-slate-100 dark:border-white/10 px-1.5 sm:px-2 py-1 sm:py-1.5">
                <p className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500">Fee</p>
                <p className="text-[10px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200">${v.application_fee_usd}</p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-1">
            {v.renewable != null && (
              <span className={`text-[9px] sm:text-[10px] font-medium ${
                v.renewable ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
              }`}>
                {v.renewable ? "✓ Renewable" : "Non-renewable"}
              </span>
            )}
            <span className="ml-auto text-[10px] sm:text-[11px] font-medium text-[#1f4865] dark:text-[#5b9abf]">
              Details →
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
