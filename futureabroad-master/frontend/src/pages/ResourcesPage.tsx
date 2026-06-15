import { useEffect, useState } from "react";
import type React from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Resource } from "@/lib/types";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useTranslation } from "react-i18next";
import { useTranslatedResources } from "@/hooks/useTranslatedResources";

// Simple markdown bold parser
const parseMarkdown = (text: string) => {
    const parts: (string | React.ReactNode)[] = [];
    let lastIndex = 0;
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    
    while ((match = boldRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }
        parts.push(
            <strong key={`bold-${match.index}`} className="font-bold">
                {match[1]}
            </strong>
        );
        lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : text;
};

export function ResourcesPage() {
    const { t } = useTranslation();
    const [resources, setResources] = useState<Resource[]>([]);
    const translatedResources = useTranslatedResources(resources);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const { data, error } = await supabase
                    .from("resources")
                    .select("*")
                    .eq("published", true)
                    .order("created_at", { ascending: false });
                
                if (error) throw error;
                setResources(data || []);
            } catch (error) {
                console.error("Error fetching resources:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    if (loading) return <div className="text-center py-20 text-slate-500 dark:text-slate-400">{t("resources.loading")}</div>;

    return (
        <div className="mx-auto w-full max-w-[80vw] space-y-16 py-4 sm:px-4 sm:py-8 lg:px-6">
            <section className="relative mx-auto mt-12 w-full max-w-[80vw] overflow-hidden rounded-[2rem] py-12 sm:py-32 text-center">
                <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2000&q=80"
                    className="absolute inset-0 h-full w-full object-cover"
                    alt="Resources and guides landscape"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/55" />

                {/* Content */}
                <div className="relative z-10 mx-auto max-w-5xl px-6">
                    <h1 className="text-2xl font-medium leading-[0.85] tracking-[-0.02em] text-white sm:text-4xl lg:text-6xl xl:text-7xl">
                        {t("resources.page_title")}
                    </h1>
                    <p className="mt-4 sm:mt-6 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed text-white/90">
                        {t("resources.page_subtitle")}
                    </p>
                </div>
            </section>

            <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {translatedResources.map((resource) => (
                    <Link 
                        key={resource.id} 
                        to={`/resources/${resource.id}`}
                        className="group flex flex-col bg-white dark:bg-[#1f1f1f] rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="relative h-48 overflow-hidden">
                            <img 
                                src={resource.cover_image} 
                                alt={resource.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute top-4 left-4 bg-white/90 dark:bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                {resource.type}
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-3 mb-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                <span className="flex items-center gap-1">
                                    <HugeiconsIcon icon={Clock01Icon} className="w-3.5 h-3.5" />
                                    {resource.reading_time_minutes} {t("common.min_read")}
                                </span>
                                <span>•</span>
                                <span>{new Date(resource.created_at || Date.now()).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3 group-hover:text-[#1f4865] dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                {resource.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-6 flex-1">
                                {resource.excerpt}
                            </p>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                                <div className="flex flex-wrap gap-2">
                                    {resource.tags.slice(0, 2).map((tag, i) => (
                                        <span key={i} className="text-xs bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md">
                                            {tag}
                                        </span>
                                    ))}
                                    {resource.tags.length > 2 && (
                                        <span className="text-xs bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md">+{resource.tags.length - 2}</span>
                                    )}
                                </div>
                                <span className="text-[#1f4865] dark:text-blue-400 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                    {parseMarkdown(t("resources.read"))}
                                    <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </section>

            {resources.length === 0 && (
                <div className="text-center py-20 bg-slate-50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
                    <p className="text-slate-500 dark:text-slate-400 font-medium">{t("resources.empty")}</p>
                </div>
            )}
        </div>
    );
}
