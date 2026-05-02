import type { Transition } from "motion/react";

export const duration = {
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
  page: 0.35,
} as const;

export const easing = {
  out: [0.22, 1, 0.36, 1],
  in: [0.64, 0, 0.78, 0],
  inOut: [0.65, 0, 0.35, 1],
  standard: [0.4, 0, 0.2, 1],
} as const;

export const spring = {
  soft: { type: "spring", stiffness: 260, damping: 28 },
  snappy: { type: "spring", stiffness: 400, damping: 32 },
  bouncy: { type: "spring", stiffness: 300, damping: 18 },
  gentle: { type: "spring", stiffness: 180, damping: 24 },
} as const satisfies Record<string, Transition>;

export const transition = {
  fast: { duration: duration.fast, ease: easing.out },
  base: { duration: duration.base, ease: easing.out },
  slow: { duration: duration.slow, ease: easing.out },
  page: { duration: duration.page, ease: easing.standard },
} as const satisfies Record<string, Transition>;
