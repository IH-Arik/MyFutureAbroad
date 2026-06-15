import type { ServiceType } from "@/lib/types";
import ServiceCard from "@/components/services/ServiceCard";
import { ServiceTypeCard } from "@/components/service/ServiceTypeCard";
import { Shield02Icon, Edit01Icon, Mail01Icon, SecurityCheckIcon, Book01Icon } from "@hugeicons/core-free-icons";

type Strings = { title: string; subtitle: string; desc: string };

export default function ServicesGrid({
  loading,
  insuranceStrings,
  translationStrings,
  mailStrings,
  vpnStrings,
  mondlyStrings,
  translatedCategories,
  counts,
  t,
}: {
  loading: boolean;
  insuranceStrings: Strings;
  translationStrings: Strings;
  mailStrings: Strings;
  vpnStrings: Strings;
  mondlyStrings: Strings;
  translatedCategories: ServiceType[];
  counts: Record<string, number>;
  t: (k: string) => string;
}) {
  return (
    <>
      <style>{`
        .translation-card:hover > div:first-child {
          background-color: #DCAE1D;
          color: white;
        }
        .translation-card:hover h3 {
          color: #DCAE1D;
        }
        .mail-card:hover > div:first-child {
          background-color: #059669;
          color: white;
        }
        .mail-card:hover h3 {
          color: #059669;
        }
        .vpn-card:hover > div:first-child {
          background-color: #2563EB;
          color: white;
        }
        .vpn-card:hover h3 {
          color: #2563EB;
        }
        .mondly-card:hover > div:first-child {
          background-color: #7C3AED;
          color: white;
        }
        .mondly-card:hover h3 {
          color: #7C3AED;
        }
      `}</style>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <div className="col-span-full text-center py-20 text-slate-500 dark:text-slate-400">{t("services.loading")}</div>
        ) : (
          <>
            <ServiceCard to="/insurance" icon={Shield02Icon} title={insuranceStrings.title} subtitle={insuranceStrings.subtitle} desc={insuranceStrings.desc} cardClass="" />

            <ServiceCard to="/translation" icon={Edit01Icon} title={translationStrings.title} subtitle={translationStrings.subtitle} desc={translationStrings.desc} cardClass="translation-card" />

            <ServiceCard to="/mail" icon={Mail01Icon} title={mailStrings.title} subtitle={mailStrings.subtitle} desc={mailStrings.desc} cardClass="mail-card" />

            <ServiceCard to="/vpn" icon={SecurityCheckIcon} title={vpnStrings.title} subtitle={vpnStrings.subtitle} desc={vpnStrings.desc} cardClass="vpn-card" />

            <ServiceCard to="/mondly" icon={Book01Icon} title={mondlyStrings.title} subtitle={mondlyStrings.subtitle} desc={mondlyStrings.desc} cardClass="mondly-card" />

            {translatedCategories.map((category) => (
              <ServiceTypeCard key={category.id} category={category} count={counts[category.id] ?? 0} />
            ))}
          </>
        )}
      </section>
    </>
  );
}
