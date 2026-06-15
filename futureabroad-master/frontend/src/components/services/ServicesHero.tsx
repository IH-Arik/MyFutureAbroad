import type React from "react";

const ServicesHero: React.FC<any> = ({ title, desc }) => {
  return (
    <section className="relative mx-auto mt-12 w-full max-w-[80vw] overflow-hidden rounded-[2rem] py-12 sm:py-32 text-center">
      <img
        src="https://images.unsplash.com/photo-1560264280-88b68371db39?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        className="absolute inset-0 h-full w-full object-cover"
        alt="Professional services landscape"
      />
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <h1 className="text-2xl font-medium leading-[0.85] tracking-[-0.02em] text-white sm:text-4xl lg:text-6xl xl:text-7xl">
          {title}
        </h1>
        <p className="mt-4 sm:mt-6 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed text-white/90">
          {desc}
        </p>
      </div>
    </section>
  );
};

export default ServicesHero;
