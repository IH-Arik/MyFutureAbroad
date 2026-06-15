import type React from "react";

const FinancesStep: React.FC<any> = ({ currency, currencySymbol, profile, setProfile, t }) => {
  return (
    <>
      <h2 className="text-2xl font-semibold text-foreground mb-1">
        {t("visa_finder.finances_title")}
      </h2>
      <p className="text-muted-foreground mb-7">
        {t("visa_finder.finances_currency")} <span className="font-medium text-foreground">{currency} ({currencySymbol})</span> {t("visa_finder.finances_currency_hint")}
      </p>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t("visa_finder.income_label")}
          </label>
          <div className="flex rounded-xl border border-border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-[#8B6949]/40">
            <span className="flex items-center px-3 text-sm font-medium text-muted-foreground bg-muted border-r border-border whitespace-nowrap">
              {currencySymbol}
            </span>
            <input
              type="number"
              min="0"
              value={profile.monthlyIncome}
              onChange={(e) => setProfile((prev: any) => ({ ...prev, monthlyIncome: e.target.value }))}
              placeholder={t("visa_finder.income_placeholder")}
              className="flex-1 px-4 py-3 text-sm bg-transparent focus:outline-none dark:text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t("visa_finder.savings_label")}
          </label>
          <div className="flex rounded-xl border border-border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-[#8B6949]/40">
            <span className="flex items-center px-3 text-sm font-medium text-muted-foreground bg-muted border-r border-border whitespace-nowrap">
              {currencySymbol}
            </span>
            <input
              type="number"
              min="0"
              value={profile.savings}
              onChange={(e) => setProfile((prev: any) => ({ ...prev, savings: e.target.value }))}
              placeholder={t("visa_finder.savings_placeholder")}
              className="flex-1 px-4 py-3 text-sm bg-transparent focus:outline-none dark:text-white"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FinancesStep;
