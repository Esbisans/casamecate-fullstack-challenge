"use client";

import { TextMorph } from "torph/react";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
};

const MORPH_EASE = { stiffness: 200, damping: 24 };

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
}: Props) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {eyebrow ? (
        <TextMorph
          ease={MORPH_EASE}
          className="text-xs font-medium uppercase tracking-[0.12em] text-foreground-faint"
        >
          {eyebrow}
        </TextMorph>
      ) : null}
      <TextMorph
        as="h2"
        ease={MORPH_EASE}
        className="text-2xl font-semibold tracking-tight text-foreground"
      >
        {title}
      </TextMorph>
      {description ? (
        <TextMorph
          as="p"
          ease={MORPH_EASE}
          className="max-w-prose text-sm text-foreground-muted"
        >
          {description}
        </TextMorph>
      ) : null}
    </div>
  );
}
