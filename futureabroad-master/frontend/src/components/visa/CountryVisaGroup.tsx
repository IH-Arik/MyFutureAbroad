import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Country, Visa } from "@/lib/types";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { useTranslatedVisas } from "@/hooks/useTranslatedVisas";

interface CountryVisaGroupProps {
    country: Country;
    visas: Visa[];
    loading: boolean;
}

export function CountryVisaGroup({ country, visas, loading }: CountryVisaGroupProps) {
    const { t } = useTranslation();
    const { formatVisaAmount } = useCurrency();
    const translatedVisas = useTranslatedVisas(visas ?? []);
    const count = visas?.length || 0;

    return (
        <article className="group rounded-2xl bg-white dark:bg-[#1f1f1f] shadow-md overflow-hidden">
            <div className="relative overflow-hidden rounded-t-2xl">
                <img
                    src={country.highlight_img_url || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"}
                    alt={country.name}
                    className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                />
            </div>
            <div className="p-4">
                <div className="flex items-center justify-between gap-4">
                    <Link to={`/countries/${country.id}`} className="inline-flex items-center gap-3">
                        {country.flag_url && (
                            <img src={country.flag_url} alt={`${country.name} flag`} className="h-6 w-auto rounded" />
                        )}
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{country.name}</h3>
                    </Link>
                    <Link 
                        to={`/countries/${country.id}`}
                        className="inline-flex px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 text-sm font-medium transition-colors whitespace-nowrap"
                    >
                        {t("visa_components.view_details")}
                    </Link>
                </div>

                <div className="pt-4">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                        {count} {t("visa_components.available")} {count === 1 ? t("visa_components.visa_single") : t("visa_components.visa_plural")}
                    </h4>
                    {loading ? (
                        <div className="text-xs text-slate-500 dark:text-slate-400">{t("visa_components.loading_visas")}</div>
                    ) : translatedVisas?.length === 0 ? (
                        <div className="text-xs text-slate-500 dark:text-slate-400">{t("visa_components.no_visas")}</div>
                    ) : (
                        <div className="space-y-2">
                            {translatedVisas?.map((visa) => (
                                <Link to={`/visas/${visa.id}`} key={visa.id} className="block rounded-lg bg-slate-50 dark:bg-white/5 p-3 border border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30 transition-colors">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-slate-900 dark:text-white">{visa.name}</p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{visa.visa_type}</p>
                                            {visa.description && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{visa.description}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                                        {visa.application_fee_amount != null && (
                                            <span className="font-semibold">{formatVisaAmount(visa.application_fee_amount, visa.base_currency)}</span>
                                        )}
                                        {visa.processing_time_days && (
                                            <span>{visa.processing_time_days} {t("visa_components.days")}</span>
                                        )}
                                        {visa.renewable && (
                                            <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-1 text-green-700 dark:text-green-400">{t("visa_components.renewable")}</span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}
