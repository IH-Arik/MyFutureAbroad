export default function StepControls({
  step,
  totalSteps,
  canProceed,
  setStep,
  handleSearch,
  loading,
  t,
}: {
  step: number;
  totalSteps: number;
  canProceed: () => boolean;
  setStep: (s: number | ((s: number) => number)) => void;
  handleSearch: () => void;
  loading: boolean;
  t: (k: string) => string;
}) {
  return (
    <div className="flex justify-between items-center mt-auto">
      {step > 1 ? (
        <button
          onClick={() => setStep((s: number) => s - 1)}
          className="px-5 py-2.5 rounded-xl border border-border bg-card text-sm font-medium hover:bg-muted transition-colors"
        >
          {t("visa_finder.back")}
        </button>
      ) : (
        <div />
      )}

      {step < totalSteps ? (
        step >= 3 ? (
          <button
            onClick={() => setStep((s: number) => s + 1)}
            disabled={!canProceed()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8B6949] to-[#D4C2A1] text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {t("visa_finder.next")}
          </button>
        ) : (
          <div />
        )
      ) : (
        <button
          onClick={handleSearch}
          disabled={!canProceed() || loading}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8B6949] to-[#D4C2A1] text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          {loading ? t("visa_finder.finding") : t("visa_finder.find")}
        </button>
      )}
    </div>
  );
}
