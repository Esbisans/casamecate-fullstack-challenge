import type { Variants } from "motion/react";
import { spring, transition } from "./config";

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition.base },
  exit: { opacity: 0, transition: transition.fast },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: spring.soft },
  exit: { opacity: 0, y: 8, transition: transition.fast },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: spring.soft },
  exit: { opacity: 0, scale: 0.98, transition: transition.fast },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = fadeInUp;

export const page: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: transition.page },
  exit: { opacity: 0, y: -8, transition: transition.fast },
};
