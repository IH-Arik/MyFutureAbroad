import { useTranslation } from "react-i18next";
import { LANGUAGES } from "@/components/provider/LanguagesCard";

interface ServiceFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  selectedLanguages: string[];
  onLanguagesChange: (v: string[]) => void;
  /** Pass empty array to hide the country filter entirely */
  countries?: { id: number; name: string; flag_url?: string | null }[];
  selectedCountry: number | "all";
  onCountryChange: (v: number | "all") => void;
  /** Called to clear all filters */
  showLanguageFilter?: boolean;
}

export function ServiceFilters({
  search,
  onSearchChange,
  selectedLanguages,
  onLanguagesChange,
  countries,
  selectedCountry,
  onCountryChange,
  showLanguageFilter = true,
}: ServiceFiltersProps) {
  const { t } = useTranslation();

  const clearable =
    search.trim() !== "" ||
    selectedLanguages.length > 0 ||
    (selectedCountry !== "all");

  return (
    <div className="rounded-2xl border border-border/50 bg-white p-4 shadow-sm dark:bg-[#1a1a1a] dark:border-white/10 space-y-4">
      {/* Search row */}
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("services.search_placeholder") || "Search services…"}
          className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:bg-[#2a2a2a]"
        />
      </div>

      {/* Filter chips row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Country filter */}
        {countries && countries.length > 0 && (
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) =>
                onCountryChange(e.target.value === "all" ? "all" : Number(e.target.value))
              }
              className="appearance-none rounded-xl border border-border bg-background text-foreground text-sm px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#8B6949]/40 cursor-pointer dark:bg-[#2a2a2a]"
            >
              <option value="all">{t("services.all_countries")}</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}

        {/* Language filter */}
        {showLanguageFilter && (
          <div className="relative">
            <select
              value={selectedLanguages.length === 1 ? selectedLanguages[0] : ""}
              onChange={(e) => {
                const val = e.target.value;
                onLanguagesChange(val ? [val] : []);
              }}
              className="appearance-none rounded-xl border border-border bg-background text-foreground text-sm px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#8B6949]/40 cursor-pointer dark:bg-[#2a2a2a]"
            >
              <option value="">{t("services.all_languages") || "All languages"}</option>
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}

        {/* Clear button */}
        {clearable && (
          <button
            onClick={() => {
              onSearchChange("");
              onLanguagesChange([]);
              onCountryChange("all");
            }}
            className="text-xs text-[#8B6949] hover:underline whitespace-nowrap"
          >
            {t("services.clear_filter")}
          </button>
        )}
      </div>
    </div>
  );
}
