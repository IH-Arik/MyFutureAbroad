import { useState } from "react";
import VisaFinderPageContent from "./VisaFinderPageContent";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function VisaFinderPage() {
  const { t } = useTranslation();
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  if (showQuestionnaire) {
    return <VisaFinderPageContent onBack={() => setShowQuestionnaire(false)} />;
  }

  return (
    <div className="min-h-screen px-3 sm:px-4 py-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <Link to="/tools" className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground mb-4 sm:mb-6 transition-colors font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          {t("tools.back")}
        </Link>
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">{t("home.visa_finder_title")}</h1>
          <p className="mt-2 text-sm sm:text-base lg:text-lg text-muted-foreground">{t("visa_finder.subtitle")}</p>
        </div>

        <div className="rounded-2xl border border-border/50 bg-white dark:bg-[#1f1f1f] p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Find visas matching your profile</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Answer a few questions to discover visas you qualify for.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={() => setShowQuestionnaire(true)}
              className="w-full sm:w-auto rounded-xl border border-[#8B6949]/30 dark:border-white/10 bg-white dark:bg-slate-800 text-[#8B6949] dark:text-white px-4 py-2.5 text-sm font-semibold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors active:scale-95"
            >
              Find Visas
            </button>
            <Link
              to="/chats?feature=visa_finder"
              className="w-full sm:w-auto text-center rounded-xl bg-gradient-to-r from-[#8B6949] to-[#D4C2A1] text-white px-4 py-2.5 text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity active:scale-95"
            >
              Build with AI Chat
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {localStorage.getItem("visa_finder_profile") ? (
            <button
              onClick={() => setShowQuestionnaire(true)}
              className="block w-full text-left rounded-2xl border border-border/50 bg-white dark:bg-[#1f1f1f] p-4 hover:shadow-md hover:border-[#8B6949]/40 transition-all cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">My Saved Profile</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                    Click to view your last matched visa results or redo the finder questionnaire.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-semibold text-[#8B6949] dark:text-[#D4C2A1] hover:underline">View Results →</span>
                </div>
              </div>
            </button>
          ) : (
            <div className="rounded-2xl border border-border/50 bg-white dark:bg-[#1f1f1f] p-6 sm:p-8 text-center">
              <p className="text-sm text-muted-foreground">No matches found yet. Start the visa finder to see matches.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VisaFinderPage;
