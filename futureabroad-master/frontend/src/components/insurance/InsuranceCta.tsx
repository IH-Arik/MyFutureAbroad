import type React from "react";

const InsuranceCta: React.FC<any> = ({ tr }) => {
  return (
    <section className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 md:p-12 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">{tr[15]}</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">{tr[16]}</p>
      <a href="https://feather-insurance.com" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
        {tr[17]}
      </a>
    </section>
  );
};

export default InsuranceCta;
