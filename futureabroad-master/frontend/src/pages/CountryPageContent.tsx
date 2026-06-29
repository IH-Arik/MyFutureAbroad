import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Country, Visa, Service } from "@/lib/types";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { TaxCalculator } from "@/components/TaxCalculator";
import CountryHeader from "@/components/country/CountryHeader";
import CountryLongDescription from "@/components/country/CountryLongDescription";
import CountryVisas from "@/components/country/CountryVisas";
import CountryServices from "@/components/country/CountryServices";
import { useTranslatedVisas } from "@/hooks/useTranslatedVisas";
import { useTranslatedServices } from "@/hooks/useTranslatedServices";
import { useTranslatedCountry } from "@/hooks/useTranslatedCountry";

interface CountryEnrichment {
  pros_for_expats?: string[];
  cons_for_expats?: string[];
  average_property_price_city_centre_per_sqm_amount?: number | null;
  average_property_price_city_centre_per_sqm_currency?: string | null;
  public_transport_description?: string | null;
  international_schools_available?: boolean | null;
  school_fees_description?: string | null;
  average_monthly_rent_city_centre_1bed_amount?: number | null;
  average_monthly_rent_city_centre_1bed_currency?: string | null;
  converted_rent_amount?: number | null;
  converted_property_price_amount?: number | null;
  converted_currency?: string | null;
}

export default function CountryPageContent() {
  const { t } = useTranslation();
  const { countryId } = useParams<{ countryId: string }>();
  const [country, setCountry] = useState<Country | null>(null);
  const [visas, setVisas] = useState<Visa[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLongDescription, setExpandedLongDescription] = useState(false);
  const [expandedVisas, setExpandedVisas] = useState(false);
  const [enrichment, setEnrichment] = useState<CountryEnrichment | null>(null);
  const [enrichmentLoading, setEnrichmentLoading] = useState(false);

  useEffect(() => {
    if (!countryId) return;

    const fetchCountryAndVisas = async () => {
      setLoading(true);
      try {
        let cdata: Country | null = null;

        // If the param is numeric treat it as an id, otherwise try matching by name
        if (/^\d+$/.test(countryId)) {
          const { data, error } = await supabase
            .from("countries")
            .select("*")
            .eq("id", Number(countryId))
            .single();
          if (error) throw error;
          cdata = data as Country;
        } else {
          const name = decodeURIComponent(countryId);
          const { data, error } = await supabase
            .from("countries")
            .select("*")
            .ilike("name", name);
          if (error) throw error;
          if (Array.isArray(data)) {
            cdata = data.find((d: Country) => d.name.toLowerCase() === name.toLowerCase()) || data[0] || null;
          } else {
            cdata = (data as Country) || null;
          }
        }

        setCountry(cdata);

        if (cdata) {
          const { data: visasData, error: visasError } = await supabase
            .from("visas")
            .select("*")
            .eq("country_id", cdata.id);
          if (visasError) throw visasError;
          setVisas((visasData as Visa[]) || []);
          // Fetch services associated via join table (avoid relying on PostgREST relationship names)
          try {
            const { data: svcRows, error: svcRowsErr } = await supabase
              .from("service_countries")
              .select("service_id")
              .eq("country_id", cdata.id);
            if (svcRowsErr) throw svcRowsErr;

            const serviceIds = (svcRows || []).map((r: any) => r.service_id).filter(Boolean);

            if (serviceIds.length > 0) {
              const { data: svcs, error: svcsErr } = await supabase
                .from("services")
                .select("*")
                .in("id", serviceIds as string[]);
              if (svcsErr) throw svcsErr;
              setServices(svcs || []);
            } else {
              // Fallback: query services where applicable_countries contains this country id
              const { data: svcs, error: svcsErr } = await supabase
                .from("services")
                .select("*")
                .contains("applicable_countries", [cdata.id]);
              if (svcsErr) throw svcsErr;
              setServices(svcs || []);
            }
          } catch (err) {
            console.error("Error fetching services for country:", err);
            setServices([]);
          }
        } else {
          setVisas([]);
        }
      } catch (err) {
        console.error("Error fetching country or visas:", err);
        setCountry(null);
        setVisas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCountryAndVisas();
  }, [countryId]);

  // Lazy-load AI enrichment data after country is known.
  // If pros/cons are already stored in Supabase (populated by the weekly pipeline),
  // seed enrichment immediately from DB to avoid a slow Gemini round-trip.
  useEffect(() => {
    if (!country) return;

    // Seed from DB fields if available so the section renders instantly
    if (country.pros_for_expats?.length || country.cons_for_expats?.length) {
      setEnrichment((prev) => ({
        ...prev,
        pros_for_expats: country.pros_for_expats,
        cons_for_expats: country.cons_for_expats,
      }));
    }

    // Still fetch enrichment for the living-details cards (property, transport, schools)
    // that are not stored in the countries table
    const slug = country.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (!slug) return;
    setEnrichmentLoading(true);
    fetch(`/api/chat/country-enrichment/${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setEnrichment((prev) => ({
            ...prev,
            ...data,
            // DB values take priority over enrichment API for pros/cons
            pros_for_expats: country.pros_for_expats?.length ? country.pros_for_expats : data.pros_for_expats,
            cons_for_expats: country.cons_for_expats?.length ? country.cons_for_expats : data.cons_for_expats,
          }));
        }
      })
      .catch(() => {})
      .finally(() => setEnrichmentLoading(false));
  }, [country]);

  const translatedVisas = useTranslatedVisas(visas);
  const translatedServices = useTranslatedServices(services);
  const translatedCountry = useTranslatedCountry(country);

  if (loading) return <div className="text-center py-20 text-slate-500">{t("country.loading")}</div>;
  if (!country) return <div className="text-center py-20 text-slate-500">{t("country.not_found")}</div>;

  return (
    <div className="mx-auto w-full max-w-[80vw] py-8 sm:px-4 lg:px-6">
      <Link to="/visas" className="text-slate-500 hover:text-slate-900 inline-flex items-center gap-2 mb-4 group transition-colors">
        {t("country.back")}
      </Link>

      {/* Grid layout: left content (2/3) + right sticky cards (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header with Flag, Country Name, and ISO */}
          <CountryHeader country={country} translatedCountry={translatedCountry} />

          {/* Long Description Section */}
          {country.longdescription && (
            <CountryLongDescription longDescriptionText={translatedCountry?.longdescription ?? country.longdescription} name={translatedCountry?.name ?? country.name} expanded={expandedLongDescription} onToggle={() => setExpandedLongDescription(!expandedLongDescription)} t={t} />
          )}

          {/* AI Enrichment: Pros & Cons for Expats */}
          {(enrichmentLoading || enrichment?.pros_for_expats?.length || enrichment?.cons_for_expats?.length) && (
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">For Expats</h2>
              {enrichmentLoading && !enrichment ? (
                <div className="text-sm text-muted-foreground animate-pulse">Loading AI insights…</div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {enrichment?.pros_for_expats && enrichment.pros_for_expats.length > 0 && (
                    <div className="rounded-lg border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/20 p-4">
                      <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Advantages</h3>
                      <ul className="space-y-1">
                        {enrichment.pros_for_expats.map((pro, i) => (
                          <li key={i} className="text-sm text-emerald-800 dark:text-emerald-300 flex gap-2">
                            <span className="shrink-0 mt-0.5">✓</span>{pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {enrichment?.cons_for_expats && enrichment.cons_for_expats.length > 0 && (
                    <div className="rounded-lg border border-rose-200 dark:border-rose-800/50 bg-rose-50 dark:bg-rose-900/20 p-4">
                      <h3 className="text-sm font-semibold text-rose-700 dark:text-rose-400 mb-2">Challenges</h3>
                      <ul className="space-y-1">
                        {enrichment.cons_for_expats.map((con, i) => (
                          <li key={i} className="text-sm text-rose-800 dark:text-rose-300 flex gap-2">
                            <span className="shrink-0 mt-0.5">✗</span>{con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* AI Enrichment: Property, Transport, Education */}
          {enrichment && (enrichment.average_property_price_city_centre_per_sqm_amount || enrichment.public_transport_description || enrichment.international_schools_available !== null) && (
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Living Details</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {enrichment.average_property_price_city_centre_per_sqm_amount && (
                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground mb-1">Property (city centre / m²)</p>
                    <p className="text-lg font-semibold text-foreground">
                      {enrichment.converted_property_price_amount
                        ? `${enrichment.converted_currency} ${enrichment.converted_property_price_amount.toLocaleString()}`
                        : `${enrichment.average_property_price_city_centre_per_sqm_currency ?? ""} ${enrichment.average_property_price_city_centre_per_sqm_amount.toLocaleString()}`}
                    </p>
                  </div>
                )}
                {enrichment.average_monthly_rent_city_centre_1bed_amount && (
                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground mb-1">Rent 1-bed (city centre / mo)</p>
                    <p className="text-lg font-semibold text-foreground">
                      {enrichment.converted_rent_amount
                        ? `${enrichment.converted_currency} ${enrichment.converted_rent_amount.toLocaleString()}`
                        : `${enrichment.average_monthly_rent_city_centre_1bed_currency ?? ""} ${enrichment.average_monthly_rent_city_centre_1bed_amount.toLocaleString()}`}
                    </p>
                  </div>
                )}
                {enrichment.international_schools_available !== null && enrichment.international_schools_available !== undefined && (
                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground mb-1">International Schools</p>
                    <p className="text-lg font-semibold text-foreground">
                      {enrichment.international_schools_available ? "Available" : "Limited"}
                    </p>
                    {enrichment.school_fees_description && (
                      <p className="text-xs text-muted-foreground mt-1">{enrichment.school_fees_description}</p>
                    )}
                  </div>
                )}
              </div>
              {enrichment.public_transport_description && (
                <div className="mt-4 rounded-lg border border-border bg-card p-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Public Transport</p>
                  <p className="text-sm text-foreground">{enrichment.public_transport_description}</p>
                </div>
              )}
            </section>
          )}

          {/* Visas Section */}
          <CountryVisas translatedVisas={translatedVisas} expanded={expandedVisas} onToggle={() => setExpandedVisas(!expandedVisas)} t={t} countryName={translatedCountry?.name ?? country.name} />

          {/* Tax Calculator Section */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">{t("country.tax_calculator")}</h2>
            <div className="max-w-xl">
              <TaxCalculator countryCode={country.iso_code} countryName={translatedCountry?.name ?? country.name} />
            </div>
          </section>

          {/* Services Section */}
          <CountryServices translatedServices={translatedServices} t={t} countryName={translatedCountry?.name ?? country.name} />

          {/* Citizenship Requirements Section */}
          {Object.keys(country.citizenship_requirements ?? {}).length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">{t("country.citizenship_residency")}</h2>
              <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1f1f1f] overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {Object.entries(translatedCountry?.citizenship_requirements ?? country.citizenship_requirements ?? {}).map(([category, info], index) => (
                      <tr
                        key={category}
                        className={`border-b border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition ${
                          index === Object.keys(translatedCountry?.citizenship_requirements ?? country.citizenship_requirements ?? {}).length - 1 ? "border-b-0" : ""
                        }`}
                      >
                        <td className="w-40 px-6 py-4 text-left">
                          <div className="flex items-center gap-3">
                            {typeof info.icon === 'string' && info.icon.startsWith('hgi-') ? (
                              <i className={`hgi-stroke ${info.icon} text-3xl`} aria-hidden="true" />
                            ) : (
                              <span className="text-2xl">{info.icon}</span>
                            )}
                            <span className="font-semibold text-slate-900 dark:text-white text-sm">{category}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-left">
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown
                              components={{
                                p: ({ node, ...props }) => <p className="text-sm text-slate-700 dark:text-slate-300 m-0" {...props} />,
                                strong: ({ node, ...props }) => <strong className="font-semibold text-slate-900 dark:text-white" {...props} />,
                                em: ({ node, ...props }) => <em className="italic text-slate-600 dark:text-slate-400" {...props} />,
                              }}
                            >
                              {info.desc}
                            </ReactMarkdown>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        {/* Right column: sticky cards */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            {country.tax_advice && (
              <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1f1f1f] p-4">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">{t("country.tax_advice")}</h4>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400" {...props} />,
                      li: ({ node, ...props }) => <li className="text-slate-600 dark:text-slate-400" {...props} />,
                      p: ({ node, ...props }) => <p className="text-sm text-slate-600 dark:text-slate-400" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-semibold text-slate-900 dark:text-white" {...props} />,
                    }}
                  >
                    {translatedCountry?.tax_advice ?? country.tax_advice}
                  </ReactMarkdown>
                </div>
              </div>
            )}
            <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1f1f1f] p-4">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">{t("country.local_tips")}</h4>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400" {...props} />,
                    li: ({ node, ...props }) => <li className="text-slate-600 dark:text-slate-400" {...props} />,
                    p: ({ node, ...props }) => <p className="text-sm text-slate-600 dark:text-slate-400" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-semibold text-slate-900 dark:text-white" {...props} />,
                  }}
                >
                  {translatedCountry?.local_tips ?? country.local_tips ?? "Short helpful tips for moving or applying for citizenship in this country."}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
