import type React from "react";
import { Link } from "react-router-dom";

const CountryServices: React.FC<any> = ({ translatedServices, t, countryName }) => {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-3">{t("country.services_for")} {countryName}</h2>
      {translatedServices.length === 0 ? (
        <div className="text-sm text-slate-600">{t("country.no_services")}</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {translatedServices.map((s: any) => (
            <Link key={s.id} to={`/services/${s.service_type}/${s.id}`} className="block rounded-lg bg-white dark:bg-[#1f1f1f] p-4 border border-slate-200 dark:border-white/10 hover:shadow transition">
              <h3 className="font-semibold text-slate-900 dark:text-white">{s.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{s.short_description ?? s.description ?? s.service_type}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default CountryServices;
