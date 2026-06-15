import type React from "react";

const BackgroundStep: React.FC<any> = ({ profile, setProfile, t, renderIcon }) => {
  return (
    <>
      <h2 className="text-2xl font-semibold text-foreground mb-1">{t("visa_finder.background_title")}</h2>
      <p className="text-muted-foreground mb-7">{t("visa_finder.background_hint")}</p>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setProfile((prev: any) => ({ ...prev, cleanRecord: true }))}
          className={`p-6 rounded-2xl border-2 text-left transition-all ${
            profile.cleanRecord === true
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10"
              : "border-border bg-background hover:border-[#8B6949]"
          }`}
        >
          <div className="text-emerald-600 block mb-3 w-8 h-8">{renderIcon("check", "w-8 h-8")}</div>
          <span className="font-semibold text-foreground block text-sm">{t("visa_finder.clean_record")}</span>
          <span className="text-xs text-muted-foreground">{t("visa_finder.clean_record_desc")}</span>
        </button>
        <button
          onClick={() => setProfile((prev: any) => ({ ...prev, cleanRecord: false }))}
          className={`p-6 rounded-2xl border-2 text-left transition-all ${
            profile.cleanRecord === false
              ? "border-rose-400 bg-rose-50 dark:bg-rose-900/10"
              : "border-border bg-background hover:border-[#8B6949]"
          }`}
        >
          <div className="text-rose-600 block mb-3 w-8 h-8">{renderIcon("alert", "w-8 h-8")}</div>
          <span className="font-semibold text-foreground block text-sm">{t("visa_finder.convictions")}</span>
          <span className="text-xs text-muted-foreground">{t("visa_finder.convictions_desc")}</span>
        </button>
      </div>
    </>
  );
};

export default BackgroundStep;
