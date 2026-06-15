import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Visa, Country } from "@/lib/types";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Task01Icon,
  Globe02Icon,
  ShoppingBag01Icon,
  Wallet01Icon,
  UserGroup02Icon,
  Calculator01Icon,
  CheckmarkCircle02Icon,
  Shield02Icon,
  Clock01Icon,
  Calendar01Icon,
  File02Icon,
  ArrowRight01Icon,
  StarIcon,
  Sun01Icon,
  HeartCheckIcon,
  Tag01Icon,
  LanguageCircleIcon,
  CloudSnowIcon,
} from "@hugeicons/core-free-icons";

const renderIcon = (iconName: string, className = "w-6 h-6") => {
  const iconProps = { className, strokeWidth: 2 } as any;
  switch (iconName) {
    case "task":
      return <HugeiconsIcon icon={Task01Icon} {...iconProps} />;
    case "globe":
      return <HugeiconsIcon icon={Globe02Icon} {...iconProps} />;
    case "briefcase":
      return <HugeiconsIcon icon={ShoppingBag01Icon} {...iconProps} />;
    case "wallet":
      return <HugeiconsIcon icon={Wallet01Icon} {...iconProps} />;
    case "group":
      return <HugeiconsIcon icon={UserGroup02Icon} {...iconProps} />;
    case "calculator":
      return <HugeiconsIcon icon={Calculator01Icon} {...iconProps} />;
    case "check":
      return <HugeiconsIcon icon={CheckmarkCircle02Icon} {...iconProps} />;
    case "star":
      return <HugeiconsIcon icon={StarIcon} {...iconProps} />;
    case "alert":
      return <HugeiconsIcon icon={Shield02Icon} {...iconProps} />;
    case "clock":
      return <HugeiconsIcon icon={Clock01Icon} {...iconProps} />;
    case "calendar":
      return <HugeiconsIcon icon={Calendar01Icon} {...iconProps} />;
    case "edit":
      return <HugeiconsIcon icon={File02Icon} {...iconProps} />;
    case "refresh":
      return <HugeiconsIcon icon={ArrowRight01Icon} {...iconProps} />;
    case "sun":
      return <HugeiconsIcon icon={Sun01Icon} {...iconProps} />;
    case "snowflake":
      return <HugeiconsIcon icon={CloudSnowIcon} {...iconProps} />;
    case "heart":
      return <HugeiconsIcon icon={HeartCheckIcon} {...iconProps} />;
    case "tag":
      return <HugeiconsIcon icon={Tag01Icon} {...iconProps} />;
    case "shield":
      return <HugeiconsIcon icon={Shield02Icon} {...iconProps} />;
    case "language":
      return <HugeiconsIcon icon={LanguageCircleIcon} {...iconProps} />;
    default:
      return null;
  }
};

export default function VisaCard({
  visa,
  tier,
  reasons,
  positiveReasons,
}: {
  visa: Visa & { country?: Country };
  tier: "excellent" | "good" | "match";
  reasons: string[];
  positiveReasons: string[];
}) {
  const { t } = useTranslation();

  const tierColor =
    tier === "excellent"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      : tier === "good"
      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400";
  const tierLabel =
    tier === "excellent" ? t("visa_finder.results_excellent") : tier === "good" ? t("visa_finder.results_good") : t("visa_finder.results_possible");

  return (
    <Link
      to={`/visas/${visa.id}`}
      className="group block bg-card rounded-2xl border border-border p-5 hover:shadow-md hover:border-[#8B6949]/40 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {visa.country?.flag_url && (
            <img
              src={visa.country.flag_url}
              alt={visa.country.name}
              className="w-7 h-5 object-cover rounded-sm"
            />
          )}
          <span className="text-sm text-muted-foreground">{visa.country?.name}</span>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tierColor}`}>
          {tierLabel}
        </span>
      </div>
      <h3 className="font-semibold text-foreground group-hover:text-[#8B6949] transition-colors mb-1">{visa.name}</h3>
      <p className="text-xs text-muted-foreground capitalize mb-3">{visa.visa_type?.replace(/_/g, " ")}</p>
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        {visa.processing_time_days && (
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 text-muted-foreground">{renderIcon("clock", "w-4 h-4")}</span>
            {visa.processing_time_days}{t("visa_finder.processing_days")}
          </span>
        )}
        {visa.application_fee_amount != null && (
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 text-muted-foreground">{renderIcon("wallet", "w-4 h-4")}</span>
            {visa.base_currency || "USD"} {visa.application_fee_amount}
          </span>
        )}
        {visa.validity_months && (
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 text-muted-foreground">{renderIcon("calendar", "w-4 h-4")}</span>
            {visa.validity_months}{t("visa_finder.validity_months")}
          </span>
        )}
      </div>
      {(reasons.length > 0 || positiveReasons.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-1">
          {positiveReasons.map((r) => {
            let label: string;
            if (r === "en_friendly") label = t("visa_finder.prefs.en_friendly_label");
            else if (r.startsWith("lang_")) label = t(`visa_finder.languages.${r.replace("lang_", "")}`);
            else label = t(`visa_finder.prefs.${r}_label`);
            return (
              <span key={r} className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                {label}
              </span>
            );
          })}
          {reasons.map((r) => (
            <span key={r} className="text-xs bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-3 h-3">{renderIcon("alert", "w-3 h-3")}</span>
              {r}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
