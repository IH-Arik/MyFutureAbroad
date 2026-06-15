import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import type { Resource } from "@/lib/types";
import { useTranslatedResources } from "@/hooks/useTranslatedResources";
import TravelTabs from "@/components/travel/TravelTabs";
import TravelPromo from "@/components/travel/TravelPromo";
import TravelArticles from "@/components/travel/TravelArticles";


export default function TravelPageContent() {
    const { t } = useTranslation();
    const [travelGuides, setTravelGuides] = useState<Resource[]>([]);
    const translatedGuides = useTranslatedResources(travelGuides);

    useEffect(() => {
        supabase
            .from("resources")
            .select("id, title, excerpt, tags, reading_time_minutes, type, cover_image")
            .eq("published", true)
            .contains("tags", ["Travel"])
            .order("created_at", { ascending: false })
            .then(({ data }) => setTravelGuides((data as Resource[]) || []));
    }, []);

    return (
        <section className="mx-auto w-full max-w-[80vw] py-4 sm:px-4 sm:py-8 lg:px-6">

            {/* Hero */}
            <section className="relative mx-auto mt-12 w-full max-w-[80vw] overflow-hidden rounded-[2rem] py-12 sm:py-32 text-center">
                <img
                    alt="Travel abroad"
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1800&q=80"
                />
                <div className="absolute inset-0 bg-black/55" />
                <div className="relative z-10 mx-auto max-w-5xl px-6">
                    <h1 className="text-2xl font-medium leading-[0.85] tracking-[-0.02em] text-white sm:text-4xl lg:text-6xl xl:text-7xl">
                        {t("travel.hero_title_1")}
                        <br />
                        {t("travel.hero_title_2")}
                    </h1>
                    <p className="mt-4 sm:mt-6 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed text-white/90">
                        {t("travel.hero_subtitle")}
                    </p>
                </div>
            </section>

            {/* Tabs */}
            <TravelTabs t={t} />

            {/* Promo */}
            <TravelPromo t={t} />

            {/* Articles section */}
            <TravelArticles translatedGuides={translatedGuides} t={t} />

        </section>
    );
}
