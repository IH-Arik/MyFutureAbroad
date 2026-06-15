import type React from "react";
import { Link } from "react-router-dom";

const VisasInfo: React.FC<any> = ({ title1, title2, subtitle, ctaLabel, images }) => {
  return (
    <section className="grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center pb-20">
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-4xl font-medium leading-[0.9] tracking-[-0.02em] text-foreground">
          {title1}
          <br />
          {title2}
        </h2>
        <p className="mt-4 sm:mt-6 max-w-lg text-sm sm:text-base lg:text-lg leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
        <div className="mt-8">
          <Link to="/visa-finder" className="group relative inline-flex overflow-hidden rounded-full bg-gradient-to-r from-[#8B6949] to-[#D4C2A1] px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl">
            <span className="relative z-10 flex items-center gap-2">
              {ctaLabel}
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#9c7a58] to-[#e2d2b3] opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 h-80">
        {images.map((image: any, index: number) => {
          let heightClass = "";
          let colSpan = "";
          if (image.size === "large") { heightClass = "h-full"; colSpan = "col-span-2"; }
          else if (image.size === "medium") { heightClass = "h-48"; colSpan = "col-span-1"; }
          else { heightClass = "h-32"; colSpan = "col-span-1"; }
          return (
            <div key={index} className={`relative overflow-hidden rounded-2xl ${colSpan} ${heightClass}`}>
              <img src={image.img} alt={image.alt} className="h-full w-full object-cover" />
              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1">
                <span className="text-[0.625rem] sm:text-xs font-medium text-black dark:text-white">{image.location}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default VisasInfo;
