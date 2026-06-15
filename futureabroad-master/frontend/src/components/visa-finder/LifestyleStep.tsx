import type React from "react";

const LifestyleStep: React.FC<any> = ({ PREFERENCES, profile, setProfile, t, renderIcon, LANGUAGE_OPTIONS }) => {
  const togglePref = (id: string) => {
    setProfile((prev: any) => {
      let prefs = prev.preferences || [];
      if (id === "warm_climate") prefs = prefs.filter((p: string) => p !== "cold_climate");
      if (id === "cold_climate") prefs = prefs.filter((p: string) => p !== "warm_climate");
      return {
        ...prev,
        preferences: prefs.includes(id) ? prefs.filter((p: string) => p !== id) : [...prefs, id],
      };
    });
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-foreground mb-1">{t("visa_finder.lifestyle_title")}</h2>
      <p className="text-muted-foreground mb-6">{t("visa_finder.lifestyle_subtitle")}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-7">
        {PREFERENCES.map((pref: any) => {
          const selected = profile.preferences.includes(pref.id);
          return (
            <button
              key={pref.id}
              onClick={() => togglePref(pref.id)}
              className={`flex flex-col items-start p-5 rounded-2xl border-2 text-left transition-all hover:border-[#8B6949] hover:shadow-sm ${
                selected
                  ? "border-[#8B6949] bg-[#8B6949]/5"
                  : "border-border bg-background"
              }`}
            >
              <div className="text-3xl mb-3 text-[#8B6949]">
                {renderIcon(pref.icon, "w-8 h-8")}
              </div>
              <span className="font-semibold text-foreground text-sm">{t(`visa_finder.prefs.${pref.id}_label`)}</span>
              <span className="text-xs text-muted-foreground mt-1">{t(`visa_finder.prefs.${pref.id}_desc`)}</span>
            </button>
          );
        })}
      </div>
      <div className="border-t border-border pt-6">
        <p className="text-sm font-medium text-foreground mb-3">{t("visa_finder.lifestyle_language")}</p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((lang: any) => {
            const selected = profile.language === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => setProfile((prev: any) => ({ ...prev, language: prev.language === lang.id ? "" : lang.id }))}
                className={`px-3.5 py-1.5 rounded-full border-2 text-sm font-medium transition-all ${
                  selected
                    ? "border-[#8B6949] bg-[#8B6949]/10 text-[#8B6949] dark:text-[#D4C2A1]"
                    : "border-border bg-background text-foreground hover:border-[#8B6949]/50"
                }`}
              >
                {t(`visa_finder.languages.${lang.id}`)}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default LifestyleStep;
