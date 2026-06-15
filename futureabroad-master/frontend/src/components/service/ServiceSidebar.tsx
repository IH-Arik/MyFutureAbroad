// ServiceSidebar.tsx
import type React from "react";
import { Button } from "@/components/ui/button";
import type { Provider, Service, Country } from "@/lib/types";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";
import { useCurrency, CURRENCY_SYMBOLS } from "@/components/currency/CurrencyProvider";
import { VerifiedBadge } from "@/components/provider/VerifiedBadge";
import { useTranslation } from "react-i18next";
import {
    StarIcon,
    Globe02Icon,
    SecurityCheckIcon,
    Clock01Icon,
    Mail01Icon
} from "@hugeicons/core-free-icons";
import { LANGUAGES } from "@/components/provider/LanguagesCard";

const DetailRow = ({ icon: Icon, label, value }: { icon: any, label: string, value: React.ReactNode }) => (
    <div className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-white/10 last:border-0">
        <div className="bg-slate-50 dark:bg-white/5 p-2 rounded-lg text-slate-500 dark:text-slate-400">
            <HugeiconsIcon icon={Icon} className="w-4 h-4" />
        </div>
        <div className="flex-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</p>
            <div className="text-sm font-medium text-slate-900 dark:text-white">{value || "N/A"}</div>
        </div>
    </div>
);

interface ServiceSidebarProps {
    service: Service;
    provider: Provider | null;
    onBook: () => void;
    booking?: boolean;
    countries?: Country[];
}

export function ServiceSidebar({ service, provider, onBook, booking, countries }: ServiceSidebarProps) {
    const { formatAmount, currency } = useCurrency();
    const serviceCurrency = service.currency || "USD";
    const { t } = useTranslation();
    return (
        <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl border border-slate-100 dark:border-white/10 shadow-lg p-6">
                <div className="mb-6 pb-6 border-b border-slate-100 dark:border-white/10">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t("service_sidebar.total_price")}</p>
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-slate-900 dark:text-white">{formatAmount(service.price_usd, serviceCurrency)}</span>
                            <span className="text-slate-400 dark:text-slate-500 font-medium uppercase text-sm">{service.price_type === 'hourly' ? '/ hr' : ''}</span>
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                            {t("service_sidebar.prices_shown_in")}{" "}
                            <span className="font-medium text-slate-700 dark:text-slate-300">{CURRENCY_SYMBOLS[currency]?.symbol ?? currency} {currency}</span>
                            {serviceCurrency !== currency && (
                                <span className="ml-1">· billed in <span className="font-medium text-slate-700 dark:text-slate-300">{CURRENCY_SYMBOLS[serviceCurrency]?.symbol ?? serviceCurrency} {serviceCurrency}</span></span>
                            )}
                        </div>
                    </div>
                </div>
                
                <Button
                    onClick={onBook}
                    disabled={booking}
                    className="w-full h-12 text-base font-semibold bg-[#1f4865] hover:bg-[#173b55] text-white shadow-md hover:shadow-xl transition-all mb-4"
                >
                    {booking ? t("service_sidebar.setting_up") : t("service_sidebar.book_service")}
                </Button>
            </div>

            {/* Provider Info Card */}
            {provider && (
                 <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl border border-slate-100 dark:border-white/10 p-6">
                    <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">{t("service_sidebar.provider")}</h3>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-lg font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/20">
                            {provider.logo_url ? <img src={provider.logo_url} alt="" className="rounded-full" /> : provider.company_name.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                {provider.company_name}
                                <VerifiedBadge verified={provider.verified ?? false} size="md" />
                            </div>
                            <div className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <HugeiconsIcon
                                        icon={StarIcon} 
                                        key={i} 
                                        className={`w-3 h-3 ${i < Math.round(provider.rating) ? 'fill-current' : 'text-slate-200 fill-current'}`} 
                                    />
                                ))}
                                <span className="text-slate-400 ml-1">({provider.review_count})</span>
                            </div>
                        </div>
                    </div>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed bg-slate-50 dark:bg-white/5 p-3 rounded-lg border border-slate-100 dark:border-white/10">
                        {provider.description}
                    </p>

                    <div className="space-y-1">
                        <DetailRow
                            icon={Globe02Icon}
                            label={t("service_sidebar.serves")}
                            value={
                                service && countries && countries.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {countries.map((c) => (
                                            <Link key={c.id} to={`/countries/${c.id}`} className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-2 py-1 text-sm font-medium text-slate-700 border border-slate-100 hover:bg-slate-100 dark:bg-white/10 dark:border-white/20 dark:text-slate-300 dark:hover:bg-white/20">
                                                {c.flag_url ? <img src={c.flag_url} alt="" className="h-4 w-auto" /> : null}
                                                <span>{c.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    t("service_sidebar.check_countries")
                                )
                            }
                        />
                        {service.languages && service.languages.length > 0 && (
                            <DetailRow
                                icon={Globe02Icon}
                                label={t("service_sidebar.languages")}
                                value={
                                    <div className="flex flex-wrap gap-2">
                                        {service.languages.map(code => (
                                            <span key={code} className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-2 py-1 text-sm font-medium text-slate-700 border border-slate-100 dark:bg-white/10 dark:border-white/20 dark:text-slate-300">
                                                {LANGUAGES.find(l => l.code === code)?.name ?? code.toUpperCase()}
                                            </span>
                                        ))}
                                    </div>
                                }
                            />
                        )}
                        <DetailRow
                            icon={SecurityCheckIcon}
                            label={t("service_sidebar.verification")}
                            value={provider.verified ? t("service_sidebar.identity_verified") : t("service_sidebar.pending")}
                        />
                        <DetailRow
                            icon={Clock01Icon}
                            label={t("service_sidebar.response_time")}
                            value={t("service_sidebar.response_time_value", { hours: provider.response_time_hours })}
                        />
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/10">
                        <a href={`mailto:${provider.contact_email}`} className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-medium text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                            <HugeiconsIcon icon={Mail01Icon} className="w-4 h-4" /> {t("service_sidebar.contact_provider")}
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
