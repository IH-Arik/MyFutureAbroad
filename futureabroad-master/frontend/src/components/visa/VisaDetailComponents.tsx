// VisaDetailComponents.tsx
import type { Visa } from "@/lib/types";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon, Link01Icon, UserCircleIcon, Alert02Icon } from "@hugeicons/core-free-icons";
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

const BooleanItem = ({ label, value }: { label: string; value: boolean | null | undefined }) => {
    const { t } = useTranslation();
    if (value === undefined || value === null) return null;
    return (
        <div className="flex flex-col gap-1">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</dt>
            <dd className={`text-base font-semibold ${value ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}`}>
                {value ? t("common.yes") : t("common.no")}
            </dd>
        </div>
    );
};

export function VisaTargetApplicant({ visa }: { visa: Visa }) {
    const { t } = useTranslation();
    if (!visa.target_applicant) return null;
    return (
        <div className="flex items-start gap-3 rounded-xl bg-[#8B6949]/8 dark:bg-[#8B6949]/15 border border-[#8B6949]/20 px-5 py-4">
            <HugeiconsIcon icon={UserCircleIcon} className="w-5 h-5 mt-0.5 shrink-0 text-[#8B6949]" />
            <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8B6949] mb-1">{t("visa_components.target_applicant")}</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{visa.target_applicant}</p>
            </div>
        </div>
    );
}

export function VisaKeyDetails({ visa }: { visa: Visa }) {
    const { formatVisaAmount } = useCurrency();
    const { t } = useTranslation();

    const feeDisplay = (() => {
        const amount = visa.application_fee_amount ?? visa.application_fee_usd;
        const currency = visa.base_currency ?? visa.application_fee_currency;
        if (amount != null && currency) return formatVisaAmount(amount, currency);
        if (amount != null) return formatVisaAmount(amount, "USD");
        return t("visa_components.na");
    })();

    const processingDisplay = (() => {
        const min = visa.processing_time_min_days;
        const max = visa.processing_time_max_days;
        const avg = visa.processing_time_days;
        if (min != null && max != null) return `${min}–${max} ${t("visa_components.days")}`;
        if (avg != null) return `${avg} ${t("visa_components.days")}`;
        return t("visa_components.unknown");
    })();

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-white/10">
                <DetailItem label={t("visa_components.app_fee")} value={feeDisplay} />
            </div>
            <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-white/10">
                <DetailItem label={t("visa_components.processing_time")} value={processingDisplay} />
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
                    <DetailItem
                        label={t("visa_components.min_income")}
                        value={visa.min_income ? formatAmount(visa.min_income, visa.min_income_currency || "USD") : undefined}
                    />
                    <DetailItem
                        label={t("visa_components.min_savings")}
                        value={visa.min_savings ? formatAmount(visa.min_savings, visa.min_savings_currency || "USD") : undefined}
                    />
                    <BooleanItem label={t("visa_components.work_permitted")} value={visa.work_permitted} />
                    <BooleanItem label={t("visa_components.dependants_allowed")} value={visa.dependants_allowed} />
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

                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-white/10">
                    <DetailItem
                        label={t("visa_components.health_insurance")}
                        value={visa.requires_health_insurance ? t("visa_components.required") : t("visa_components.not_required")}
                    />
                    <DetailItem
                        label={t("visa_components.criminal_record")}
                        value={visa.requires_clean_criminal_record ? t("visa_components.clean_record") : t("visa_components.not_required")}
                    />
                </div>

                {visa.renewal_conditions && (
                    <div className="pt-4 border-t border-slate-100 dark:border-white/10">
                        <h3 className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1">
                            {t("visa_components.renewal_conditions")}
                        </h3>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{visa.renewal_conditions}</p>
                    </div>
                )}
            </div>
        </section>
    );
}

export function VisaApplicationSteps({ steps }: { steps?: string[] }) {
    const { t } = useTranslation();
    if (!steps || steps.length === 0) return null;
    return (
        <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">{t("visa_components.application_steps")}</h2>
            <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden">
                {steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-4 px-6 py-4 border-b border-slate-100 dark:border-white/10 last:border-b-0">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#8B6949] text-white text-xs font-bold mt-0.5">
                            {i + 1}
                        </span>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-0.5">{step.replace(/^\d+\.\s*/, "")}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export function VisaTaxImplications({ tax_implications }: { tax_implications?: string }) {
    const { t } = useTranslation();
    if (!tax_implications) return null;
    return (
        <section className="bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200 dark:border-amber-800/30 p-5">
            <div className="flex items-start gap-3">
                <HugeiconsIcon icon={Alert02Icon} className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                    <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">{t("visa_components.tax_implications")}</h3>
                    <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">{tax_implications}</p>
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
