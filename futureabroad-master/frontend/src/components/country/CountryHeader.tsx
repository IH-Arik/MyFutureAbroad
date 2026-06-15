import type React from "react";
import ReactMarkdown from "react-markdown";

const CountryHeader: React.FC<any> = ({ country, translatedCountry }) => {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-white/10 p-6 lg:p-8 bg-white dark:bg-[#1f1f1f]">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {country.flag_url && (
                <img src={country.flag_url} alt={`${translatedCountry?.name ?? country.name} flag`} className="h-6 w-auto rounded shadow-sm" />
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">{translatedCountry?.name ?? country.name}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">ISO {country.iso_code}</p>
              </div>
            </div>
          </div>

          {country.description && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h2: ({ node, ...props }) => <h2 className="text-lg font-semibold text-slate-900 dark:text-white mt-4 mb-2" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300" {...props} />,
                  li: ({ node, ...props }) => <li className="text-sm text-slate-700 dark:text-slate-300" {...props} />,
                  p: ({ node, ...props }) => <p className="text-sm text-slate-700 dark:text-slate-300" {...props} />,
                }}
              >
                {translatedCountry?.description ?? country.description}
              </ReactMarkdown>
            </div>
          )}
        </div>

        <div>
          {country.highlight_img_url ? (
            <img src={country.highlight_img_url} alt={country.name} className="w-full h-96 object-cover rounded-2xl shadow-sm" />
          ) : (
            <div className="w-full h-96 bg-slate-200 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400">No image</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryHeader;
