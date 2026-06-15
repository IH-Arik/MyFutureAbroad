// VisaDetailComponents.tsx
import type { Visa } from "@/lib/types";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon, Link01Icon } from "@hugeicons/core-free-icons";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { useTranslation } from "react-i18next";

const DetailItem = ({ label, value }: { label: string; value: string | number | undefined | null }) => {
    if (value === undefined || value === null) return null;
    return (
        <div className="flex flex-col gap-1">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</dt>
            <dd className="text-base font-semibold text-slate-900 dark:text-white">{value}</dd>
        </div>
    );
};

export function VisaKeyDetails({ visa }: { visa: Visa }) {
    const { formatVisaAmount } = useCurrency();
    const { t } = useTranslation();

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-white/10">
                <DetailItem label={t("visa_components.app_fee")} value={visa.application_fee_amount ? formatVisaAmount(visa.application_fee_amount, visa.base_currency) : t("visa_components.na")} />

            </div>
            <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-white/10">
                <DetailItem label={t("visa_components.processing_time")} value={visa.processing_time_days ? `${visa.processing_time_days} ${t("visa_components.days")}` : t("visa_components.unknown")} />
            </div>
            <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-white/10">
                <DetailItem label={t("visa_components.validity")} value={visa.validity_months ? `${visa.validity_months} ${t("visa_components.months")}` : t("visa_components.variable")} />
            </div>
            <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-white/10">
                <DetailItem label={t("visa_components.renewable")} value={visa.renewable ? t("common.yes") : t("common.no")} />
            </div>
        </div>
    );
}

export function VisaRequirements({ visa }: { visa: Visa }) {
    const { formatAmount } = useCurrency();
    const { t } = useTranslation();

    return (
        <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">{t("visa_components.requirements")}</h2>
            <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl border border-slate-100 dark:border-white/10 p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                    <DetailItem label={t("visa_components.min_age")} value={visa.min_age} />
                    <DetailItem label={t("visa_components.max_age")} value={visa.max_age} />
                    <DetailItem label={t("visa_components.min_income")} value={visa.min_income ? formatAmount(visa.min_income, visa.min_income_currency || 'USD') : undefined} />
                    <DetailItem label={t("visa_components.min_savings")} value={visa.min_savings ? formatAmount(visa.min_savings, visa.min_savings_currency || 'USD') : undefined} />
                </div>

                {visa.required_skills && visa.required_skills.length > 0 && (
                    <div className="pt-4 border-t border-slate-100 dark:border-white/10">
                        <h3 className="font-medium text-slate-900 dark:text-white mb-2">{t("visa_components.required_skills")}</h3>
                        <div className="flex flex-wrap gap-2">
                            {visa.required_skills.map((skill, i) => (
                                <span key={i} className="bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <DetailItem label={t("visa_components.health_insurance")} value={visa.requires_health_insurance ? t("visa_components.required") : t("visa_components.not_required")} />
                    </div>
                    <div>
                        <DetailItem label={t("visa_components.criminal_record")} value={visa.requires_clean_criminal_record ? t("visa_components.clean_record") : t("visa_components.not_required")} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export function VisaDocuments({ required_documents }: { required_documents?: string[] }) {
    const { t } = useTranslation();
    if (!required_documents || required_documents.length === 0) return null;
    return (
        <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 tracking-tight">{t("visa_components.required_docs")}</h2>
            <ul className="bg-white dark:bg-[#1f1f1f] rounded-2xl border border-slate-100 dark:border-white/10 divide-y divide-slate-100 dark:divide-white/10 overflow-hidden">
                {required_documents.map((doc, i) => (
                    <li key={i} className="flex items-center gap-3 px-5 py-3.5 text-sm text-slate-700 dark:text-slate-300">
                        <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4 shrink-0 text-emerald-500" />
                        {doc}
                    </li>
                ))}
            </ul>
        </section>
    );
}

export function VisaOfficialLink({ official_link }: { official_link?: string }) {
    const { t } = useTranslation();
    if (!official_link) return null;
    return (
        <a
            href={official_link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8B6949] to-[#D4C2A1] px-7 py-3 text-sm font-semibold text-white transition hover:from-[#9c7a58] hover:to-[#e2d2b3] shadow-md hover:shadow-lg"
        >
            {t("visa_components.official_link")}
            <HugeiconsIcon icon={Link01Icon} className="w-4 h-4" />
        </a>
    );
}
