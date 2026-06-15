export interface VisaDetailData {
  id: number;
  name: string;
  visa_type: string | null;
  country: string | null;
  description: string | null;
  processing_time_days: number | null;
  validity_months: number | null;
  application_fee_usd: number | null;
  renewable: boolean | null;
  min_age: number | null;
  max_age: number | null;
  min_income: number | null;
  min_income_currency: string | null;
  requires_health_insurance: boolean | null;
  requires_clean_criminal_record: boolean | null;
  has_path_to_residency: boolean | null;
  path_to_residency_description: string | null;
  benefits: string[] | null;
  official_link: string | null;
}

export default function VisaDetailCard({ v }: { v: VisaDetailData }) {
  const stats = [
    v.processing_time_days != null && { label: "Processing", value: `${v.processing_time_days} days` },
    v.validity_months != null && { label: "Validity", value: `${v.validity_months} months` },
    v.application_fee_usd != null && { label: "Fee", value: `$${v.application_fee_usd}` },
    v.min_income != null && { label: "Min. Income", value: `${v.min_income_currency ?? ""}${v.min_income}/mo` },
    v.min_age != null && { label: "Min. Age", value: String(v.min_age) },
    v.max_age != null && { label: "Max. Age", value: String(v.max_age) },
  ].filter(Boolean) as { label: string; value: string }[];

  const flags = [
    v.requires_health_insurance === true && { label: "Health insurance required", type: "warn" },
    v.requires_clean_criminal_record === true && { label: "Clean criminal record", type: "warn" },
    v.has_path_to_residency === true && { label: "Path to residency", type: "good" },
    v.renewable === true && { label: "Renewable", type: "good" },
    v.renewable === false && { label: "Non-renewable", type: "neutral" },
  ].filter(Boolean) as { label: string; type: "good" | "warn" | "neutral" }[];

  return (
    <div className="rounded-xl sm:rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#252525] overflow-hidden my-2 sm:my-3 not-prose">
      <div className="bg-[#1f4865] px-3 sm:px-5 py-3 sm:py-4">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="min-w-0">
            <h3 className="font-bold text-white text-sm sm:text-base leading-tight">{v.name}</h3>
            {v.country && <p className="text-[#a8cce0] text-[11px] sm:text-xs mt-0.5">{v.country}</p>}
          </div>
          {v.visa_type && (
            <span className="shrink-0 text-[9px] sm:text-[10px] font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/20 text-white">
              {v.visa_type}
            </span>
          )}
        </div>
        {v.description && (
          <p className="text-white/80 text-[11px] sm:text-xs mt-1.5 sm:mt-2 leading-relaxed">{v.description}</p>
        )}
      </div>

      <div className="px-3 sm:px-5 py-3 sm:py-4 space-y-3 sm:space-y-4">
        {stats.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
            {stats.map((s) => (
              <div key={s.label} className="rounded-lg sm:rounded-xl bg-white dark:bg-[#1f1f1f] border border-slate-100 dark:border-white/10 px-2 sm:px-3 py-1.5 sm:py-2 text-center">
                <p className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500">{s.label}</p>
                <p className="text-[10px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {flags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {flags.map((f) => (
              <span
                key={f.label}
                className={`text-[9px] sm:text-[11px] font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border ${
                  f.type === "good"
                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                    : f.type === "warn"
                    ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400"
                    : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500"
                }`}
              >
                {f.label}
              </span>
            ))}
          </div>
        )}

        {v.benefits && v.benefits.length > 0 && (
          <div>
            <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1">Benefits</p>
            <ul className="space-y-0.5">
              {v.benefits.map((b) => (
                <li key={b} className="flex items-start gap-1.5 text-[10px] sm:text-xs text-slate-700 dark:text-slate-300">
                  <span className="text-emerald-500 mt-0.5 shrink-0">✓</span> {b}
                </li>
              ))}
            </ul>
          </div>
        )}

        {v.has_path_to_residency && v.path_to_residency_description && (
          <div className="rounded-lg sm:rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-2.5 sm:px-3 py-1.5 sm:py-2">
            <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-0.5">Path to Residency</p>
            <p className="text-[10px] sm:text-xs text-emerald-700 dark:text-emerald-300">{v.path_to_residency_description}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-1 sm:pt-2 border-t border-slate-100 dark:border-white/10 gap-2">
          {v.official_link ? (
            <a
              href={v.official_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-[#1f4865] dark:hover:text-[#5b9abf] transition-colors truncate"
            >
              Official source ↗
            </a>
          ) : <span />}
          <a
            href={`/visas/${v.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] sm:text-[11px] font-medium text-[#1f4865] dark:text-[#5b9abf] hover:underline whitespace-nowrap"
          >
            Full details →
          </a>
        </div>
      </div>
    </div>
  );
}
