export default function TravelPromo({ t }: { t: (k: string) => string }) {
  const cities = [
    { img: "https://images.unsplash.com/photo-1578859651203-c7126a106b59?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Lisbon", location: "Lisbon, Portugal", url: "https://www.trip.com/hotels/w/home?Allianceid=7932030&SID=298207806&trip_sub1=&trip_sub3=D14321036", height: "h-48" },
    { img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80", alt: "London", location: "London, UK", url: "https://www.trip.com/hotels/w/home?Allianceid=7932030&SID=298207806&trip_sub1=&trip_sub3=D14321036", height: "h-32" },
    { img: "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Berlin", location: "Berlin, Germany", url: "https://www.trip.com/hotels/w/home?Allianceid=7932030&SID=298207806&trip_sub1=&trip_sub3=D14321036", height: "h-32" },
    { img: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Barcelona", location: "Barcelona, Spain", url: "https://www.trip.com/hotels/w/home?Allianceid=7932030&SID=298207806&trip_sub1=&trip_sub3=D14321036", height: "h-48" },
  ];

  return (
    <section className="grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center py-20">
      <div>
        <h2 className="text-4xl font-medium leading-[0.9] tracking-[-0.02em] text-foreground sm:text-5xl">
          {t("travel.trip_title_1")}
          <br />
          {t("travel.trip_title_2")}
        </h2>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">{t("travel.trip_subtitle")}</p>
        <div className="mt-8">
          <a
            href="https://www.trip.com/?Allianceid=7932030&SID=298207806&trip_sub1=&trip_sub3=D14318110"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#8B6949] to-[#D4C2A1] px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl inline-flex items-center gap-2"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t("travel.trip_cta")}
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#9c7a58] to-[#e2d2b3] opacity-0 transition-opacity group-hover:opacity-100" />
          </a>
        </div>
      </div>

      <div className="columns-2 gap-3">
        {cities.map((city, index) => (
          <a
            key={index}
            href={city.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative overflow-hidden rounded-2xl group block ${city.height} break-inside-avoid mb-3`}
          >
            <img src={city.img} alt={city.alt} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
            <div className="absolute bottom-3 left-3 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1">
              <span className="text-xs font-medium text-black">{city.location}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
