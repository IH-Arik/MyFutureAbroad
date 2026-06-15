import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { COOKIE_CONSENT_KEY } from "@/components/CookieConsentProvider";
import { useTranslation } from "react-i18next";

const DISMISSED_KEY = "mfa-legal-dismissed";
const EXEMPT_PATHS = ["/terms", "/privacy"];

export function ConsentBanner() {
    const [visible, setVisible] = useState(false);
    const location = useLocation();
    const { t } = useTranslation();

    useEffect(() => {
        const cookieDone = !!localStorage.getItem(COOKIE_CONSENT_KEY);
        const dismissed = !!localStorage.getItem(DISMISSED_KEY);
        if (cookieDone && !dismissed && !EXEMPT_PATHS.includes(location.pathname)) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [location.pathname]);

    function dismiss() {
        localStorage.setItem(DISMISSED_KEY, "true");
        setVisible(false);
    }

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-3 sm:p-4 pointer-events-none">
            <div className="pointer-events-auto flex items-center justify-between gap-3 sm:gap-4 bg-white dark:bg-[#1f1f1f] border border-slate-200 dark:border-white/10 rounded-xl shadow-lg px-4 sm:px-5 py-3 w-full max-w-2xl mx-auto">
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {t("consent.text_prefix")}{" "}
                    <a href="/terms" target="_blank" rel="noreferrer" className="font-semibold text-[#8B6949] hover:underline">{t("consent.terms")}</a>
                    {" "}{t("consent.and")}{" "}
                    <a href="/privacy" target="_blank" rel="noreferrer" className="font-semibold text-[#8B6949] hover:underline">{t("consent.privacy")}</a>.
                </p>
                <button
                    onClick={dismiss}
                    aria-label="Dismiss"
                    className="shrink-0 flex items-center justify-center size-8 sm:size-auto rounded-full sm:rounded-none bg-slate-100 sm:bg-transparent dark:bg-white/10 sm:dark:bg-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors sm:p-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
