"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const SPRING = { type: "spring" as const, stiffness: 250, damping: 26 };

type Option<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  layoutId: string;
  ariaLabel?: string;
  className?: string;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  layoutId,
  ariaLabel,
  className,
}: Props<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "relative inline-flex rounded-full bg-stone-3 p-1 text-sm font-medium",
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => {
              if (!active) onChange(opt.value);
            }}
            className={cn(
              "relative z-10 rounded-full px-4 py-1 transition-colors",
              active
                ? "text-primary-foreground"
                : "text-foreground-muted hover:text-foreground"
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                aria-hidden
                className="absolute inset-0 rounded-full bg-primary"
                transition={SPRING}
              />
            )}
            <span className="relative">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
