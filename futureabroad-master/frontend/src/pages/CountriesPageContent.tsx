import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface Country {
  id: number;
  name: string;
  iso_code: string;
  flag_url: string;
  continent: string;
  description: string;
}

interface CountryMeta {
  budget?: string;
  internet?: string;
  cities: string[];
  tags: string[];
  guidesCount: number;
}

const COUNTRY_METADATA: Record<string, CountryMeta> = {
  AL: {
    budget: "from $900",
    internet: "100 Mbps",
    cities: ["Tirana", "Sarande"],
    tags: ["EU Partner", "Mediterranean"],
    guidesCount: 9
  },
  AR: {
    budget: "from $1,000",
    internet: "50 Mbps",
    cities: ["Buenos Aires", "Mendoza", "Bariloche", "Córdoba"],
    tags: ["Tropical", "Salsa"],
    guidesCount: 9
  },
  AU: {
    budget: "from AUD 3,500",
    internet: "55 Mbps",
    cities: ["Sydney", "Melbourne", "Brisbane", "Perth"],
    tags: ["English ✓", "Oceania"],
    guidesCount: 9
  },
  AT: {
    budget: "from €1,600",
    internet: "120 Mbps",
    cities: ["Vienna", "Graz"],
    tags: ["EU", "Alps", "English ✓"],
    guidesCount: 9
  },
  BH: {
    budget: "from $1,800",
    internet: "155 Mbps",
    cities: ["Manama", "Muharraq"],
    tags: ["Zero Tax", "English ✓"],
    guidesCount: 9
  },
  BD: {
    budget: "from $600",
    internet: "60 Mbps",
    cities: ["Dhaka", "Chittagong"],
    tags: ["English ✓", "Tropical"],
    guidesCount: 9
  },
  PT: {
    budget: "from €1,400",
    internet: "120 Mbps",
    cities: ["Lisbon", "Porto", "Algarve"],
    tags: ["EU", "Schengen", "Sunny"],
    guidesCount: 15
  },
  ES: {
    budget: "from €1,500",
    internet: "150 Mbps",
    cities: ["Madrid", "Barcelona", "Valencia"],
    tags: ["EU", "Schengen", "Sunny"],
    guidesCount: 18
  },
  TH: {
    budget: "from $800",
    internet: "150 Mbps",
    cities: ["Bangkok", "Chiang Mai", "Phuket"],
    tags: ["Southeast Asia", "Tropical", "Expat Hub"],
    guidesCount: 22
  },
  MX: {
    budget: "from $1,100",
    internet: "85 Mbps",
    cities: ["Mexico City", "Playa del Carmen", "Tulum"],
    tags: ["Tropical", "Cuisine"],
    guidesCount: 16
  },
  IT: {
    budget: "from €1,300",
    internet: "100 Mbps",
    cities: ["Rome", "Milan", "Florence"],
    tags: ["EU", "Schengen", "Culture"],
    guidesCount: 14
  },
  DE: {
    budget: "from €1,700",
    internet: "115 Mbps",
    cities: ["Berlin", "Munich", "Frankfurt"],
    tags: ["EU", "Schengen", "Tech Hub"],
    guidesCount: 20
  },
  GB: {
    budget: "from £2,000",
    internet: "95 Mbps",
    cities: ["London", "Manchester", "Edinburgh"],
    tags: ["Europe", "English ✓", "Finance"],
    guidesCount: 10
  },
  FR: {
    budget: "from €1,800",
    internet: "120 Mbps",
    cities: ["Paris", "Nice", "Lyon"],
    tags: ["EU", "Schengen", "Culture"],
    guidesCount: 12
  },
  CA: {
    budget: "from CAD 2,800",
    internet: "130 Mbps",
    cities: ["Toronto", "Vancouver", "Montreal"],
    tags: ["North America", "Nature", "English ✓"],
    guidesCount: 14
  },
  US: {
    budget: "from $3,000",
    internet: "140 Mbps",
    cities: ["New York", "San Francisco", "Austin"],
    tags: ["North America", "Tech Hub", "English ✓"],
    guidesCount: 25
  },
  CR: {
    budget: "from $1,300",
    internet: "75 Mbps",
    cities: ["San José", "Tamarindo"],
    tags: ["Eco-friendly", "Tropical", "Pura Vida"],
    guidesCount: 10
  },
  EC: {
    budget: "from $950",
    internet: "65 Mbps",
    cities: ["Quito", "Cuenca", "Guayaquil"],
    tags: ["USD Currency", "Tropical"],
    guidesCount: 8
  },
  JP: {
    budget: "from ¥180k",
    internet: "180 Mbps",
    cities: ["Tokyo", "Kyoto", "Osaka"],
    tags: ["Culture", "Safety", "Transit"],
    guidesCount: 15
  },
  SG: {
    budget: "from SGD 3,500",
    internet: "220 Mbps",
    cities: ["Singapore"],
    tags: ["Finance", "English ✓", "Clean"],
    guidesCount: 12
  },
  AE: {
    budget: "from AED 8,000",
    internet: "145 Mbps",
    cities: ["Dubai", "Abu Dhabi"],
    tags: ["Tax Free", "English ✓", "Modern"],
    guidesCount: 11
  }
};

const getCountryMetaFallback = (c: { name: string; iso_code: string; continent: string }): CountryMeta => {
  const code = c.iso_code?.toUpperCase() || "";
  const cont = c.continent?.toLowerCase() || "";
  
  if (COUNTRY_METADATA[code]) return COUNTRY_METADATA[code];
  
  let budget = "from $1,200";
  let internet = "75 Mbps";
  let cities = [c.name + " City"];
  let tags = [c.continent];
  
  if (cont.includes("europe")) {
    budget = "from €1,300";
    internet = "90 Mbps";
    tags = ["EU Partner"];
    cities = [c.name + " Capital"];
  } else if (cont.includes("asia")) {
    budget = "from $900";
    internet = "80 Mbps";
    tags = ["Asia"];
    cities = [c.name + " Capital"];
  } else if (cont.includes("america")) {
    budget = "from $1,100";
    internet = "70 Mbps";
    cities = [c.name + " Capital"];
  } else if (cont.includes("africa")) {
    budget = "from $850";
    internet = "45 Mbps";
    cities = [c.name + " Capital"];
  } else if (cont.includes("oceania")) {
    budget = "from AUD 2,500";
    internet = "85 Mbps";
    cities = [c.name + " Capital"];
  }
  
  return {
    budget,
    internet,
    cities,
    tags,
    guidesCount: 5
  };
};

const getCleanDescription = (desc?: string) => {
  if (!desc) return "";
  const lines = desc.split("\n")
    .map(line => line.trim())
    .filter(line => line && !line.startsWith("#") && !line.startsWith("-") && !line.startsWith("!"))
    .map(line => line.replace(/['"*]/g, ""));
  return lines[0] || desc;
};

const getCountryTab = (c: { iso_code: string; continent: string }) => {
  const code = c.iso_code?.toUpperCase() || "";
  const cont = c.continent?.toLowerCase() || "";
  
  if (cont.includes("europe")) return "europe";
  
  if (cont.includes("asia") || ["AE", "QA", "SA", "OM", "KW", "JO", "IL", "LB", "BH"].includes(code)) {
    if (["AE", "QA", "SA", "OM", "KW", "JO", "IL", "LB", "BH"].includes(code)) {
      return "middle-east-africa";
    }
    return "asia-pacific";
  }
  
  if (cont.includes("oceania")) return "asia-pacific";
  if (cont.includes("africa")) return "middle-east-africa";
  if (cont.includes("america") || cont.includes("caribbean")) return "americas";
  
  return "europe";
};

export default function CountriesPageContent() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("A-Z");

  const activeTab = searchParams.get("tab") || "all";

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("countries")
          .select("id, name, flag_url, iso_code, continent, description")
          .order("name", { ascending: true });
        if (error) throw error;
        setCountries((data as Country[]) || []);
      } catch (err) {
        console.error("Error fetching countries:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const handleTabChange = (tab: string) => {
    if (tab === "all") {
      searchParams.delete("tab");
    } else {
      searchParams.set("tab", tab);
    }
    setSearchParams(searchParams);
  };

  // Filter countries
  const filteredCountries = countries.filter((c) => {
    const tabMatch = activeTab === "all" || getCountryTab(c) === activeTab;
    
    const normQuery = searchQuery.toLowerCase().trim();
    if (!normQuery) return tabMatch;

    const name = c.name.toLowerCase();
    const iso = (c.iso_code || "").toLowerCase();
    const cont = (c.continent || "").toLowerCase();

    let searchMatch = name.includes(normQuery) || iso.includes(normQuery) || cont.includes(normQuery);

    if (!searchMatch) {
      if (normQuery === "uae" && name === "united arab emirates") searchMatch = true;
      else if (normQuery === "uk" && name === "united kingdom") searchMatch = true;
      else if ((normQuery === "czech republic" || normQuery === "czech") && name === "czechia") searchMatch = true;
      else if (normQuery === "lichtenstein" && name === "liechtenstein") searchMatch = true;
      else if (normQuery === "krygyzstan" && name === "kyrgyzstan") searchMatch = true;
    }

    return tabMatch && searchMatch;
  });

  // Sort countries
  const sortedCountries = [...filteredCountries].sort((a, b) => {
    if (sortBy === "A-Z") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === "Z-A") {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });

  // Compute counts for tabs
  const tabCounts = countries.reduce(
    (acc, c) => {
      const tab = getCountryTab(c);
      acc[tab] = (acc[tab] || 0) + 1;
      return acc;
    },
    { all: countries.length, europe: 0, "asia-pacific": 0, americas: 0, "middle-east-africa": 0 } as Record<string, number>
  );

  return (
    <div className="mx-auto w-full max-w-[80vw] py-8 sm:px-4 lg:px-6">
      {/* Banner */}
      <Link
        to="/resources"
        className="flex items-center justify-between bg-[#f4f4f5] dark:bg-[#1c1c1e] hover:bg-[#eaeaea] dark:hover:bg-[#28282a] border border-slate-200 dark:border-white/10 rounded-2xl p-4 mb-8 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🗺️</span>
          <div className="text-left">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Browse City Guides</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Neighborhoods, coworking, cost of living & daily life</p>
          </div>
        </div>
        <svg className="size-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>

      {/* Header controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
        <div className="relative w-full sm:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <svg className="size-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search countries or cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#1c1c1e] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
          <div className="flex items-center gap-2 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 bg-white dark:bg-[#1c1c1e] text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition cursor-pointer">
            <svg className="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Filters
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none border border-slate-200 dark:border-white/10 rounded-xl pl-3 pr-8 py-2 bg-white dark:bg-[#1c1c1e] text-slate-700 dark:text-slate-300 text-xs font-semibold focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 cursor-pointer"
            >
              <option value="A-Z">Name (A-Z)</option>
              <option value="Z-A">Name (Z-A)</option>
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
              <svg className="size-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-white/10 pb-4 mb-6">
        {[
          { id: "all", label: "All" },
          { id: "europe", label: "Europe" },
          { id: "asia-pacific", label: "Asia & Pacific" },
          { id: "americas", label: "Americas" },
          { id: "middle-east-africa", label: "Middle East & Africa" }
        ].map((tab) => {
          const active = activeTab === tab.id;
          const count = tabCounts[tab.id] || 0;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                active
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#1c1c1e] dark:text-slate-400 dark:hover:bg-white/5"
              }`}
            >
              {tab.label} <span className="opacity-50 ml-1">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Showing count */}
      <p className="text-xs text-slate-500 dark:text-slate-400 text-left mb-6 font-medium">
        Showing all {sortedCountries.length} countries
      </p>

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-20 text-slate-500">{t("country.loading")}</div>
      ) : sortedCountries.length === 0 ? (
        <div className="text-center py-20 text-slate-500">No countries match your search parameters.</div>
      ) : (
        /* Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCountries.map((c) => {
            const meta = getCountryMetaFallback(c);
            const desc = getCleanDescription(c.description);

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col text-left group"
              >
                <Link to={`/countries/${c.id}`} className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Top Row: Flag & Name */}
                    <div className="flex items-center gap-2 mb-3">
                      {c.flag_url ? (
                        <img src={c.flag_url} alt={c.name} className="w-5 h-3.5 object-cover rounded-sm shadow-sm" />
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-white/5 rounded px-1.5 py-0.5 uppercase">{c.iso_code}</span>
                      )}
                      <h3 className="font-bold text-slate-900 dark:text-white text-base flex-1 flex items-center gap-1 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                        <span className="text-slate-400 mr-1 uppercase text-sm font-semibold">{c.iso_code}</span>
                        {c.name}
                        <svg className="size-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                      {desc}
                    </p>

                    {/* Badges: Budget & Internet */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {meta.budget && (
                        <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-lg px-2.5 py-1 text-[11px] font-semibold">
                          <span>$</span>
                          <span className="uppercase text-[9px] opacity-75">Budget:</span>
                          <span>{meta.budget}</span>
                        </div>
                      )}
                      {meta.internet && (
                        <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-lg px-2.5 py-1 text-[11px] font-semibold">
                          <svg className="size-3 opacity-80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.284 16.284A3 3 0 0012 21a3 3 0 003.716-4.716M12 3v3m0 0a6 6 0 100 12 6 6 0 000-12z" />
                          </svg>
                          <span className="uppercase text-[9px] opacity-75">Internet:</span>
                          <span>{meta.internet}</span>
                        </div>
                      )}
                    </div>

                    {/* Cities */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
                      {meta.cities.map((city) => (
                        <div key={city} className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          <svg className="size-3 text-slate-400 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{city}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom info: Tags & Guides count */}
                  <div className="border-t border-slate-100 dark:border-white/5 pt-3.5 mt-auto flex items-center justify-between text-[11px]">
                    <div className="flex gap-1.5">
                      {meta.tags.map((tag) => (
                        <span key={tag} className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-semibold px-2 py-0.5 rounded text-[10px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-slate-400 font-medium shrink-0">
                      {meta.cities.length} cities • {meta.guidesCount} guides
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
