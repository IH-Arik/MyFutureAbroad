
export default function ProductsGrid({ products, tr }: { products: Array<any>; tr: string[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, idx) => (
        <a
          key={idx}
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`rounded-2xl border p-6 transition-all cursor-pointer group ${
            product.highlight
              ? "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/40 dark:to-emerald-800/40 border-emerald-200 dark:border-emerald-700 ring-2 ring-emerald-300 dark:ring-emerald-600 hover:ring-emerald-400 dark:hover:ring-emerald-500"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-emerald-400 dark:hover:border-emerald-600"
          }`}
        >
          {product.highlight && (
            <div className="mb-3">
              <span className="inline-block px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full">
                {tr[10]}
              </span>
            </div>
          )}
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{product.name}</h3>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-3">{product.price}</div>
          <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">{product.description}</p>
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold">{tr[11]}</span> {product.goodFor}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}
