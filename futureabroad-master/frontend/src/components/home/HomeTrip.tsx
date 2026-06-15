

export default function HomeTrip({ t }: { t: any }) {
  return (
    <section className="mx-auto mt-16 w-full max-w-[80vw] sm:px-4 lg:px-6">
      <h2 className="text-3xl font-semibold text-foreground sm:text-4xl mb-1">{t("home.trip_title")}</h2>
      <p className="mt-2 text-muted-foreground mb-6">{t("home.trip_subtitle")}</p>
      <a
        href="https://www.trip.com/?Allianceid=7932030&SID=298207806&trip_sub1=&trip_sub3=D14318110"
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8B6949] to-[#D4C2A1] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:from-[#9c7a58] hover:to-[#e2d2b3]"
      >
        {t("home.trip_cta")}
        <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </section>
  );
}
