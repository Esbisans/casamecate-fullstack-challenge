"use client";

import { useEffect, useState } from "react";
import { useChart } from "./chart-context";

export interface BarValueLabelsProps {
  /** Key in data containing the numeric value.
   *  Named `valueKey` (not `dataKey`) so the BarChart's child-detection
   *  heuristic doesn't misclassify this label component as another bar series. */
  valueKey: string;
  /** Optional formatter for the value. Default: Intl.NumberFormat with es-MX locale */
  formatter?: (value: number) => string;
  /** Pixel offset from the end of the bar. Default: 8 */
  offsetPx?: number;
}

const defaultFormatter = (value: number) =>
  new Intl.NumberFormat("es-MX").format(value);

const BASE_DELAY_SEC = 0.35;
const FADE_DURATION_MS = 300;
const EASING = "cubic-bezier(0.85, 0, 0.15, 1)";

type AnimatedValueLabelProps = {
  text: string;
  x: number;
  y: number;
  delayMs: number;
  isHovered: boolean;
};

function AnimatedValueLabel({
  text,
  x,
  y,
  delayMs,
  isHovered,
}: AnimatedValueLabelProps) {
  const [isAnimated, setIsAnimated] = useState(false);

  // Same double-rAF + setTimeout pattern as the Bar component, so the
  // initial render with opacity:0 paints before we flip to the target.
  useEffect(() => {
    let raf1 = 0;
    let raf2 = 0;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (delayMs > 0) {
          timeout = setTimeout(() => setIsAnimated(true), delayMs);
        } else {
          setIsAnimated(true);
        }
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      if (timeout) clearTimeout(timeout);
    };
  }, [delayMs]);

  const targetOpacity = isAnimated ? (isHovered ? 1 : 0.9) : 0;
  const slideX = isAnimated ? 0 : -8;

  return (
    <text
      x={x}
      y={y}
      textAnchor="start"
      dominantBaseline="central"
      style={{
        fontSize: 14,
        fontWeight: 600,
        fill: "var(--foreground)",
        opacity: targetOpacity,
        transform: `translateX(${slideX}px)`,
        transition: `opacity ${FADE_DURATION_MS}ms ease, transform ${FADE_DURATION_MS}ms ${EASING}`,
      }}
    >
      {text}
    </text>
  );
}

export function BarValueLabels({
  valueKey,
  formatter = defaultFormatter,
  offsetPx = 8,
}: BarValueLabelsProps) {
  const {
    barScale,
    bandWidth,
    barXAccessor,
    data,
    yScale,
    orientation,
    hoveredBarIndex,
    animationDuration,
  } = useChart();

  if (!(barScale && bandWidth && barXAccessor)) return null;
  if (orientation !== "horizontal") return null;

  // Match the Bar component's stagger so each value tracks its own bar
  // rather than waiting for the chart-wide isLoaded flag (which fired at
  // ~1100ms and made the values appear too late).
  const totalAnimDuration = animationDuration || 1100;
  const staggerSpreadSec = (totalAnimDuration * 0.4) / 1000;
  const perBarStagger =
    data.length > 1 ? staggerSpreadSec / data.length : 0;

  return (
    <g aria-hidden="true">
      {data.map((d, i) => {
        const value = d[valueKey];
        if (typeof value !== "number") return null;

        const cat = barXAccessor(d);
        const bandPos = barScale(cat) ?? 0;
        const valuePos = yScale(value) ?? 0;
        const delayMs = (BASE_DELAY_SEC + i * perBarStagger) * 1000;

        return (
          <AnimatedValueLabel
            key={`${cat}-${i}`}
            text={formatter(value)}
            x={valuePos + offsetPx}
            y={bandPos + bandWidth / 2}
            delayMs={delayMs}
            isHovered={hoveredBarIndex === i}
          />
        );
      })}
    </g>
  );
}

BarValueLabels.displayName = "BarValueLabels";

export default BarValueLabels;
