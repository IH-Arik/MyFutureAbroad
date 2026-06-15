import type React from "react";

const InsuranceProducts: React.FC<any> = ({ products, tr }) => {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{tr[8]}</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-8">{tr[9]}</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: any, idx: number) => (
          <a
            key={idx}
            href={`${product.url}?utm_source=XO6ByCsyM2NHniVQ5uMRAV8FIyM33UzJ`}
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-2xl border p-6 transition-all cursor-pointer group ${product.highlight ? "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 border-blue-200 dark:border-blue-700 ring-2 ring-blue-300 dark:ring-blue-600 hover:ring-blue-400 dark:hover:ring-blue-500" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-600"}`}
          >
            {product.highlight && (
              <div className="mb-3">
                <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">{tr[10]}</span>
              </div>
            )}
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{product.name}</h3>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3">{product.price}</div>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">{product.description}</p>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400"><span className="font-semibold">{tr[11]}</span> {product.goodFor}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default InsuranceProducts;
