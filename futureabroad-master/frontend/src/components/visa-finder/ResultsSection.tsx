import type React from "react";
import VisaCard from "@/components/visa/VisaCard";

const ResultsSection: React.FC<any> = ({ translatedResults, results, t, updateProfile, reset, renderIcon, onAskAI }) => {
  const excellent = (translatedResults || []).filter((r: any) => r.tier === "excellent");
  const good = (translatedResults || []).filter((r: any) => r.tier === "good");
  const matches = (translatedResults || []).filter((r: any) => r.tier === "match");

  const sections = [
    {
      items: excellent,
      label: t("visa_finder.results_excellent"),
      desc: t("visa_finder.results_excellent_desc"),
      icon: "check",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    },
    {
      items: good,
      label: t("visa_finder.results_good"),
      desc: t("visa_finder.results_good_desc"),
      icon: "star",
      iconBg: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    },
    {
      items: matches,
      label: t("visa_finder.results_possible"),
      desc: "These visas match your type but don't fully meet your financial requirements or preferences.",
      icon: "alert",
      iconBg: "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[80vw] py-8 sm:py-12 min-h-screen flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <button onClick={updateProfile} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors">
            {t("visa_finder.results_start_over")}
          </button>
          <h1 className="text-3xl font-semibold text-foreground">{t("visa_finder.results_title")}</h1>
          <p className="text-muted-foreground mt-1">{t("visa_finder.results_found_pre")} {results.length} {results.length !== 1 ? t("visa_finder.results_visa_plural") : t("visa_finder.results_visa_single")}</p>
        </div>
        <div className="self-start flex flex-col gap-2">
          <button onClick={updateProfile} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-sm font-medium hover:bg-muted transition-colors">
            {renderIcon("edit", "w-4 h-4")} {t("visa_finder.results_update")}
          </button>
          <button onClick={reset} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-sm font-medium hover:bg-muted transition-colors text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20">
            {renderIcon("refresh", "w-4 h-4")} {t("visa_finder.results_update")}
          </button>
          {onAskAI && (
            <button
              onClick={onAskAI}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B6949] to-[#D4C2A1] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              {renderIcon("globe", "w-4 h-4")} Ask AI instead
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: t("visa_finder.results_excellent"), count: excellent.length, color: "text-emerald-600 dark:text-emerald-400" },
          { label: t("visa_finder.results_good"), count: good.length, color: "text-amber-600 dark:text-amber-400" },
          { label: t("visa_finder.results_possible"), count: matches.length, color: "text-slate-500 dark:text-slate-400" },
          { label: t("visa_finder.results_total"), count: results.length, color: "text-foreground" },
        ].map((item) => (
          <div key={item.label} className="bg-card rounded-xl p-4 border border-border">
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className={`text-2xl font-bold mt-1 ${item.color}`}>{item.count}</p>
          </div>
        ))}
      </div>

      {results.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 text-muted-foreground">
            {renderIcon("alert", "w-12 h-12")}
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">{t("visa_finder.results_none_title")}</h3>
          <p className="text-muted-foreground mb-5">{t("visa_finder.results_none_hint")}</p>
          <button onClick={reset} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8B6949] to-[#D4C2A1] text-white text-sm font-semibold">
            {t("visa_finder.results_update_profile")}
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {sections.map((section: any) =>
            section.items.length === 0 ? null : (
              <div key={section.label}>
                <h2 className="text-2xl font-semibold text-foreground mb-2 flex items-center gap-2">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${section.iconBg}`}>
                    {renderIcon(section.icon, "w-5 h-5")}
                  </span>
                  {section.label} ({section.items.length})
                </h2>
                <p className="text-muted-foreground mb-4 text-sm">{section.desc}</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.items.map(({ visa, tier, reasons, positiveReasons }: any) => (
                    <VisaCard key={visa.id} visa={visa} tier={tier} reasons={reasons} positiveReasons={positiveReasons} />
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsSection;
