// ServiceTypeCard.tsx
import { Link } from "react-router-dom";
import type { ServiceType } from "@/lib/types";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  File02Icon, 
  JusticeScale01Icon, 
  Home02Icon, 
  TranslateIcon, 
  Shield02Icon, 
  UserGroup02Icon, 
  Calculator01Icon 
} from "@hugeicons/core-free-icons";

const iconMap: { [key: string]: any } = {
  "file-text": File02Icon,
  "scale": JusticeScale01Icon,
  "home": Home02Icon,
  "languages": TranslateIcon,
  "shield": Shield02Icon,
  "users": UserGroup02Icon,
  "calculator": Calculator01Icon,
};

interface ServiceTypeCardProps {
  category: ServiceType;
  count?: number;
}

export function ServiceTypeCard({ category, count = 0 }: ServiceTypeCardProps) {
  const IconDef = iconMap[category.icon] || File02Icon;
  
  return (
    <Link
      to={`/services/${category.id}`}
      className="relative group block p-8 bg-white dark:bg-[#1f1f1f] rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-white/20 transition-all duration-300"
    >
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300">
          {count}
        </span>
      </div>
      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white group-hover:bg-[#1f4865] group-hover:text-white transition-colors duration-300">
        <HugeiconsIcon icon={IconDef} className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <h3 className="text-2xl font-medium text-slate-900 dark:text-white mb-2 group-hover:text-[#1f4865] dark:group-hover:text-[#5b9abf] transition-colors">
        {category.name}
      </h3>
      <p className="font-medium text-sm text-slate-500 dark:text-slate-400 mb-4">{category.tagline}</p>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{category.description}</p>
    </Link>
  );
}
