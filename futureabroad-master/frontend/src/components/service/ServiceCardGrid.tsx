import { motion } from "framer-motion";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { useNavigate } from "react-router-dom";

export interface ServiceCardData {
  id: string;
  title: string;
  service_type: string;
  price_usd?: number;
  currency?: string;
  price_type?: string;
  delivery_days?: number;
  provider?: string;
}

const SERVICE_TYPE_LABELS: Record<string, string> = {
  visa_application: "Visa Application",
  document_preparation: "Document Prep",
  document_translation: "Translation",
  consultation: "Consultation",
  tax_planning: "Tax Planning",
  relocation_package: "Relocation",
  legal_consultation: "Legal",
  insurance: "Insurance",
};

export default function ServiceCardGrid({ services }: { services: ServiceCardData[] }) {
  const { formatAmount } = useCurrency();
  const navigate = useNavigate();
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{once:true,margin:"-40px"}} variants={{visible:{transition:{staggerChildren:0.05}}}} className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 my-2 sm:my-3 not-prose">
      {services.map((s) => (
        <motion.div key={s.id} variants={{hidden:{opacity:0,y:12},visible:{opacity:1,y:0,transition:{duration:0.25}}}}>
        <button
          key={s.id}
          onClick={() => navigate(`/services/${s.service_type}/${s.id}`)}
          className="rounded-xl sm:rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#252525] p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 hover:border-[#1f4865] dark:hover:border-[#5b9abf] hover:shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer text-left"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">{s.title}</p>
            {s.service_type && (
              <span className="shrink-0 text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded-full bg-[#1f4865]/10 dark:bg-[#1f4865]/30 text-[#1f4865] dark:text-[#5b9abf]">
                {SERVICE_TYPE_LABELS[s.service_type] ?? s.service_type.replace(/_/g, " ")}
              </span>
            )}
          </div>

          {s.provider && (
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 -mt-1">{s.provider}</p>
          )}

          <div className="grid grid-cols-3 gap-1 text-center">
            {s.price_usd != null && (
              <div className="rounded-lg sm:rounded-xl bg-white dark:bg-[#1f1f1f] border border-slate-100 dark:border-white/10 px-1.5 sm:px-2 py-1 sm:py-1.5">
                <p className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500">Price</p>
                <p className="text-[10px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200">{formatAmount(s.price_usd, s.currency || "USD")}</p>
              </div>
            )}
            {s.price_type && (
              <div className="rounded-lg sm:rounded-xl bg-white dark:bg-[#1f1f1f] border border-slate-100 dark:border-white/10 px-1.5 sm:px-2 py-1 sm:py-1.5">
                <p className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500">Billing</p>
                <p className="text-[10px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 capitalize truncate">{s.price_type}</p>
              </div>
            )}
            {s.delivery_days != null && (
              <div className="rounded-lg sm:rounded-xl bg-white dark:bg-[#1f1f1f] border border-slate-100 dark:border-white/10 px-1.5 sm:px-2 py-1 sm:py-1.5">
                <p className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500">Delivery</p>
                <p className="text-[10px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200">{s.delivery_days}d</p>
              </div>
            )}
          </div>

          <span className="ml-auto text-[10px] sm:text-[11px] font-medium text-[#1f4865] dark:text-[#5b9abf]">
            View service →
          </span>
        </button>
        </motion.div>
      ))}
    </motion.div>
  );
}
