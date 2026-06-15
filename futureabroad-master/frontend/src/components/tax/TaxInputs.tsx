import type React from "react";
import { CURRENCY_SYMBOLS } from "@/components/currency/CurrencyProvider";

const TaxInputs: React.FC<any> = ({
  countryCode,
  tr,
  selectedCountry,
  setSelectedCountry,
  countries,
  income,
  setIncome,
  selectedCurrency,
  setSelectedCurrency,
  calculate,
  loading,
}) => {
  return (
    <div className="space-y-4">
      {!countryCode && (
        <div>
          <label className="text-sm text-slate-600 dark:text-slate-400 mb-1 block">{tr[2]}</label>
          <select
            value={selectedCountry}
            onChange={(e: any) => { setSelectedCountry(e.target.value); }}
            className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1f1f1f] text-slate-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f4865]/30"
          >
            <option value="">{tr[3]}</option>
            {countries.map((c: any) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-sm text-slate-600 dark:text-slate-400 mb-1 block">{tr[4]}</label>
          <input
            type="number"
            min="0"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && calculate()}
            placeholder="e.g. 50000"
            className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f4865]/30"
          />
        </div>
        <div>
          <label className="text-sm text-slate-600 dark:text-slate-400 mb-1 block">{tr[5]}</label>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1f1f1f] text-slate-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f4865]/30"
          >
            {Object.keys(CURRENCY_SYMBOLS).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={calculate}
        disabled={loading || !income || !selectedCountry}
        className="w-full rounded-lg bg-[#1f4865] text-white py-2.5 text-sm font-medium hover:bg-[#2d6a96] disabled:opacity-40 transition-colors"
      >
        {loading ? tr[7] : tr[6]}
      </button>
    </div>
  );
};

export default TaxInputs;
