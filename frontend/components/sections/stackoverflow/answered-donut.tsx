"use client";

import { useState } from "react";
import { PieChart } from "@/components/charts/pie-chart";
import { PieSlice } from "@/components/charts/pie-slice";
import { PieCenter } from "@/components/charts/pie-center";
import type { AnsweredStats } from "@/lib/api";
import { cn } from "@/lib/utils";

type Props = {
  data: AnsweredStats;
};

export function AnsweredDonut({ data }: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const total = data.answered + data.unanswered;
  const answeredPct = total > 0 ? (data.answered / total) * 100 : 0;
  const unansweredPct = total > 0 ? (data.unanswered / total) * 100 : 0;

  const slices = [
    {
      label: "Contestadas",
      value: data.answered,
      color: "var(--color-stone-12)",
    },
    {
      label: "Sin contestar",
      value: data.unanswered,
      color: "var(--color-azure-400)",
    },
  ];

  return (
    <div className="flex h-full flex-col items-center justify-between gap-4">
      <div className="flex w-full justify-center">
        <PieChart
          data={slices}
          size={180}
          innerRadius={56}
          padAngle={0.04}
          cornerRadius={6}
          hoveredIndex={hoveredIndex}
          onHoverChange={setHoveredIndex}
        >
          {slices.map((_, index) => (
            <PieSlice key={index} index={index} hoverEffect="grow" />
          ))}
          <PieCenter
            defaultLabel="Preguntas"
            valueClassName="text-2xl font-semibold tracking-tight tnum text-foreground"
            labelClassName="text-[10px] font-medium uppercase tracking-[0.12em] text-foreground-faint"
          />
        </PieChart>
      </div>

      <div className="flex w-full flex-col gap-1 text-sm">
        <LegendRow
          color="var(--color-stone-12)"
          label="Contestadas"
          value={data.answered}
          pct={answeredPct}
          isActive={hoveredIndex === 0}
          onHover={(active) => setHoveredIndex(active ? 0 : null)}
        />
        <LegendRow
          color="var(--color-azure-400)"
          label="Sin contestar"
          value={data.unanswered}
          pct={unansweredPct}
          isActive={hoveredIndex === 1}
          onHover={(active) => setHoveredIndex(active ? 1 : null)}
        />
      </div>
    </div>
  );
}

function LegendRow({
  color,
  label,
  value,
  pct,
  isActive,
  onHover,
}: {
  color: string;
  label: string;
  value: number;
  pct: number;
  isActive: boolean;
  onHover: (active: boolean) => void;
}) {
  return (
    <button
      type="button"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      className={cn(
        "flex items-center justify-between gap-3 rounded-md px-2 py-1.5 transition-colors",
        isActive ? "bg-accent" : "hover:bg-accent"
      )}
    >
      <span className="flex items-center gap-2 text-foreground-muted">
        <span
          className="size-2.5 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden
        />
        {label}
      </span>
      <span className="tnum font-medium text-foreground">
        {value}
        <span className="ml-1.5 text-foreground-faint">{pct.toFixed(0)}%</span>
      </span>
    </button>
  );
}
