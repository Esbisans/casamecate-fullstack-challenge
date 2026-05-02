"use client";

import NumberFlow from "@number-flow/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type NumberFlowProps = ComponentProps<typeof NumberFlow>;

type Props = {
  value: number;
  format?: NumberFlowProps["format"];
  className?: string;
  prefix?: string;
  suffix?: string;
};

export function AnimatedNumber({
  value,
  format,
  className,
  prefix,
  suffix,
}: Props) {
  return (
    <NumberFlow
      value={value}
      format={format}
      prefix={prefix}
      suffix={suffix}
      className={cn("tnum", className)}
    />
  );
}
