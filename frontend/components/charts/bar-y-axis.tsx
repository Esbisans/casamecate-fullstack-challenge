"use client";

import { motion } from "motion/react";
import { useMemo } from "react";
import { useChart } from "./chart-context";

export interface BarYAxisProps {
  /** Whether to show all labels or skip some for dense data. Default: true */
  showAllLabels?: boolean;
  /** Maximum number of labels to show. Default: 20 */
  maxLabels?: number;
  /** Pixel offset to the left of the bar start. Default: 8 */
  offsetPx?: number;
}

export function BarYAxis({
  showAllLabels = true,
  maxLabels = 20,
  offsetPx = 8,
}: BarYAxisProps) {
  const { barScale, bandWidth, barXAccessor, data, hoveredBarIndex } =
    useChart();

  const labelsToShow = useMemo(() => {
    if (!(barScale && bandWidth && barXAccessor)) {
      return [];
    }

    const allLabels = data.map((d, i) => {
      const text = barXAccessor(d);
      const bandY = barScale(text) ?? 0;
      return {
        index: i,
        text,
        // y is the band's vertical center in inner-group coordinates.
        // Combined with dominantBaseline="central" the text is centered
        // exactly on the band's middle line.
        y: bandY + bandWidth / 2,
      };
    });

    if (showAllLabels || allLabels.length <= maxLabels) {
      return allLabels;
    }

    const step = Math.ceil(allLabels.length / maxLabels);
    return allLabels.filter((_, i) => i % step === 0);
  }, [barScale, bandWidth, barXAccessor, data, showAllLabels, maxLabels]);

  if (!(barScale && bandWidth && barXAccessor)) return null;

  return (
    <g aria-hidden="true">
      {labelsToShow.map((item) => {
        const isHovered = hoveredBarIndex === item.index;
        return (
          <motion.text
            key={item.index}
            x={-offsetPx}
            y={item.y}
            textAnchor="end"
            dominantBaseline="central"
            style={{ fontSize: 14 }}
            initial={false}
            animate={{
              fill: isHovered
                ? "var(--foreground)"
                : "var(--chart-label, var(--color-zinc-500))",
              opacity: isHovered ? 1 : 0.85,
            }}
            transition={{ duration: 0.15 }}
          >
            {item.text}
          </motion.text>
        );
      })}
    </g>
  );
}

BarYAxis.displayName = "BarYAxis";

export default BarYAxis;
