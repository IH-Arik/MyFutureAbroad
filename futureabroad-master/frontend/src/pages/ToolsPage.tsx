import { Link, useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { DocumentAttachmentIcon, Task01Icon, Wallet01Icon, ShoppingBag01Icon, Calculator01Icon, AiChat02Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-context";
import { translateTexts } from "@/lib/deepl";

export const ToolsPage = () => {
  const { t, i18n } = useTranslation();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [taxTitle, setTaxTitle] = useState("Tax Calculator");
  const [taxDesc, setTaxDesc] = useState("Estimate your take-home pay and tax breakdown for any supported country.");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signup", { replace: true });
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    const lang = i18n.language ?? "en";
    if (lang === "en") { setTaxTitle("Tax Calculator"); setTaxDesc("Estimate your take-home pay and tax breakdown for any supported country."); return; }
    let cancelled = false;
    translateTexts(["Tax Calculator", "Estimate your take-home pay and tax breakdown for any supported country."], lang).then(([title, desc]) => {
      if (cancelled) return;
      setTaxTitle(title ?? "Tax Calculator");
      setTaxDesc(desc ?? "Estimate your take-home pay and tax breakdown for any supported country.");
    });
    return () => { cancelled = true; };
  }, [i18n.language]);

  const tools = [
    {
      title: t("home.visa_finder_title"),
      description: t("home.visa_finder_desc"),
      icon: <HugeiconsIcon icon={Search01Icon} className="h-7 w-7" strokeWidth={1.5} />,
      to: "/visa-finder"
    },
    {
      title: t("tools.orders_title"),
      description: t("tools.orders_desc"),
      icon: <HugeiconsIcon icon={ShoppingBag01Icon} className="h-7 w-7" strokeWidth={1.5} />,
      to: "/orders"
    },
    {
      title: t("tools.documents_title"),
      description: t("tools.documents_desc"),
      icon: <HugeiconsIcon icon={DocumentAttachmentIcon} className="h-7 w-7" strokeWidth={1.5} />,
      to: "/documents"
    },
    {
      title: t("tools.budgets_title"),
      description: t("tools.budgets_desc"),
      icon: <HugeiconsIcon icon={Wallet01Icon} className="h-7 w-7" strokeWidth={1.5} />,
      to: "/budgets"
    },
    {
      title: t("tools.checklists_title"),
      description: t("tools.checklists_desc"),
      icon: <HugeiconsIcon icon={Task01Icon} className="h-7 w-7" strokeWidth={1.5} />,
      to: "/checklists"
    },
    {
      title: taxTitle,
      description: taxDesc,
      icon: <HugeiconsIcon icon={Calculator01Icon} className="h-7 w-7" strokeWidth={1.5} />,
      to: "/tax-calculator"
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[80vw] py-8 sm:px-4 lg:px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2">{t("tools.title")}</h1>
        <p className="text-muted-foreground text-lg">
          {t("tools.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* AI Assistant — full width, rainbow outline */}
        <div className="col-span-1 md:col-span-2 p-[2px] rounded-3xl" style={{ background: "linear-gradient(90deg, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6, #ec4899)" }}>
          <Link
            to="/chats"
            className="group flex items-start gap-6 p-8 bg-white dark:bg-[#1f1f1f] rounded-[22px] shadow-sm hover:shadow-md transition-all duration-300 w-full"
          >
            <div className="shrink-0 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white group-hover:bg-[#1f4865] group-hover:text-white transition-colors duration-300">
              <HugeiconsIcon icon={AiChat02Icon} className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-2xl font-medium text-slate-900 dark:text-white mb-2 group-hover:text-[#1f4865] dark:group-hover:text-[#5b9abf] transition-colors">
                AI Assistant
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Chat with an AI that can look up visas, countries, and services, and help manage your checklists and budgets.
              </p>
            </div>
          </Link>
        </div>

        {tools.map((tool) => (
          <Link
            to={tool.to}
            key={tool.to}
            className="relative group block p-8 bg-white dark:bg-[#1f1f1f] rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-white/20 transition-all duration-300"
          >
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white group-hover:bg-[#1f4865] group-hover:text-white transition-colors duration-300">
              {tool.icon}
            </div>
            <h3 className="text-2xl font-medium text-slate-900 dark:text-white mb-2 group-hover:text-[#1f4865] dark:group-hover:text-[#5b9abf] transition-colors">
              {tool.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};
