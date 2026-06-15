import type React from "react";
import { Link } from "react-router-dom";

const CountryVisas: React.FC<any> = ({ translatedVisas, expanded, onToggle, t, countryName }) => {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-3">{t("country.visas_for")} {countryName}</h2>
      {translatedVisas.length === 0 ? (
        <div className="text-sm text-slate-600">{t("country.no_visas")}</div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {translatedVisas.slice(0, expanded ? undefined : 4).map((v: any) => (
              <Link key={v.id} to={`/visas/${v.id}`} className="block rounded-lg bg-white dark:bg-[#1f1f1f] p-4 border border-slate-200 dark:border-white/10 hover:shadow transition">
                <h3 className="font-semibold text-slate-900 dark:text-white">{v.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-2">
                  {v.description 
                    ? v.description.split(/[.!?]+/).slice(0, 1).join('.') + '...' 
                    : v.visa_type}
                </p>
              </Link>
            ))}
          </div>
          {translatedVisas.length > 4 && (
            <button
              onClick={onToggle}
              className="cursor-pointer mt-4 inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
            >
              {expanded ? t("country.show_less") : t("country.view_more")}
            </button>
          )}
        </>
      )}
    </section>
  );
};

export default CountryVisas;
