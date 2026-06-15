import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Service, Provider, Country } from "@/lib/types";
import { useAuth } from "@/components/auth-context";
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import { ServiceDetailHeader } from "@/components/service/ServiceDetailHeader";
import { ServiceIncludes, ServiceRequirements } from "@/components/service/ServiceDetailComponents";
import { ServiceSidebar } from "@/components/service/ServiceSidebar";
import { ServiceReviews } from "@/components/service/ServiceReviews";
import { useTranslation } from "react-i18next";
import { useTranslatedService } from "@/hooks/useTranslatedService";
import { translateTexts } from "@/lib/deepl";

export function ServicePage() {
    const { t, i18n } = useTranslation();
    const { categoryId, serviceId } = useParams<{ categoryId: string, serviceId: string }>();
    const [service, setService] = useState<Service | null>(null);
    const translatedService = useTranslatedService(service);
    const [provider, setProvider] = useState<Provider | null>(null);
    const [translatedProvider, setTranslatedProvider] = useState<Provider | null>(null);
    const [serviceCountries, setServiceCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!provider) { setTranslatedProvider(null); return; }
        setTranslatedProvider(provider);
        const lang = i18n.language;
        if (lang === "en" || !provider.description) return;
        translateTexts([provider.description], lang).then(([desc]) => {
            setTranslatedProvider((p) => p ? { ...p, description: desc } : p);
        });
    }, [provider, i18n.language]);

    useEffect(() => {
        const fetchService = async () => {
            if (!serviceId) return;
            try {
                const { data, error } = await supabase
                    .from("services")
                    .select(`
                        *,
                        provider:providers(*)
                    `)
                    .eq("id", serviceId)
                    .single();
                
                if (error) throw error;

                // Only show services from active providers
                if ((data.provider as any)?.status !== 'active') {
                    throw new Error('This service is not available');
                }

                setService(data as Service);
                if (data.provider) setProvider(data.provider as Provider);

                // Fetch associated countries via join table (avoid relying on PostgREST relationship names)
                try {
                    const { data: scRows, error: scRowsErr } = await supabase
                        .from("service_countries")
                        .select("country_id")
                        .eq("service_id", serviceId);

                    if (scRowsErr) throw scRowsErr;

                    const countryIds = (scRows || []).map((r: any) => r.country_id).filter(Boolean);

                    if (countryIds.length > 0) {
                        const { data: countries, error: countriesErr } = await supabase
                            .from("countries")
                            .select("*")
                            .in("id", countryIds as number[]);
                        if (countriesErr) throw countriesErr;
                        setServiceCountries(countries || []);
                    } else if (data?.applicable_countries && Array.isArray(data.applicable_countries) && data.applicable_countries.length > 0) {
                        // Fallback: use the legacy applicable_countries array column
                        const { data: countries, error: countriesErr } = await supabase
                            .from("countries")
                            .select("*")
                            .in("id", data.applicable_countries as number[]);
                        if (countriesErr) throw countriesErr;
                        setServiceCountries(countries || []);
                    }
                } catch (err) {
                    console.error("Error fetching service countries:", err);
                    // best-effort fallback: try legacy column
                    try {
                        if (data?.applicable_countries && Array.isArray(data.applicable_countries) && data.applicable_countries.length > 0) {
                            const { data: countries, error: countriesErr } = await supabase
                                .from("countries")
                                .select("*")
                                .in("id", data.applicable_countries as number[]);
                            if (!countriesErr) setServiceCountries(countries || []);
                        }
                    } catch (e) {
                        // swallow fallback errors
                    }
                }

            } catch (error) {
                console.error("Error fetching service:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [serviceId]);

    async function handleBook() {
        if (!service || !provider) return;
        if (!user) {
            const returnUrl = `/services/${categoryId}/${serviceId}`;
            navigate(`/login?redirect=${encodeURIComponent(returnUrl)}`);
            return;
        }
        setBooking(true);
        try {
            // Create a message thread for this service interaction
            const { data: thread, error: threadErr } = await supabase
                .from("message_threads")
                .insert({ client_id: user.id, service_id: service.id, provider_id: provider.id })
                .select("id")
                .single();
            if (threadErr || !thread) throw threadErr;

            navigate(`/messages?thread=${thread.id}`);
        } catch (err) {
            console.error("Booking error:", err);
            setBooking(false);
        }
    }

    if (loading) return <div className="text-center py-20 text-slate-500">{t("services.service_loading")}</div>;
    if (!service || !translatedService) return <div className="text-center py-20 text-slate-500">{t("services.service_not_found")}</div>;

    return (
        <div className="mx-auto w-full max-w-[80vw] py-8 space-y-8 sm:px-4 lg:px-6">
            <Link to={`/services/${categoryId}`} className="text-slate-500 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-2 mb-4 group transition-colors">
                    <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                {t("services.service_back")} {categoryId?.replace('_', ' ')}
            </Link>

            <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                {/* Main Content */}
                <div className="space-y-8">
                    <ServiceDetailHeader service={translatedService} />

                    {/* Image if available */}
                    {translatedService.image_url && (
                        <div className="rounded-2xl overflow-hidden shadow-sm">
                            <img src={translatedService.image_url} alt={translatedService.title} className="w-full h-64 object-cover" />
                        </div>
                    )}

                    <ServiceIncludes includes={translatedService.includes} />
                    <ServiceRequirements requirements={translatedService.requirements} />

                    {/* Reviews Section */}
                    <ServiceReviews serviceId={serviceId!} providerId={provider?.id} />
                </div>

                {/* Sidebar */}
                <div className="space-y-6 self-start sticky top-24">
                    <ServiceSidebar service={translatedService} provider={translatedProvider} onBook={handleBook} booking={booking} countries={serviceCountries} />
                </div>
            </div>
        </div>
    );
}

export default ServicePage;
