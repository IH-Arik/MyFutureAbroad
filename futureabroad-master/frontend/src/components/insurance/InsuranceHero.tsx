import type React from "react";

const InsuranceHero: React.FC<any> = ({ title, subtitle, ratingText }) => {
  return (
    <div className="mb-16">
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
        {title}
      </h1>
      <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mb-4">{subtitle}</p>
      {ratingText && <div className="text-lg text-slate-500 dark:text-slate-500">{ratingText}</div>}
    </div>
  );
};

export default InsuranceHero;
