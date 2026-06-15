import { useTranslation } from "react-i18next";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";

interface VisaSidebarProps {
    benefits?: string[];
    has_path_to_residency?: boolean;
    path_to_residency_description?: string;
}

export function VisaBenefits({ benefits }: { benefits?: string[] }) {
    const { t } = useTranslation();
    if (!benefits || benefits.length === 0) return null;
    return (
        <section className="h-full bg-gradient-to-br from-[#8B6949] to-[#D4C2A1] rounded-2xl p-5 text-white shadow-md flex flex-col">
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3 flex items-center gap-2 opacity-90">
                <HugeiconsIcon icon={StarIcon} className="w-4 h-4 fill-current" />
                {t("visa_components.benefits")}
            </h3>
            <ul className="space-y-2 flex-1">
                {benefits.map((benefit, i) => (
                    <li key={i} className="text-base leading-relaxed flex gap-2 opacity-90">
                        <span className="mt-0.5 shrink-0">•</span>
                        {benefit}
                    </li>
                ))}
            </ul>
        </section>
    );
}

export function VisaPathToResidency({ has_path_to_residency, path_to_residency_description }: { has_path_to_residency?: boolean; path_to_residency_description?: string }) {
    const { t } = useTranslation();
    if (!has_path_to_residency) return null;
    return (
        <section className="bg-white dark:bg-[#1f1f1f] rounded-2xl p-5 border border-slate-100 dark:border-white/10">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-2">{t("visa_components.path_to_residency")}</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {path_to_residency_description || t("visa_components.path_to_residency_desc")}
            </p>
        </section>
    );
}

export function VisaSidebar({ benefits, has_path_to_residency, path_to_residency_description }: VisaSidebarProps) {
    return (
        <div className="space-y-4">
            <VisaBenefits benefits={benefits} />
            <VisaPathToResidency has_path_to_residency={has_path_to_residency} path_to_residency_description={path_to_residency_description} />
        </div>
    );
}
