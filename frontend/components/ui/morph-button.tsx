"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const MORPH = {
  type: "spring" as const,
  duration: 0.4,
  bounce: 0,
};

type Props = HTMLMotionProps<"a"> & {
  label: string;
  children?: ReactNode;
  className?: string;
};

export function MorphButton({
  label,
  children,
  className,
  ...rest
}: Props) {
  return (
    <motion.a
      {...rest}
      className={cn(
        "relative flex h-[28px] w-[68px] cursor-pointer items-center text-xs font-medium leading-none",
        className
      )}
      initial="default"
      whileHover="hover"
      whileFocus="hover"
      variants={{
        default: { padding: "6px 4px 6px 20px" },
        hover: { padding: "6px 14px 6px 16px" },
      }}
      transition={MORPH}
    >
      {/* Light background — fills by default, shrinks to small pill on the right on hover */}
      <motion.span
        aria-hidden
        className="absolute bg-stone-3"
        variants={{
          default: { left: 0, top: 0, right: 0, bottom: 0, borderRadius: 6 },
          hover: { left: 56, top: 6, right: 6, bottom: 6, borderRadius: 6 },
        }}
        transition={MORPH}
        style={{ zIndex: 1 }}
      />

      {/* Dark pill — thin left pill by default, expands to full on hover */}
      <motion.span
        aria-hidden
        className="absolute bg-stone-12"
        variants={{
          default: { left: 7, top: 6, right: 57, bottom: 6, borderRadius: 2 },
          hover: { left: 0, top: 0, right: 0, bottom: 0, borderRadius: 6 },
        }}
        transition={MORPH}
        style={{ zIndex: 2 }}
      />

      <motion.span
        className="relative inline-flex items-center gap-0.5"
        variants={{
          default: { color: "var(--stone-12)" },
          hover: { color: "var(--stone-1)" },
        }}
        transition={{ duration: 0.2 }}
        style={{ zIndex: 4 }}
      >
        {label}
        <motion.span
          className="inline-flex"
          variants={{
            default: { scale: 1 },
            hover: { scale: 1.4 },
          }}
          transition={MORPH}
        >
          {children}
        </motion.span>
      </motion.span>
    </motion.a>
  );
}
