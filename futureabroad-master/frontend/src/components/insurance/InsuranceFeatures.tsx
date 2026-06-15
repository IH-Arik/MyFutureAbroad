import type React from "react";
import { HugeiconsIcon } from "@hugeicons/react";

const InsuranceFeatures: React.FC<any> = ({ features }) => {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">{features?.heading}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features?.list?.map((feature: any, idx: number) => (
          <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
            <div className="bg-blue-50 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <HugeiconsIcon icon={feature.icon} className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InsuranceFeatures;
