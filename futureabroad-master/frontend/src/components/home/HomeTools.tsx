import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Wallet01Icon, Task01Icon, DocumentAttachmentIcon } from "@hugeicons/core-free-icons";

const containerVariants = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function HomeTools({ t }: { t: any }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4 }}
      className="mx-auto mt-20 w-full max-w-[80vw] sm:px-4 lg:px-6"
    >
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="text-2xl font-semibold text-foreground mb-6"
      >
        {t("home.tools_title")}
      </motion.h2>
      <motion.div variants={containerVariants} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-40px" }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { to: "/visa-finder", icon: Search01Icon, key: "visa_finder" },
          { to: "/tools", icon: Wallet01Icon, key: "budget" },
          { to: "/tools", icon: Task01Icon, key: "checklist" },
          { to: "/documents", icon: DocumentAttachmentIcon, key: "documents" },
        ].map((item) => (
          <motion.div key={item.key} variants={itemVariants}>
            <Link
              to={item.to}
              className="group block p-5 rounded-2xl border border-border/50 bg-white hover:shadow-md hover:border-border transition-all dark:bg-[#1a1a1a] dark:border-white/10"
            >
              <div className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-slate-900">
                <HugeiconsIcon icon={item.icon} className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-[#8B6949]">{t(`home.${item.key}_title`)}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t(`home.${item.key}_desc`)}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
