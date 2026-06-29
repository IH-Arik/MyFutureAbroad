import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Visa, Country } from "@/lib/types";
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import ReactMarkdown from "react-markdown";
import { VisaKeyDetails, VisaRequirements, VisaDocuments, VisaOfficialLink, VisaApplicationSteps, VisaTaxImplications, VisaTargetApplicant } from "@/components/visa/VisaDetailComponents";
import { VisaBenefits, VisaPathToResidency } from "@/components/visa/VisaSidebar";
import { useTranslation } from "react-i18next";
import { useTranslatedVisa } from "@/hooks/useTranslatedVisa";
import { useTranslatedCountry } from "@/hooks/useTranslatedCountry";

export function VisaPage() {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const [visa, setVisa] = useState<Visa | null>(null);
    const translatedVisa = useTranslatedVisa(visa);
    const [country, setCountry] = useState<Country | null>(null);
    const translatedCountry = useTranslatedCountry(country);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVisa = async () => {
            if (!id) return;
            try {
                const { data: visaData, error: visaError } = await supabase
                    .from("visas")
                    .select("*")
                    .eq("id", id)
                    .single();
                if (visaError) throw visaError;
                setVisa(visaData);

                if (visaData.country_id) {
                    const { data: countryData, error: countryError } = await supabase
                        .from("countries")
                        .select("*")
                        .eq("id", visaData.country_id)
                        .single();
                    if (countryError) throw countryError;
                    setCountry(countryData);
                }
            } catch (error) {
                console.error("Error fetching visa:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVisa();
    }, [id]);

    if (loading) return <div className="text-center py-20 text-muted-foreground">{t("visa_page.loading")}</div>;
    if (!visa || !translatedVisa) return <div className="text-center py-20 text-muted-foreground">{t("visa_page.not_found")}</div>;

    return (
        <div className="mx-auto w-full max-w-[80vw] py-8 space-y-8 sm:px-4 lg:px-6">
            <Link
                to="/visas"
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-2 group transition-colors text-sm font-medium"
            >
                <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                {t("visa_page.back")}
            </Link>

            {/* Full-width header */}
            <div className="rounded-lg border border-slate-200 dark:border-white/10 p-6 lg:p-8 bg-white dark:bg-[#1f1f1f]">
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Left: Header and Description */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                {country && country.flag_url && (
                                    <img src={country.flag_url} alt={`${translatedCountry?.name ?? country.name} flag`} className="h-6 w-auto rounded shadow-sm" />
                                )}
                                <div className="flex-1">
                                    <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">{translatedVisa.name}</h1>
                                    <div className="flex items-center gap-2 mt-1">
                                        {country && (
                                            <Link to={`/countries/${country.id}`} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                                {translatedCountry?.name ?? country.name}
                                            </Link>
                                        )}
                                        {translatedVisa.visa_type && (
                                            <>
                                                <span className="text-slate-300 dark:text-slate-600">•</span>
                                                <span className="text-sm text-slate-500 dark:text-slate-400">{translatedVisa.visa_type.replace(/_/g, ' ')}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {translatedVisa.description && (
                            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                                {translatedVisa.description}
                            </p>
                        )}
                        <VisaTargetApplicant visa={translatedVisa} />
                    </div>

                    {/* Right: Highlight Image */}
                    <div>
                        {country?.highlight_img_url ? (
                            <img
                                src={country.highlight_img_url}
                                alt={country.name}
                                className="w-full h-96 object-cover rounded-2xl shadow-sm"
                            />
                        ) : (
                            <div className="w-full h-96 bg-slate-200 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400">
                                {t("visa_page.no_image")}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Row 1: key details | benefits (same height) */}
            <div className="grid gap-8 lg:grid-cols-[2fr_1fr] items-start">
                <div className="space-y-8">
                    <VisaKeyDetails visa={translatedVisa} />
                    <VisaRequirements visa={translatedVisa} />
                    <VisaApplicationSteps steps={translatedVisa.application_process_steps} />
                    <VisaTaxImplications tax_implications={translatedVisa.tax_implications} />

                    {/* Additional Details (markdown from country.extra_info) */}
                    {country?.extra_info && (
                        <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1f1f1f] p-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">{t("visa_page.additional_details")}</h3>
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown
                                    components={{
                                        h2: ({ node, ...props }) => <h2 className="text-lg font-semibold text-slate-900 dark:text-white mt-4 mb-2" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300" {...props} />,
                                        li: ({ node, ...props }) => <li className="text-sm text-slate-700 dark:text-slate-300" {...props} />,
                                        p: ({ node, ...props }) => <p className="text-sm text-slate-700 dark:text-slate-300" {...props} />,
                                    }}
                                >
                                    {translatedCountry?.extra_info ?? country.extra_info}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
                <div className="space-y-6">
                    {country && (
                        <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1f1f1f] p-4">
                            <div className="flex items-center gap-3 mb-3">
                                {country.flag_url && (
                                    <img src={country.flag_url} alt={`${translatedCountry?.name ?? country.name} flag`} className="h-6 w-auto rounded shadow-sm" />
                                )}
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{translatedCountry?.name ?? country.name}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t("visa_page.iso", { code: country.iso_code })}</p>
                                </div>
                            </div>
                            {country.description && (
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <ReactMarkdown
                                        components={{
                                            h2: ({ node, ...props }) => <h2 className="text-lg font-semibold text-slate-900 dark:text-white mt-4 mb-2" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300" {...props} />,
                                            li: ({ node, ...props }) => <li className="text-sm text-slate-700 dark:text-slate-300" {...props} />,
                                            p: ({ node, ...props }) => <p className="text-sm text-slate-700 dark:text-slate-300" {...props} />,
                                        }}
                                    >
                                        {translatedCountry?.description ?? country.description}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    )}
                    <VisaBenefits benefits={translatedVisa.benefits} />
                    <div className="flex flex-col gap-5">
                        <VisaPathToResidency has_path_to_residency={translatedVisa.has_path_to_residency} path_to_residency_description={translatedVisa.path_to_residency_description} />
                        <VisaDocuments required_documents={translatedVisa.required_documents} />
                        <div className="mt-auto">
                            <VisaOfficialLink official_link={translatedVisa.official_link} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VisaPage;
