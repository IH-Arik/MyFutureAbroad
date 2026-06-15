import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useCookieConsent } from "@/components/CookieConsentProvider";
import { useTranslation } from "react-i18next";

const EXEMPT_PATHS = ["/terms", "/privacy"];

export function CookieBanner() {
    const { preferences, savePreferences } = useCookieConsent();
    const location = useLocation();
    const { t } = useTranslation();
    const [choosing, setChoosing] = useState(false);

    const categories = [
        {
            key: "essential" as const,
            label: t("cookie.cat_essential"),
            description: t("cookie.cat_essential_desc"),
            locked: true,
        },
        {
            key: "functional" as const,
            label: t("cookie.cat_functional"),
            description: t("cookie.cat_functional_desc"),
            locked: false,
        },
        {
            key: "analytics" as const,
            label: t("cookie.cat_analytics"),
            description: t("cookie.cat_analytics_desc"),
            locked: false,
        },
    ];
    const [functional, setFunctional] = useState(true);
    const [analytics, setAnalytics] = useState(true);

    const LEGAL_AGREED_KEY = "mfa-legal-agreed";
    const [legalAccepted, setLegalAccepted] = useState<boolean>(() => {
        try {
            return !!localStorage.getItem(LEGAL_AGREED_KEY);
        } catch {
            return false;
        }
    });

    if (preferences !== null) return null;
    if (EXEMPT_PATHS.includes(location.pathname)) return null;

    function acceptAll() {
        if (!legalAccepted) return;
        savePreferences({ essential: true, functional: true, analytics: true });
        try { localStorage.setItem(LEGAL_AGREED_KEY, "true"); } catch {}
    }

    function saveChosen() {
        if (!legalAccepted) return;
        savePreferences({ essential: true, functional, analytics });
        try { localStorage.setItem(LEGAL_AGREED_KEY, "true"); } catch {}
    }

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-white dark:bg-[#1f1f1f] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">

                    {/* Header */}
                    <div className="px-6 pt-6 pb-4">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">🍪</span>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{t("cookie.title")}</h2>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            {t("cookie.desc")}
                        </p>
                        <div className="mt-3">
                            <label className="inline-flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                <input
                                    type="checkbox"
                                    checked={legalAccepted}
                                    onChange={(e) => setLegalAccepted(e.target.checked)}
                                    className="mt-0.5 h-4 w-4 rounded border border-slate-300 bg-white dark:bg-[#111]"
                                />
                                <span>
                                    I agree to the <a href="/terms" target="_blank" rel="noreferrer" className="font-semibold text-[#8B6949] hover:underline">Terms &amp; Conditions</a> and <a href="/privacy" target="_blank" rel="noreferrer" className="font-semibold text-[#8B6949] hover:underline">Privacy Notice</a>.
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Cookie categories — shown when choosing */}
                    {choosing && (
                        <div className="px-6 pb-4 space-y-3">
                            {categories.map((cat) => (
                                <div key={cat.key} className="flex items-start justify-between gap-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4">
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">{cat.label}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{cat.description}</p>
                                    </div>
                                    {cat.locked ? (
                                        <span className="mt-0.5 shrink-0 text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-white/10 px-2.5 py-1 rounded-full">{t("cookie.always_on")}</span>
                                    ) : (
                                        <button
                                            role="switch"
                                            aria-checked={cat.key === "functional" ? functional : analytics}
                                            onClick={() => cat.key === "functional" ? setFunctional(f => !f) : setAnalytics(a => !a)}
                                            className={`mt-0.5 shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                                (cat.key === "functional" ? functional : analytics)
                                                    ? "bg-gradient-to-r from-[#8B6949] to-[#D4C2A1]"
                                                    : "bg-slate-200 dark:bg-white/20"
                                            }`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                                (cat.key === "functional" ? functional : analytics) ? "translate-x-6" : "translate-x-1"
                                            }`} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
                        {choosing ? (
                            <>
                                <button
                                    onClick={saveChosen}
                                    disabled={!legalAccepted}
                                    className={`flex-1 rounded-full bg-gradient-to-r from-[#8B6949] to-[#D4C2A1] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg ${!legalAccepted ? 'opacity-50 cursor-not-allowed hover:translate-y-0' : ''}`}
                                >
                                    {t("cookie.save_preferences")}
                                </button>
                                <button
                                    onClick={acceptAll}
                                    disabled={!legalAccepted}
                                    className={`flex-1 rounded-full border border-slate-200 dark:border-white/10 px-6 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 transition ${!legalAccepted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
                                >
                                    {t("cookie.accept_all")}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={acceptAll}
                                    disabled={!legalAccepted}
                                    className={`flex-1 rounded-full bg-gradient-to-r from-[#8B6949] to-[#D4C2A1] px-6 py-2.5 text-sm font-semibold text-white transition-all ${!legalAccepted ? 'opacity-50 cursor-not-allowed hover:translate-y-0' : 'hover:-translate-y-0.5 hover:shadow-lg'}`}
                                >
                                    {t("cookie.accept_all")}
                                </button>
                                <button
                                    onClick={() => setChoosing(true)}
                                    className="flex-1 rounded-full border border-slate-200 dark:border-white/10 px-6 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-white/5"
                                >
                                    {t("cookie.choose_cookies")}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
