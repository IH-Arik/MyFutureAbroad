import { motion, type Variants } from "framer-motion";

/* ── Stagger container for lists of items ── */
export const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

/* ── Simple fade-up for sections ── */
export const fadeUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

/* ── Scale on hover for cards ── */
export const hoverScale = {
  whileHover: { scale: 1.02, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 },
};

/* ── Shared motion components ── */
export const MotionDiv = motion.div;
export const MotionSpan = motion.span;
export const MotionButton = motion.button;
export const MotionImg = motion.img;
export const MotionSection = motion.section;
