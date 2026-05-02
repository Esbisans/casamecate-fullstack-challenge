import type { ComponentProps } from "react";
import NumberFlow from "@number-flow/react";
import { Card } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: number | string;
  sublabel?: React.ReactNode;
  format?: ComponentProps<typeof NumberFlow>["format"];
  prefix?: string;
  suffix?: string;
  className?: string;
};

export function KpiCard({
  label,
  value,
  sublabel,
  format,
  prefix,
  suffix,
  className,
}: Props) {
  return (
    <Card className={cn("p-6", className)}>
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-foreground-faint">
        {label}
      </p>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
        {typeof value === "number" ? (
          <AnimatedNumber
            value={value}
            format={format}
            prefix={prefix}
            suffix={suffix}
          />
        ) : (
          <span>{value}</span>
        )}
      </div>
      {sublabel ? (
        <p className="mt-1.5 text-sm text-foreground-muted">{sublabel}</p>
      ) : null}
    </Card>
  );
}
