import type React from "react";
import { Outlet, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/Navbar";
import { ConsentBanner } from "@/components/ConsentBanner";
import { CookieBanner } from "@/components/CookieBanner";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

export const Layout: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-stone-50 to-stone-200 dark:from-stone-950 dark:to-stone-800">
      <Navbar />

      <main className="flex-1 px-8 pb-8 pt-2">
        <Outlet />
      </main>

      <footer className="py-4 px-8 border-t border-border/40 text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© {new Date().getFullYear()} MyFutureAbroad</span>
        <div className="flex items-center gap-4">
          <Link to="/terms" className="hover:text-foreground transition-colors">{t("terms.title")}</Link>
          <Link to="/privacy" className="hover:text-foreground transition-colors">{t("privacy.title")}</Link>
        </div>
      </footer>

      <CookieBanner />
      <ConsentBanner />
      <GoogleAnalytics />
    </div>
  );
};

export default Layout;
