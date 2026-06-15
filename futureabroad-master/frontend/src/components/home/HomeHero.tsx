import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type Props = {
  title1: string;
  title2: string;
  title3: string;
  subtitle: string;
  ctaLabel: string;
};

const container = {
  animate: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const child = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function HomeHero({ title1, title2, title3, subtitle, ctaLabel }: Props) {
  return (
    <div className="rounded-[2rem]">
      <div className="relative">
        <div className="relative h-[300px] overflow-hidden rounded-[1.7rem] sm:h-[520px] lg:h-[620px]">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1, transition: { duration: 1.2, ease: "easeOut" } }}
            alt="Mountain valley landscape"
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/45 to-slate-950/20" />
          <div className="absolute inset-0 z-10 flex items-center justify-start">
            <motion.div
              variants={container}
              initial="initial"
              animate="animate"
              className="w-full max-w-full px-5 py-4 sm:px-10 lg:px-20 lg:max-w-3xl"
            >
              <motion.h1 variants={child} className="text-xl leading-[1.05] font-semibold tracking-[-0.03em] sm:text-3xl lg:text-5xl max-w-none sm:max-w-3xl">
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(to right, #A7865C, #ffffff)" }}
                >
                  {title1}
                  <br />
                  {title2}
                </span>
                <br />
                <span className="text-white">{title3}</span>
              </motion.h1>
              <motion.p variants={child} className="mt-4 sm:mt-8 text-sm sm:text-lg leading-relaxed text-white/80 max-w-xs sm:max-w-3xl">
                {subtitle}
              </motion.p>
              <motion.div variants={child} className="mt-4 sm:mt-6">
                <Link
                  to="/visa-finder"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8B6949] to-[#D4C2A1] px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:from-[#9c7a58] hover:to-[#e2d2b3]"
                >
                  {ctaLabel}
                  <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
