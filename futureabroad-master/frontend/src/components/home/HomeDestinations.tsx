import { Link } from "react-router-dom";

export default function HomeDestinations({
  popularDestinations,
  translatedNames,
  translatedVisaTexts,
  t,
}: {
  popularDestinations: any[];
  translatedNames: string[];
  translatedVisaTexts: string[];
  t: any;
}) {
  return (
    <section className="mx-auto mt-24 w-full max-w-[80vw] sm:px-4 lg:px-6">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">{t("home.destinations_title")}</h2>
          <p className="mt-2 text-muted-foreground">{t("home.destinations_subtitle")}</p>
        </div>
        <Link to="/visas#world-of-possibilities" className="mt-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
          {t("home.destinations_view_all")}
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {popularDestinations.map((destination: any, i: number) => (
          <Link
            key={destination.name}
            to={`/countries/${destination.id ?? encodeURIComponent(destination.name)}`}
            className="group block"
          >
            <article className="overflow-hidden rounded-[1.5rem] bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg cursor-pointer h-full">
              <div className="relative h-56 overflow-hidden pointer-events-none">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white pointer-events-none">
                  <div className="inline-flex items-center gap-2">
                    {destination.flag_url ? (
                      <img src={destination.flag_url} alt={`${destination.name} flag`} className="h-6 w-auto rounded shadow-sm" />
                    ) : (
                      <span className="text-2xl">{destination.flag}</span>
                    )}
                    <h3 className="text-2xl font-semibold">{translatedNames[i] || destination.name}</h3>
                  </div>
                  <p className="mt-1 text-sm text-white/85">
                    {translatedVisaTexts[i] || (destination.visasCount > 0
                      ? t("home.visa_schemes", { count: destination.visasCount })
                      : t("home.no_visas_listed"))}
                  </p>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
