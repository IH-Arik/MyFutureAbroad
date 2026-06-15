import type { FC } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface LinkItem {
  label: string;
  to: string;
}

export interface NavCenterProps {
  navLinks: LinkItem[];
  pathname: string;
}

const NavCenterContent: FC<NavCenterProps> = ({ navLinks, pathname }) => {
  return (
    <nav className="hidden lg:block absolute left-1/2 -translate-x-1/2">
      <div className="flex items-center">
        <div className="flex items-center gap-0.5 lg:gap-1 rounded-full border border-border/40 bg-white dark:bg-[#1f1f1f]/90 px-1.5 lg:px-2 xl:px-3 py-1 xl:py-1.5 shadow-sm backdrop-blur-sm">
          {navLinks.map((link) => {
            const active = pathname === link.to;
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
  );
};

export default NavCenterContent;
