import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import type { Service, ServiceType } from "@/lib/types";
import ServiceFormFields from "@/components/provider/ServiceFormFields";
import ServiceFormActions from "@/components/provider/ServiceFormActions";

export default function ServiceModalContent({
  providerId,
  service,
  serviceTypes,
  onSave,
  onClose,
}: {
  providerId: string;
  service: Service | null;
  serviceTypes: ServiceType[];
  onSave: (s: Service) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const PRICE_TYPES = [
    { value: "fixed", label: t("services.fixed_price") },
    { value: "starting_at", label: t("services.starting_at") },
    { value: "hourly", label: t("services.per_hour") },
  ];
  const [title, setTitle] = useState(service?.title ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [serviceType, setServiceType] = useState(service?.service_type ?? "");
  const [priceUsd, setPriceUsd] = useState(String(service?.price_usd ?? ""));
  const [serviceCurrency, setServiceCurrency] = useState<string>(service?.currency ?? "USD");
  const [priceType, setPriceType] = useState<Service["price_type"]>(service?.price_type ?? "fixed");
  const [deliveryDays, setDeliveryDays] = useState(String(service?.delivery_days ?? ""));
  const [includesText, setIncludesText] = useState((service?.includes ?? []).join("\n"));
  const [requirementsText, setRequirementsText] = useState((service?.requirements ?? []).join("\n"));
  const [applicableCountries, setApplicableCountries] = useState<number[]>(service?.applicable_countries ?? []);
  const [serviceLanguages, setServiceLanguages] = useState<string[]>(service?.languages ?? []);
  const [allCountries, setAllCountries] = useState<{ id: number; name: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("countries").select("id, name").order("name").then(({ data }) => {
      if (data) setAllCountries(data as { id: number; name: string }[]);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      provider_id: providerId,
      title,
      description,
      service_type: serviceType,
      price_usd: parseFloat(priceUsd) || 0,
      currency: serviceCurrency || "USD",
      price_type: priceType,
      delivery_days: parseInt(deliveryDays) || null,
      includes: includesText.split("\n").map(s => s.trim()).filter(Boolean),
      requirements: requirementsText.split("\n").map(s => s.trim()).filter(Boolean),
      applicable_countries: applicableCountries.length > 0 ? applicableCountries : null,
      languages: serviceLanguages.length > 0 ? serviceLanguages : null,
      active: service?.active ?? true,
    };

    if (service) {
      const { data, error: err } = await supabase
        .from("services").update(payload).eq("id", service.id).select().single();
      if (err || !data) { setError(err?.message ?? "Failed to save"); setSaving(false); return; }
      onSave(data as Service);
    } else {
      const { data, error: err } = await supabase
        .from("services").insert(payload).select().single();
      if (err || !data) { setError(err?.message ?? "Failed to create"); setSaving(false); return; }
      onSave(data as Service);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border/50 bg-white shadow-xl dark:bg-[#1a1a1a] dark:border-white/10">
        <div className="sticky top-0 flex items-center justify-between border-b border-border/40 bg-white px-6 py-4 dark:bg-[#1a1a1a]">
          <h2 className="text-lg font-semibold">{service ? t("provider.edit_service") : t("provider.create_service")}</h2>
          <button onClick={onClose} className="rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && <div className="mx-6 mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <ServiceFormFields
            t={t}
            serviceTypes={serviceTypes}
            PRICE_TYPES={PRICE_TYPES}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            serviceType={serviceType}
            setServiceType={setServiceType}
            priceUsd={priceUsd}
            setPriceUsd={setPriceUsd}
            serviceCurrency={serviceCurrency}
            setServiceCurrency={setServiceCurrency}
            priceType={priceType}
            setPriceType={setPriceType}
            deliveryDays={deliveryDays}
            setDeliveryDays={setDeliveryDays}
            includesText={includesText}
            setIncludesText={setIncludesText}
            requirementsText={requirementsText}
            setRequirementsText={setRequirementsText}
            allCountries={allCountries}
            applicableCountries={applicableCountries}
            setApplicableCountries={setApplicableCountries}
            serviceLanguages={serviceLanguages}
            setServiceLanguages={setServiceLanguages}
          />

          <ServiceFormActions saving={saving} service={service} onClose={onClose} t={t} />
        </form>
      </div>
    </div>
  );
}
