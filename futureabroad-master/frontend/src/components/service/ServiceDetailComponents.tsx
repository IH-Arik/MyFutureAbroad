import { useTranslation } from "react-i18next";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";

interface ServiceIncludesProps {
    includes: string[];
}

export function ServiceIncludes({ includes }: ServiceIncludesProps) {
    const { t } = useTranslation();
    if (!includes || includes.length === 0) return null;

    return (
        <section className="bg-white dark:bg-[#1f1f1f] rounded-2xl border border-slate-100 dark:border-white/10 p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <HugeiconsIcon icon={Tick02Icon} className="w-5 h-5 text-emerald-500" /> {t("services.whats_included")}
            </h2>
            <ul className="grid sm:grid-cols-2 gap-4">
                {includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        {item}
                    </li>
                ))}
            </ul>
        </section>
    );
}

export function ServiceRequirements({ requirements }: { requirements: string[] }) {
    const { t } = useTranslation();
    if (!requirements || requirements.length === 0) return null;

    return (
        <section className="bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 p-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">{t("services.requirements")}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{t("services.requirements_desc")}</p>
            <ul className="space-y-3">
                {requirements.map((req, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium text-sm">
                        <div className="w-6 h-6 rounded-full bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 flex items-center justify-center text-xs font-bold text-slate-400 dark:text-slate-500">
                            {i + 1}
                        </div>
                        {req}
                    </li>
                ))}
            </ul>
        </section>
    );
}
