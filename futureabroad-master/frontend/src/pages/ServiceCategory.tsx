import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import type { ServiceType, Service, Country } from "@/lib/types";
import { ServiceListingCard } from "@/components/service/ServiceListingCard";
import { ServiceFilters } from "@/components/service/ServiceFilters";
import { useTranslation } from "react-i18next";
import { useTranslatedServiceTypes } from "@/hooks/useTranslatedServiceTypes";
import { useTranslatedServices } from "@/hooks/useTranslatedServices";

export function ServiceCategory() {
  const { t } = useTranslation();
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<ServiceType | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<number | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Translate database content when language changes
  const categoryArr = useMemo(() => (category ? [category] : []), [category]);
  const translatedCategoryArr = useTranslatedServiceTypes(categoryArr);
  const translatedCategory = translatedCategoryArr[0] ?? category;
  const translatedServices = useTranslatedServices(services);

  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) return;
      try {
        const [{ data: categoryData, error: catError }, { data: servicesData, error: servError }, { data: countriesData, error: countryError }] = await Promise.all([
          supabase.from("service_types").select("*").eq("id", categoryId).single(),
          supabase.from("services").select("*, provider:providers(*)").eq("service_type", categoryId).eq("active", true),
          supabase.from("countries").select("id, name, flag_url, iso_code").order("name"),
        ]);

        if (catError) throw catError;
        if (servError) throw servError;
        if (countryError) throw countryError;

        setCategory(categoryData);
        // Only show services from active providers
        const activeProviderServices = (servicesData || []).filter(
          service => (service.provider as any)?.status === 'active'
        );
        setServices(activeProviderServices);
        setCountries(countriesData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryId]);

  const q = search.toLowerCase().trim();

  const filteredServices = translatedServices.filter(service => {
    // Text search
    if (q) {
      const matchTitle = service.title.toLowerCase().includes(q);
      const matchDesc = service.description?.toLowerCase().includes(q);
      const matchProvider = service.provider?.company_name?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchProvider) return false;
    }

    // Language filter
    if (selectedLanguages.length > 0) {
      const sl = (service.languages ?? []).map(l => l.toLowerCase());
      const found = selectedLanguages.some(sel => sl.includes(sel));
      if (!found) return false;
    }

    // Country filter
    if (selectedCountry !== "all") {
      const serviceCountries = service.applicable_countries;
      const providerCountries = service.provider?.countries_served;
      if (serviceCountries && serviceCountries.length > 0) return serviceCountries.includes(selectedCountry as number);
      if (providerCountries && providerCountries.length > 0) return providerCountries.includes(selectedCountry as number);
    }
    return true;
  });

  if (loading) return <div className="text-center py-20 text-slate-500">{t("services.category_loading")}</div>;
  if (!category) return <div className="text-center py-20 text-slate-500">{t("services.category_not_found")}</div>;

  return (
    <div className="mx-auto w-full max-w-[80vw] space-y-12 py-4 sm:px-4 sm:py-8 lg:px-6">
      {/* Header */}
      <div className="space-y-4">
        <Link to="/services" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors">
          <HugeiconsIcon icon={ArrowLeft01Icon} className="mr-2 h-4 w-4" />
          {t("services.back_to_services")}
        </Link>
        <h1 className="text-4xl font-medium tracking-tight text-slate-900 dark:text-white sm:text-5xl">{translatedCategory?.name ?? category.name}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">{translatedCategory?.description ?? category.description}</p>
      </div>

      {/* Filters */}
      <ServiceFilters
        search={search}
        onSearchChange={setSearch}
        selectedLanguages={selectedLanguages}
        onLanguagesChange={setSelectedLanguages}
        countries={countries}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
      />

      {/* Services List */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredServices.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
            {selectedCountry === "all" ? t("services.no_services") : t("services.no_services_country")}
          </div>
        ) : (
          filteredServices.map((service) => (
            <ServiceListingCard key={service.id} service={service} category={translatedCategory ?? category!} />
          ))
        )}
      </div>
    </div>
  );
}

export default ServiceCategory;
