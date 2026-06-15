import type React from "react";

const CountryLongDescription: React.FC<any> = ({ longDescriptionText, name, expanded, onToggle, t }) => {
  if (!longDescriptionText) return null;
  return (
    <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1f1f1f] p-6 lg:p-8">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{t("country.about", { name })}</h3>
      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {expanded ? longDescriptionText : `${longDescriptionText.substring(0, 300)}...`}
      </p>
      <button
        onClick={onToggle}
        className="cursor-pointer mt-4 inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
      >
        {expanded ? t("country.show_less") : t("country.read_more")}
      </button>
    </div>
  );
};

export default CountryLongDescription;
