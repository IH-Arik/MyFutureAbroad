import type React from "react";

const fmt = (n: number, curr: string) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: curr, maximumFractionDigits: 0 }).format(n);

const TaxResult: React.FC<any> = ({ result, breakdown, tr }) => {
  if (!result) return null;
  return (
    <div className="mt-6 space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-slate-50 dark:bg-white/5 p-4 text-center">
          <p className="text-xs text-slate-500 mb-1">{tr[10]}</p>
          <p className="text-sm font-semibold">{fmt(result.gross, result.currency)}</p>
        </div>
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-center">
          <p className="text-xs text-slate-500 mb-1">{tr[11]}</p>
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">{fmt(result.tax.total, result.currency)}</p>
          <p className="text-xs text-slate-400">{(result.tax.rate * 100).toFixed(1)}% {tr[19]}</p>
        </div>
        <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-4 text-center">
          <p className="text-xs text-slate-500 mb-1">{tr[12]}</p>
          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{fmt(result.net, result.currency)}</p>
        </div>
      </div>

      {breakdown.length > 0 && (
        <div className="rounded-lg border border-slate-200 dark:border-white/10 overflow-hidden">
          <p className="text-xs font-medium text-slate-500 px-4 py-2 bg-slate-50 dark:bg-white/5">{tr[13]}</p>
          {breakdown.map(({ label, value }: any) => (
            <div key={label} className="flex justify-between px-4 py-2.5 text-sm border-t border-slate-200 dark:border-white/10">
              <span className="text-slate-600 dark:text-slate-400">{label}</span>
              <span className="font-medium">{fmt(value, result.currency)}</span>
            </div>
          ))}
        </div>
      )}

      {result.assumptions?.subnationalRegion && (
        <p className="text-xs text-slate-400">* {tr[20]} {result.assumptions.subnationalRegion}</p>
      )}
    </div>
  );
};

export default TaxResult;
