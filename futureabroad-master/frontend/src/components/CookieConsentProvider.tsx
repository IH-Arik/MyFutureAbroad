import { createContext, useContext, useState } from "react";

export interface CookiePreferences {
    essential: true;
    functional: boolean;
    analytics: boolean;
}

export const COOKIE_CONSENT_KEY = "mfa-cookie-consent";

interface CookieConsentContextType {
    preferences: CookiePreferences | null;
    savePreferences: (prefs: CookiePreferences) => void;
}

const CookieConsentContext = createContext<CookieConsentContextType>({
    preferences: null,
    savePreferences: () => {},
});

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
    const [preferences, setPreferences] = useState<CookiePreferences | null>(() => {
        try {
            const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    function savePreferences(prefs: CookiePreferences) {
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
        setPreferences(prefs);
    }

    return (
        <CookieConsentContext.Provider value={{ preferences, savePreferences }}>
            {children}
        </CookieConsentContext.Provider>
    );
}

export function useCookieConsent() {
    return useContext(CookieConsentContext);
}
