import type React from "react";

const NationalityStep: React.FC<any> = ({ countries, translatedCountryNames, nationalitySearch, setNationalitySearch, profile, setProfile, setStep, t }) => {
  const search = (nationalitySearch || "").toLowerCase();
  const filtered = (countries || []).filter((c: any) => {
    const displayName = (translatedCountryNames && translatedCountryNames[c.name]) ?? c.name;
    return displayName.toLowerCase().includes(search) || c.name.toLowerCase().includes(search);
  });

  return (
    <>
      <h2 className="text-2xl font-semibold text-foreground mb-1">
        {t("visa_finder.nationality_title")}
      </h2>
      <p className="text-muted-foreground mb-7">{t("visa_finder.nationality_hint")}</p>
      <input
        type="text"
        placeholder={t("visa_finder.search_country")}
        value={nationalitySearch}
        onChange={(e) => setNationalitySearch(e.target.value)}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#8B6949]/40 dark:text-white"
        autoFocus
      />
      <div className="max-h-64 overflow-y-auto rounded-xl border border-border divide-y divide-border">
        {filtered.slice(0, 50).map((country: any) => {
          const displayName = (translatedCountryNames && translatedCountryNames[country.name]) ?? country.name;
          return (
            <button
              key={country.id}
              onClick={() => {
                setProfile((prev: any) => ({ ...prev, nationality: country.name }));
                setNationalitySearch(displayName);
                setStep(3);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-muted transition-colors ${
                profile.nationality === country.name
                  ? "bg-[#8B6949]/5 font-medium text-[#8B6949]"
                  : "text-foreground"
              }`}
            >
              {country.flag_url && (
                <img
                  src={country.flag_url}
                  alt={country.name}
                  className="w-6 h-4 object-cover rounded-sm flex-shrink-0"
                />
              )}
              {displayName}
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="px-4 py-6 text-sm text-muted-foreground text-center">
            {t("visa_finder.no_countries")}
          </p>
        )}
      </div>
    </>
  );
};

export default NationalityStep;
