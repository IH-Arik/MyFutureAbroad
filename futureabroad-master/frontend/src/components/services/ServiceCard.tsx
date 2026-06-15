import type React from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";

const ServiceCard: React.FC<any> = ({ to, icon, title, subtitle, desc, cardClass }) => {
  return (
    <Link to={to} className={`${cardClass} relative group block p-8 bg-white dark:bg-[#1f1f1f] rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-white/20 transition-all duration-300`}>
      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white transition-colors duration-300">
        <HugeiconsIcon icon={icon} className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <h3 className="text-2xl font-medium text-slate-900 dark:text-white mb-2 transition-colors">{title}</h3>
      <p className="font-medium text-sm text-slate-500 dark:text-slate-400 mb-4">{subtitle}</p>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
    </Link>
  );
};

export default ServiceCard;
