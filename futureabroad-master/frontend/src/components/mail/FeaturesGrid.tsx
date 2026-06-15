import { HugeiconsIcon } from "@hugeicons/react";

export default function FeaturesGrid({ features }: { features: Array<{ icon: any; title: string; description: string }>; }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature, idx) => (
        <div
          key={idx}
          className="cursor-default bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow"
        >
          <div className="bg-emerald-50 dark:bg-emerald-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <HugeiconsIcon icon={feature.icon} className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
