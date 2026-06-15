import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Resource } from "@/lib/types";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Clock01Icon, Calendar01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { useTranslation } from "react-i18next";
import { useTranslatedResource } from "@/hooks/useTranslatedResource";

export function ResourcePage() {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const [resource, setResource] = useState<Resource | null>(null);
    const translatedResource = useTranslatedResource(resource);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResource = async () => {
            if (!id) return;
            try {
                const { data, error } = await supabase
                    .from("resources")
                    .select("*")
                    .eq("id", id)
                    .single();
                
                if (error) throw error;
                setResource(data);
            } catch (error) {
                console.error("Error fetching resource:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResource();
    }, [id]);

    if (loading) return <div className="text-center py-20 text-slate-500">{t("resources.article_loading")}</div>;
    if (!resource || !translatedResource) return <div className="text-center py-20 text-slate-500">{t("resources.article_not_found")}</div>;

    return (
        <div className="mx-auto w-full max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
            <Link to="/resources" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 inline-flex items-center gap-2 mb-6 group transition-colors">
                <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                {t("resources.back")}
            </Link>

            <article className="prose prose-slate dark:prose-invert lg:prose-lg mx-auto">
                <header className="mb-8 not-prose">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                        <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-100 dark:border-emerald-800/50">
                            {translatedResource.type}
                        </span>
                        <span className="flex items-center gap-1">
                            <HugeiconsIcon icon={Calendar01Icon} className="w-4 h-4" />
                            {new Date(resource.created_at || Date.now()).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                            <HugeiconsIcon icon={Clock01Icon} className="w-4 h-4" />
                            {resource.reading_time_minutes} {t("common.min_read")}
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                        {translatedResource.title}
                    </h1>

                    {translatedResource.excerpt && (
                        <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-serif italic border-l-4 border-[#1f4865] dark:border-blue-400 pl-6 py-2 bg-slate-50 dark:bg-slate-900/50 mb-8 rounded-r-lg">
                            {translatedResource.excerpt}
                        </p>
                    )}

                    <div className="flex items-center gap-3 mb-8 pb-8 border-b border-slate-100 dark:border-slate-700">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                            <HugeiconsIcon icon={UserIcon} className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{resource.author}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{t("resources.author")}</p>
                        </div>
                    </div>

                    {resource.cover_image && (
                        <div className="rounded-2xl overflow-hidden shadow-lg mb-10 aspect-video relative group">
                            <img
                                src={resource.cover_image}
                                alt={translatedResource.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    )}
                </header>

                <div className="markdown-content space-y-6 text-slate-700 dark:text-slate-300 leading-loose">
                    {translatedResource.content.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="whitespace-pre-wrap">
                            {paragraph}
                        </p>
                    ))}
                </div>
            </article>
        </div>
    );
}
