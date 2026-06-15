import { useTranslation } from "react-i18next";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon } from "@hugeicons/core-free-icons";
import type { Service } from "@/lib/types";

export function ServiceDetailHeader({ service }: { service: Service }) {
    const { t } = useTranslation();
    return (
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
                <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-100 dark:border-emerald-800/50">
                    {service.service_type?.replace('_', ' ') || t("services.service_label")}
                </span>
                {service.delivery_days && (
                    <span className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1">
                        <HugeiconsIcon icon={Clock01Icon} className="w-4 h-4" />
                        {service.delivery_days} {t("services.days_delivery")}
                    </span>
                )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-white mb-6 leading-tight">
                {service.title}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed border-l-4 border-slate-200 dark:border-white/20 pl-4 italic">
                {service.description}
            </p>
        </div>
    );
}
