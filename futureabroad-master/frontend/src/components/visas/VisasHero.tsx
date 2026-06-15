import type React from "react";

const VisasHero: React.FC<any> = ({ stat, title1, title2 }) => {
  return (
    <section className="relative mx-auto mt-12 w-full max-w-[80vw] overflow-hidden rounded-[2rem] py-12 sm:py-32 text-center">
      <img
        src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2000&q=80"
        className="absolute inset-0 h-full w-full object-cover"
        alt="Mountain travel landscape"
      />
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <div className="mb-4 flex items-center justify-center gap-2 text-sm text-white/70">
          <span>{stat}</span>
        </div>
        <h1 className="text-2xl font-medium leading-[0.85] tracking-[-0.02em] text-white sm:text-4xl lg:text-6xl xl:text-7xl">
          {title1}
          <br />
          {title2}
        </h1>
      </div>
    </section>
  );
};

export default VisasHero;
