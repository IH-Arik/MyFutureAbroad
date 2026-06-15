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

export default function CountryPageContent() {
  const { t } = useTranslation();
  const { countryId } = useParams<{ countryId: string }>();
  const [country, setCountry] = useState<Country | null>(null);
  const [visas, setVisas] = useState<Visa[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLongDescription, setExpandedLongDescription] = useState(false);
  const [expandedVisas, setExpandedVisas] = useState(false);

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
