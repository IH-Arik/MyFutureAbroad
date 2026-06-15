import type React from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { CURRENCY_SYMBOLS } from "@/components/currency/CurrencyProvider";

const MobileMenu: React.FC<any> = ({ NAV_LINKS, location, loading, user, isProvider, t, setCurrency, currency, setTheme, toggleTheme }) => {
  return (
    <div className="lg:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-10 w-10 sm:h-11 sm:w-11 rounded-full border-border/40 bg-white dark:bg-[#1f1f1f]/80 shadow-sm hover:bg-muted dark:hover:bg-white/5 cursor-pointer transition-colors" aria-label="Menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mt-2 shadow-xl border-border/40">
          {NAV_LINKS.map((link: any) => (
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
                <Link to="/signup" className="flex w-full cursor-pointer items-center rounded-md px-3 py-2.5 text-sm font-medium text-primary hover:bg-muted">
                  {t("nav.get_started_signin")}
                </Link>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-3 py-1.5">Settings</DropdownMenuLabel>

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
                {/* simplified list - reuse i18n change elsewhere */}
                <LanguageSwitcher />
              </div>
            </DialogContent>
          </Dialog>

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
                <Link to="/messages" className="cursor-pointer flex items-center gap-2 text-sm px-3 py-2.5">{t("nav.messages")}</Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MobileMenu;
