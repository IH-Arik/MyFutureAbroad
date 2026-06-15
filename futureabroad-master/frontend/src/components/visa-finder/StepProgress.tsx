export default function StepProgress({ step, totalSteps, stepLabels, t }: { step: number; totalSteps: number; stepLabels: string[]; t: (k: string) => string; }) {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-muted-foreground">
          {t("visa_finder.step")} {step} {t("visa_finder.of")} {totalSteps}: {" "}
          <span className="text-foreground">{stepLabels[step - 1]}</span>
        </p>
      </div>

      <div className="flex gap-2 mb-10">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i < step ? "bg-gradient-to-r from-[#8B6949] to-[#D4C2A1]" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </>
  );
}
