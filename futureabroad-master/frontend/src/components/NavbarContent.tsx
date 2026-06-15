import type React from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth-context";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { CURRENCY_SYMBOLS } from "@/components/currency/CurrencyProvider";
import { useTheme } from "@/components/theme-provider";
import { signOut } from "@/lib/auth";
import NotificationsBell from "@/components/NotificationsBell";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { currency, setCurrency } = useCurrency();
  const { user, isProvider, loading } = useAuth();
  const { theme, setTheme } = useTheme();
  const [signingOut, setSigningOut] = useState(false);
  const { t } = useTranslation();

  const NAV_LINKS = [
    { label: t("nav.home"), to: "/" },
    { label: t("nav.visas"), to: "/visas" },
    { label: t("nav.services"), to: "/services" },
    { label: t("nav.resources"), to: "/resources" },
    { label: t("nav.travel"), to: "/travel" },
  ];

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    setSigningOut(false);
  };

  const toggleTheme = () => {
    try {
      if (theme === "dark") {
        setTheme("light");
        return;
      }

      if (theme === "light") {
        setTheme("dark");
        return;
      }

      if (typeof document !== "undefined") {
        const rootIsDark = document.documentElement.classList.contains("dark");
        setTheme(rootIsDark ? "light" : "dark");
      }
    } catch (e) {
      // noop
    }
  };

  return (
    <header className="maxsticky top-0 z-50 bg-transparent pt-3 sm:pt-4 lg:pt-5 xl:pt-6 2xl:pt-8 w-full">
      <div className="relative mx-auto flex w-full max-w-[95vw] items-center justify-between px-2 sm:px-3 lg:px-4">
        {/* Brand */}
        <Link
          to="/"
          className="shrink-0 flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <span className="text-base font-semibold tracking-tight text-foreground sm:text-lg lg:text-xl 2xl:text-2xl">MyFutureAbroad</span>
        </Link>

        {/* Pilled center nav (desktop) */}
        <nav className="hidden lg:block absolute left-1/2 -translate-x-1/2">
          <div className="flex items-center">
            <div className="flex items-center gap-0.5 lg:gap-1 rounded-full border border-border/40 bg-white dark:bg-[#1f1f1f]/90 px-1.5 lg:px-2 xl:px-3 py-1 xl:py-1.5 shadow-sm backdrop-blur-sm">
              {NAV_LINKS.map((link) => {
                const active = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      "whitespace-nowrap rounded-full px-2.5 lg:px-3 xl:px-4 2xl:px-5 py-1 xl:py-1.5 text-xs lg:text-sm xl:text-sm 2xl:text-base font-medium transition-all duration-200",
                      active
                        ? "bg-muted text-foreground shadow-sm dark:bg-white/10"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground dark:hover:bg-white/5"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Right actions */}
        <div className="shrink-0 flex items-center justify-end gap-2 sm:gap-2.5 lg:gap-3">

          {/* Mobile: Tools Icon Button */}
          {!loading && user && !isProvider && (
            <Link to="/tools" className="lg:hidden">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-border/40 bg-white dark:bg-[#1f1f1f]/80 shadow-sm hover:bg-muted dark:hover:bg-white/5 cursor-pointer transition-colors"
                aria-label="Tools"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              </Button>
            </Link>
          )}

          {/* Mobile: Notifications button */}
          {!loading && user && !isProvider && (
            <div className="lg:hidden">
              <NotificationsBell />
            </div>
          )}

          {/* Mobile: Hamburger Dropdown Menu */}
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 sm:h-11 sm:w-11 rounded-full border-border/40 bg-white dark:bg-[#1f1f1f]/80 shadow-sm hover:bg-muted dark:hover:bg-white/5 cursor-pointer transition-colors"
                  aria-label="Menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 shadow-xl border-border/40">
                {NAV_LINKS.map(link => (
                  <DropdownMenuItem key={link.to} asChild>
                    <Link
                      to={link.to}
                      className={cn(
                        "flex w-full cursor-pointer items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                        location.pathname === link.to ? "bg-accent text-accent-foreground font-semibold" : "text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                {!loading && !user && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        to="/signup"
                        className="flex w-full cursor-pointer items-center rounded-md px-3 py-2.5 text-sm font-medium text-primary hover:bg-muted"
                      >
                        {t("nav.get_started_signin")}
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-3 py-1.5">Settings</DropdownMenuLabel>

                {/* Language Dialog Trigger */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-foreground rounded-md hover:bg-muted transition-colors cursor-pointer">
                      <span>Language</span>
                      <svg className="size-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="w-full max-w-md rounded-2xl border-border/40 bg-white dark:bg-[#1f1f1f]">
                    <h2 className="text-sm font-semibold text-foreground mb-4">Select Language</h2>
                    <div className="space-y-2 max-h-56 sm:max-h-80 overflow-y-auto">
                      <LanguageSwitcher />
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Currency Dialog Trigger */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-foreground rounded-md hover:bg-muted transition-colors cursor-pointer">
                      <span>Currency</span>
                      <svg className="size-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="w-full max-w-md rounded-2xl border-border/40 bg-white dark:bg-[#1f1f1f]">
                    <h2 className="text-sm font-semibold text-foreground mb-4">Select Currency</h2>
                    <div className="space-y-2 max-h-56 sm:max-h-80 overflow-y-auto">
                      {Object.entries(CURRENCY_SYMBOLS).map(([code, { symbol }]: any) => (
                        <button key={code} onClick={() => setCurrency(code)} className={cn("w-full text-left px-4 py-2.5 text-sm font-medium rounded-md transition-colors", currency === code ? "bg-accent text-accent-foreground font-semibold" : "text-foreground hover:bg-muted")}>
                          <span className="font-semibold min-w-6">{symbol}</span>
                          <span className="text-xs opacity-60">{code}</span>
                        </button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Theme Dialog Trigger */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-foreground rounded-md hover:bg-muted transition-colors cursor-pointer">
                      <span>Theme</span>
                      <svg className="size-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="w-full max-w-md rounded-2xl border-border/40 bg-white dark:bg-[#1f1f1f]">
                    <div className="space-y-2">
                      <h2 className="text-sm font-semibold text-foreground mb-4">Select Theme</h2>
                      <button onClick={() => { setTheme("light"); toggleTheme(); }} className={cn("w-full text-left px-4 py-2.5 text-sm font-medium rounded-md transition-colors", "text-foreground hover:bg-muted")}>Light</button>
                      <button onClick={() => { setTheme("dark"); toggleTheme(); }} className={cn("w-full text-left px-4 py-2.5 text-sm font-medium rounded-md transition-colors", "text-foreground hover:bg-muted")}>Dark</button>
                    </div>
                  </DialogContent>
                </Dialog>

                {!loading && user && !isProvider && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-3 py-1.5">Account</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link to="/messages" className="cursor-pointer flex items-center gap-2 text-sm px-3 py-2.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        {t("nav.messages")}
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* ── Desktop unified action bar ── */}
          <div className="hidden lg:flex items-center gap-0.5 rounded-full border border-border/40 bg-white dark:bg-[#1f1f1f]/90 px-1.5 xl:px-2 py-1 xl:py-1.5 shadow-sm backdrop-blur-sm">

            {/* Tools (logged-in non-provider only) */}
            {!loading && user && !isProvider && (
              <Link to="/tools">
                <button className="flex items-center gap-1 rounded-full px-2 xl:px-3 py-1 xl:py-1.5 text-xs xl:text-sm font-medium text-muted-foreground hover:bg-muted dark:hover:bg-white/5 hover:text-foreground transition-colors cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                  {t("nav.tools")}
                </button>
              </Link>
            )}

            {/* Divider after Tools */}
            {!loading && user && !isProvider && (
              <span className="h-3 xl:h-4 w-px bg-border/60 mx-0.5 xl:mx-1" />
            )}

            {/* Language */}
            <LanguageSwitcher />

            <span className="h-3 xl:h-4 w-px bg-border/60 mx-0.5 xl:mx-1" />

            {/* Currency */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 rounded-full px-2 xl:px-3 py-1 xl:py-1.5 text-xs xl:text-sm font-medium text-muted-foreground hover:bg-muted dark:hover:bg-white/5 hover:text-foreground transition-colors cursor-pointer">
                  <span>{CURRENCY_SYMBOLS[currency]?.symbol || currency}</span>
                  <svg className="size-3 opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>{t("nav.select_currency")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(CURRENCY_SYMBOLS).map(([code, { symbol, name }]) => (
                  <DropdownMenuItem key={code} onSelect={() => setCurrency(code)} className={cn("cursor-pointer py-2", currency === code && "bg-accent font-medium")}>
                    <span className="w-8 text-muted-foreground font-semibold">{symbol}</span>
                    <span className="flex-1">{code}</span>
                    <span className="text-sm text-muted-foreground">{name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="h-3 xl:h-4 w-px bg-border/60 mx-0.5 xl:mx-1" />

            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="rounded-full p-1 xl:p-1.5 text-muted-foreground hover:bg-muted dark:hover:bg-white/5 hover:text-foreground transition-colors cursor-pointer"
            >
              {typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="size-3 xl:size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="size-3 xl:size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {/* Notifications */}
            {!loading && user && !isProvider && (
              <>
                <span className="h-3 xl:h-4 w-px bg-border/60 mx-0.5 xl:mx-1" />
                <NotificationsBell />
              </>
            )}

            {/* Account / Auth */}
            {!loading && (
              <>
                <span className="h-3 xl:h-4 w-px bg-border/60 mx-0.5 xl:mx-1" />
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="rounded-full p-1 xl:p-1.5 text-muted-foreground hover:bg-muted dark:hover:bg-white/5 hover:text-foreground transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-3 xl:size-4">
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                        </svg>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-normal" asChild>
                        <Link to="/account" className="flex flex-col space-y-1 cursor-pointer w-full p-2 hover:bg-accent hover:text-accent-foreground rounded-sm transition-colors">
                          <p className="text-sm font-medium leading-none">{t("nav.account")}</p>
                          <p className="text-xs leading-none text-muted-foreground mt-1.5">{user.email}</p>
                        </Link>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {isProvider ? (
                        <>
                          <DropdownMenuItem asChild><Link to="/provider" className="cursor-pointer">{t("nav.provider_dashboard")}</Link></DropdownMenuItem>
                          <DropdownMenuItem asChild><Link to="/support" className="cursor-pointer">{t("nav.support")}</Link></DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem asChild><Link to="/messages" className="cursor-pointer">{t("nav.messages")}</Link></DropdownMenuItem>
                          <DropdownMenuItem asChild><Link to="/support" className="cursor-pointer">{t("nav.support")}</Link></DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} disabled={signingOut} className="cursor-pointer text-destructive focus:bg-destructive/10">
                        {signingOut ? t("nav.signing_out") : t("nav.sign_out")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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

          {/* ── Mobile auth (non-desktop) ── */}
          {!loading && !user && (
            <Link to="/signup" className="lg:hidden hidden sm:block">
              <Button className="h-10 rounded-full px-4 text-sm font-medium cursor-pointer">
                {t("nav.get_started")}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
