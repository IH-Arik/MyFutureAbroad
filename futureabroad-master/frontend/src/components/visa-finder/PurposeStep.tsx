import type React from "react";

const PurposeStep: React.FC<any> = ({ PURPOSES, profile, setProfile, setStep, renderIcon, t }) => {
  return (
    <>
      <h2 className="text-2xl font-semibold text-foreground mb-1">
        {t("visa_finder.purpose_title")}
      </h2>
      <p className="text-muted-foreground mb-7">
        {t("visa_finder.purpose_hint")}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PURPOSES.map((p: any) => (
          <button
            key={p.id}
            onClick={() => {
              setProfile((prev: any) => ({ ...prev, purpose: p.id }));
              setStep(2);
            }}
            className={`flex flex-col items-start p-5 rounded-2xl border-2 text-left transition-all hover:border-[#8B6949] hover:shadow-sm ${
              profile.purpose === p.id
                ? "border-[#8B6949] bg-[#8B6949]/5"
                : "border-border bg-background"
            }`}
          >
            <div className="text-3xl mb-3 text-[#8B6949]">
              {renderIcon(p.icon, "w-8 h-8")}
            </div>
            <span className="font-semibold text-foreground text-sm">{p.label}</span>
            <span className="text-xs text-muted-foreground mt-1">{p.description}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default PurposeStep;
