import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import type { Service, ServiceType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import ServiceModal from "@/components/provider/ServiceModal";
import { LANGUAGES } from "@/components/provider/LanguagesCard";

export default function ServicesPanel({ providerId, providerStatus }: { providerId: string; providerStatus?: string }) {
  const { t } = useTranslation();
  const { formatAmount } = useCurrency();
  const [services, setServices] = useState<Service[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null | "new">(null);

  useEffect(() => {
    Promise.all([
      supabase.from("services").select("*").eq("provider_id", providerId).order("created_at", { ascending: false }),
      supabase.from("service_types").select("*").order("name"),
    ]).then(([{ data: svcData }, { data: typeData }]) => {
      setServices((svcData as Service[]) ?? []);
      setServiceTypes((typeData as ServiceType[]) ?? []);
      setLoading(false);
    });
  }, [providerId]);

  const toggleActive = async (serviceId: string, active: boolean) => {
    await supabase.from("services").update({ active }).eq("id", serviceId);
    setServices(prev => prev.map(s => s.id === serviceId ? { ...s, active } : s));
  };

  const deleteService = async (serviceId: string) => {
    if (!confirm(t("provider.delete_service_confirm"))) return;
    await supabase.from("services").delete().eq("id", serviceId);
    setServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const handleSave = (saved: Service) => {
    setServices(prev => {
      const idx = prev.findIndex(s => s.id === saved.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next; }
      return [saved, ...prev];
    });
    setEditingService(null);
  };

  if (loading) return <div className="p-6 text-sm text-muted-foreground">{t("provider.loading_services")}</div>;

  return (
    <>
      {providerStatus === "pending" && (
        <div className="mx-6 mt-6 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-900/20 dark:text-yellow-300">
          <span className="font-medium">{t("provider.pending_approval")}</span> {t("provider.pending_approval_desc")}
        </div>
      )}
      <div className="p-6 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">{services.length} service{services.length !== 1 ? "s" : ""}</p>
          <Button size="sm" className="rounded-full h-8" onClick={() => setEditingService("new")}>
            + {t("provider.new_service")}
          </Button>
        </div>

        {services.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 p-10 text-center">
            <p className="text-sm text-muted-foreground mb-3">{t("provider.no_services")}</p>
            <Button size="sm" variant="outline" className="rounded-full" onClick={() => setEditingService("new")}>
              {t("provider.create_first_service")}
            </Button>
          </div>
        ) : (
          services.map(service => (
            <div
              key={service.id}
              className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-border/40 bg-white p-4 shadow-sm dark:bg-[#242424] dark:border-white/10"
            >
              <div className="flex gap-4 min-w-0">
                {service.image_url && (
                  <img src={service.image_url} alt={service.title} className="size-14 rounded-lg object-cover shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="font-semibold truncate">{service.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                  {service.languages && service.languages.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {service.languages.map(code => (
                        <span key={code} className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                          {LANGUAGES.find(l => l.code === code)?.name ?? code.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="mt-1 text-sm font-medium">
                    {formatAmount(service.price_usd, service.currency || "USD")}
                    <span className="ml-1 text-xs text-muted-foreground font-normal">{service.currency || "USD"}</span>
                    {service.price_type === "hourly" ? "/hr" : service.price_type === "starting_at" ? " starting" : ""}
                    {service.delivery_days ? <span className="ml-2 text-muted-foreground font-normal">· {service.delivery_days}d delivery</span> : null}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={service.active ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : "bg-muted text-muted-foreground"}>
                  {service.active ? t("provider.active") : t("provider.inactive")}
                </span>
                <Button variant="outline" size="sm" className="h-7 rounded-full px-3 text-xs" onClick={() => setEditingService(service)}>
                  {t("common.edit")}
                </Button>
                <Button variant="outline" size="sm" className="h-7 rounded-full px-3 text-xs" onClick={() => toggleActive(service.id, !service.active)}>
                  {service.active ? t("provider.deactivate") : t("provider.activate")}
                </Button>
                <button onClick={() => deleteService(service.id)} className="ml-1 rounded-full p-1 text-muted-foreground hover:text-destructive transition-colors">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {editingService !== null && (
        <ServiceModal
          providerId={providerId}
          service={editingService === "new" ? null : editingService}
          serviceTypes={serviceTypes}
          onSave={handleSave}
          onClose={() => setEditingService(null)}
        />
      )}
    </>
  );
}
