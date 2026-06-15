import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { Service, ServiceType } from "@/lib/types";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { VerifiedBadge } from "@/components/provider/VerifiedBadge";
import { StarIcon, Clock01Icon } from "@hugeicons/core-free-icons";

interface ServiceListingCardProps {
  service: Service;
  category: ServiceType;
  index?: number;
}

export function ServiceListingCard({ service, category, index = 0 }: ServiceListingCardProps) {
    const { t } = useTranslation();
    const { formatAmount } = useCurrency();

    const priceLabel =
        service.price_type === 'starting_at' ? t("services.starting_at") :
        service.price_type === 'hourly' ? t("services.per_hour") :
        t("services.fixed_price");

    return (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.35, delay: (index % 8) * 0.05 }}
        >
        <Link
            to={`/services/${category.id}/${service.id}`}
            className="group flex flex-col justify-between bg-white dark:bg-[#1f1f1f] rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
            <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    {service.provider?.logo_url ? (
                        <img src={service.provider.logo_url} alt={service.provider.company_name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400">
                            {service.provider?.company_name.substring(0, 2).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1 flex items-center gap-1">
                            {service.provider?.company_name}
                            <VerifiedBadge verified={service.provider?.verified ?? false} size="sm" />
                        </div>
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-[#1f4865] dark:group-hover:text-[#5b9abf] transition-colors line-clamp-2">
                    {service.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4">{service.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {service.delivery_days != null && service.delivery_days !== 0 && (
                        <span className="bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-100 dark:border-white/10 flex items-center gap-1">
                            <HugeiconsIcon icon={Clock01Icon} className="w-3 h-3" />
                            {service.delivery_days} {t("services.days_delivery")}
                        </span>
                    )}
                    {service.provider?.rating != null && service.provider?.rating !== 0 && (
                        <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md text-xs font-medium border border-amber-100 flex items-center gap-1">
                            <HugeiconsIcon icon={StarIcon} className="w-3 h-3 fill-current" />
                            {service.provider.rating} ({service.provider?.review_count})
                        </span>
                    )}
                </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    {priceLabel}
                </span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                    {formatAmount(service.price_usd, service.currency || "USD")}
                </span>
            </div>
        </Link>
        </motion.div>
    );
}
