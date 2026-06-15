import type React from "react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
// utility 'cn' not required here
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import NotificationsBell from "@/components/NotificationsBell";
import { CURRENCY_SYMBOLS } from "@/components/currency/CurrencyProvider";

const NavRight: React.FC<any> = ({ loading, user, isProvider, currency, toggleTheme, t, handleSignOut, signingOut }) => {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const onProfileMouseEnter = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current as any);
      closeTimer.current = null;
    }
    setOpen(true);
  };

  const onProfileMouseLeave = () => {
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      closeTimer.current = null;
    }, 150) as unknown as number;
  };
  return (
    <div className="hidden lg:flex items-center gap-0.5 rounded-full border border-border/40 bg-white dark:bg-[#1f1f1f]/90 px-1.5 xl:px-2 py-1 xl:py-1.5 shadow-sm backdrop-blur-sm">

      {!loading && user && !isProvider && (
        <Link to="/tools">
          <button className="flex items-center gap-1 rounded-full px-2 xl:px-3 py-1 xl:py-1.5 text-xs xl:text-sm font-medium text-muted-foreground hover:bg-muted dark:hover:bg-white/5 hover:text-foreground transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            {t("nav.tools")}
          </button>
        </Link>
      )}

      {!loading && user && !isProvider && (
        <span className="h-3 xl:h-4 w-px bg-border/60 mx-0.5 xl:mx-1" />
      )}

      <LanguageSwitcher />

      <span className="h-3 xl:h-4 w-px bg-border/60 mx-0.5 xl:mx-1" />

      <div>
        <button className="flex items-center gap-1 rounded-full px-2 xl:px-3 py-1 xl:py-1.5 text-xs xl:text-sm font-medium text-muted-foreground hover:bg-muted dark:hover:bg-white/5 hover:text-foreground transition-colors cursor-pointer">
          <span>{CURRENCY_SYMBOLS[currency]?.symbol || currency}</span>
          <svg className="size-3 opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
        </button>
      </div>

      <span className="h-3 xl:h-4 w-px bg-border/60 mx-0.5 xl:mx-1" />

      <button onClick={toggleTheme} aria-label="Toggle color theme" className="rounded-full p-1 xl:p-1.5 text-muted-foreground hover:bg-muted dark:hover:bg-white/5 hover:text-foreground transition-colors cursor-pointer">
        {typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="size-3 xl:size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M1 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="size-3 xl:size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>

      {!loading && user && !isProvider && (
        <>
          <span className="h-3 xl:h-4 w-px bg-border/60 mx-0.5 xl:mx-1" />
          <NotificationsBell />
        </>
      )}

      {!loading && (
        <>
          <span className="h-3 xl:h-4 w-px bg-border/60 mx-0.5 xl:mx-1" />
          {user ? (
            <div onMouseEnter={onProfileMouseEnter} onMouseLeave={onProfileMouseLeave}>
              <DropdownMenu open={open} onOpenChange={(v) => setOpen(v)}>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full p-1 xl:p-1.5 text-muted-foreground hover:bg-muted dark:hover:bg-white/5 hover:text-foreground transition-colors cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-3 xl:size-4">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent sideOffset={6} align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/account">{t("nav.account") || "Account"}</Link>
                  </DropdownMenuItem>
                  {isProvider && (
                    <DropdownMenuItem asChild>
                      <Link to="/provider">{t("nav.provider_dashboard") || "Provider dashboard"}</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { setOpen(false); handleSignOut?.(); }} data-variant="destructive">
                    {signingOut ? t("nav.signing_out") || "Signing out..." : t("nav.sign_out") || "Sign out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link to="/signup">
              <button className="rounded-full px-2 xl:px-3 py-1 xl:py-1.5 text-xs xl:text-sm font-medium bg-foreground text-background hover:opacity-90 transition-opacity cursor-pointer">
                {t("nav.get_started")}
              </button>
            </Link>
          )}
        </>
      )}
      {loading && <div className="size-7 rounded-full bg-muted animate-pulse mx-1" />}
    </div>
  );
};

export default NavRight;
