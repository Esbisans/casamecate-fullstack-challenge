"use client";

import { MotionConfig } from "motion/react";
import { transition } from "./config";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig transition={transition.base} reducedMotion="user">
      {children}
    </MotionConfig>
  );
}
