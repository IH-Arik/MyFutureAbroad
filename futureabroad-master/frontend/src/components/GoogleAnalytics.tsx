import { useEffect } from "react";
import { useCookieConsent } from "@/components/CookieConsentProvider";

const GA_ID = "G-WQ300X0VKN";

export function GoogleAnalytics() {
  const { preferences } = useCookieConsent();

  useEffect(() => {
    if (!preferences?.analytics) return;
    if (document.getElementById("ga-script")) return;

    const script1 = document.createElement("script");
    script1.id = "ga-script";
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_ID}');
    `;
    document.head.appendChild(script2);
  }, [preferences?.analytics]);

  return null;
}
