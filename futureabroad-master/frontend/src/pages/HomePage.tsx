// Link is used in HomeHero; no direct Link usage here
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import type { Resource } from "@/lib/types";
import { useTranslatedResources } from "@/hooks/useTranslatedResources";
import { translateTexts } from "@/lib/deepl";
import HomeHero from "@/components/home/HomeHero";
import HomeTools from "@/components/home/HomeTools";
import HomeDestinations from "@/components/home/HomeDestinations";
import HomeGuides from "@/components/home/HomeGuides";
import HomeTrip from "@/components/home/HomeTrip";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { AiChat02Icon } from "@hugeicons/core-free-icons";


type PopularSeed = { name: string; flag: string; image: string };

export function HomePage() {
    const { t, i18n } = useTranslation();
    const [travelGuides, setTravelGuides] = useState<Resource[]>([]);
    const translatedGuides = useTranslatedResources(travelGuides);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const res = await supabase
                    .from("resources")
                    .select("id, title, excerpt, tags, reading_time_minutes, type, cover_image")
                    .eq("published", true)
                    .order("created_at", { ascending: false })
                    .limit(3);

                if (!mounted) return;

                if ((res as any).error) {
                    console.error("Error fetching travel guides:", (res as any).error);
                    setTravelGuides([]);
                } else {
                    setTravelGuides(((res as any).data ?? []) as Resource[]);
                }
            } catch (err) {
                console.error("Error fetching travel guides:", err);
                if (mounted) setTravelGuides([]);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const popularSeeds: PopularSeed[] = [
        { name: "Portugal", flag: "🇵🇹", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80" },
        { name: "Spain", flag: "🇪🇸", image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=600&q=80" },
        { name: "Germany", flag: "🇩🇪", image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80" },
        { name: "United Kingdom", flag: "🇬🇧", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80" },
    ];

    const [popularDestinations, setPopularDestinations] = useState(
        popularSeeds.map((s) => ({ id: null as number | null, name: s.name, flag: s.flag, flag_url: null as string | null, image: s.image, visasCount: 0 }))
    );

    const [translatedNames, setTranslatedNames] = useState<string[]>([]);
    const [translatedVisaTexts, setTranslatedVisaTexts] = useState<string[]>([]);

    useEffect(() => {
        let mounted = true;
        const names = popularDestinations.map((d) => d.name);
        const visaTexts = popularDestinations.map((d) =>
            d.visasCount > 0
                ? `${d.visasCount} visa scheme${d.visasCount === 1 ? "" : "s"}`
                : "No visas listed"
        );
        translateTexts([...names, ...visaTexts], i18n.language).then((translated) => {
            if (mounted) {
                setTranslatedNames(translated.slice(0, names.length));
                setTranslatedVisaTexts(translated.slice(names.length));
            }
        });
        return () => { mounted = false; };
    }, [popularDestinations, i18n.language]);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const rows = await Promise.all(
                    popularSeeds.map(async (seed) => {
                        try {
                            const { data: countries, error: countryErr } = await supabase
                                .from("countries")
                                .select("id, name, flag_url")
                                .ilike("name", `%${seed.name}%`);

                            if (countryErr || !countries || (Array.isArray(countries) && countries.length === 0)) {
                                return { id: null, name: seed.name, flag: seed.flag, image: seed.image, visasCount: 0 };
                            }

                            const country = Array.isArray(countries)
                                ? (countries.find((c: any) => c.name.toLowerCase() === seed.name.toLowerCase()) || countries[0])
                                : countries;

                            const { count } = await supabase
                                .from("visas")
                                .select("id", { count: "exact", head: true })
                                .eq("country_id", country.id);

                            const visasCount = typeof count === "number" ? count : 0;

                            return { id: country.id, name: country.name, flag: seed.flag, flag_url: country.flag_url ?? null, image: seed.image, visasCount };
                        } catch (err) {
                            console.error("Error fetching popular country", seed.name, err);
                            return { id: null, name: seed.name, flag: seed.flag, flag_url: null, image: seed.image, visasCount: 0 };
                        }
                    })
                );

                if (mounted) setPopularDestinations(rows as any);
            } catch (err) {
                console.error("Error loading popular destinations", err);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <section className="mx-auto w-full max-w-[80vw] py-2 sm:px-4 sm:py-4 lg:px-6">
            <HomeHero
                title1={t("home.hero_title_1")}
                title2={t("home.hero_title_2")}
                title3={t("home.hero_title_3")}
                subtitle={t("home.hero_subtitle")}
                ctaLabel={t("home.hero_cta")}
            />

            {/* AI Assistant */}
            <div className="mx-auto mt-16 w-full">
                <div className="p-[2px] rounded-3xl" style={{ background: "linear-gradient(90deg, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6, #ec4899)" }}>
                    <Link
                        to="/chats"
                        className="group flex items-start gap-6 p-6 sm:p-8 bg-white dark:bg-[#1f1f1f] rounded-[22px] shadow-sm hover:shadow-md transition-all duration-300 w-full"
                    >
                        <div className="shrink-0 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white group-hover:bg-[#1f4865] group-hover:text-white transition-colors duration-300">
                            <HugeiconsIcon icon={AiChat02Icon} className="h-7 w-7" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h3 className="text-xl sm:text-2xl font-medium text-slate-900 dark:text-white mb-2 group-hover:text-[#1f4865] dark:group-hover:text-[#5b9abf] transition-colors">
                                AI Assistant
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                Chat with an AI that can look up visas, countries, and services, and help manage your checklists and budgets.
                            </p>
                        </div>
                    </Link>
                </div>
            </div>

            <HomeTools t={t} />

            <HomeDestinations
                popularDestinations={popularDestinations}
                translatedNames={translatedNames}
                translatedVisaTexts={translatedVisaTexts}
                t={t}
            />

            <HomeGuides translatedGuides={translatedGuides} />

            <HomeTrip t={t} />
        </section>
    );
}
