"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowBigUp, Eye } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";

const numberFormatter = new Intl.NumberFormat("es-MX");

const HL_SPRING = { type: "spring" as const, stiffness: 250, damping: 26 };
const TEXT_SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };
const SLIDE = 80;
const TOOLTIP_ENTRY_OFFSET = 24;

const textVariants = {
  enter: (d: number) => ({ x: d * SLIDE, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: -d * SLIDE, opacity: 0 }),
};

type Stat = {
  id: string;
  icon: React.ReactNode;
  value: number;
  label: string;
};

type Props = {
  score: number;
  views: number;
};

export function QuestionStats({ score, views }: Props) {
  const stats: Stat[] = [
    {
      id: "score",
      icon: (
        <ArrowBigUp
          className="size-4 text-foreground-faint"
          strokeWidth={1.75}
        />
      ),
      value: score,
      label: "Puntuación",
    },
    {
      id: "views",
      icon: (
        <Eye className="size-4 text-foreground-faint" strokeWidth={1.75} />
      ),
      value: views,
      label: "Vistas",
    },
  ];

  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const prevRef = useRef<number | null>(null);
  const [dir, setDir] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const measureRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<number[]>([]);
  const [labelWidths, setLabelWidths] = useState<number[]>([]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const next = itemRefs.current.map((el) => {
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      return rect.left - containerRect.left + rect.width / 2;
    });
    setPositions(next);
  }, []);

  useLayoutEffect(() => {
    const measure = measureRef.current;
    if (!measure) return;
    const widths = Array.from(measure.children).map((el) =>
      Math.ceil((el as HTMLElement).getBoundingClientRect().width)
    );
    setLabelWidths(widths);
  }, []);

  function onEnter(i: number) {
    if (prevRef.current !== null && prevRef.current !== i) {
      setDir(i > prevRef.current ? 1 : -1);
    }
    prevRef.current = i;
    setActiveIdx(i);
  }

  function onLeave() {
    prevRef.current = null;
    setActiveIdx(null);
  }

  const activeStat = activeIdx !== null ? stats[activeIdx] : null;
  const activeX = activeIdx !== null ? positions[activeIdx] ?? 0 : 0;
  const activeW = activeIdx !== null ? labelWidths[activeIdx] : undefined;
  // Entry direction for the tooltip box itself — based on which item is hovered,
  // not on the inter-item slide direction (`dir`).
  const entrySign =
    activeIdx !== null
      ? activeIdx <= (stats.length - 1) / 2
        ? -1
        : 1
      : 0;

  return (
    <div ref={containerRef} className="relative w-fit" onMouseLeave={onLeave}>
      {/* Hidden measurement replicas for tooltip width */}
      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute -top-[9999px] -left-[9999px]"
      >
        {stats.map((s) => (
          <span
            key={s.id}
            className="inline-flex items-center px-2.5 py-1 text-xs font-medium whitespace-nowrap"
          >
            {s.label}
          </span>
        ))}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {activeStat && (
          <motion.div
            key="tooltip-wrapper"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute bottom-full left-0 z-50 mb-1.5"
          >
            <motion.div
              initial={{ x: activeX + entrySign * TOOLTIP_ENTRY_OFFSET }}
              animate={{ x: activeX }}
              transition={HL_SPRING}
              className="absolute bottom-0 left-0"
            >
              <div className="-translate-x-1/2">
                <motion.div
                  initial={false}
                  animate={activeW ? { width: activeW } : undefined}
                  transition={HL_SPRING}
                  className="relative h-7 overflow-hidden rounded-md bg-stone-12 shadow-md"
                >
                  <AnimatePresence custom={dir} initial={false}>
                    <motion.span
                      key={activeStat.id}
                      custom={dir}
                      variants={textVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={TEXT_SPRING}
                      className="absolute inset-0 flex items-center justify-center px-2.5 text-xs font-medium whitespace-nowrap text-stone-1"
                    >
                      {activeStat.label}
                    </motion.span>
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats row */}
      <div className="flex items-center gap-1 text-sm">
        {stats.map((s, i) => (
          <div
            key={s.id}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            onMouseEnter={() => onEnter(i)}
            className="relative flex cursor-default items-center gap-1 px-2 py-1"
          >
            {activeIdx === i && (
              <motion.span
                layoutId="stat-hl"
                aria-hidden
                className="absolute inset-0 rounded-md bg-accent"
                transition={HL_SPRING}
              />
            )}
            <span className="relative z-10 flex items-center gap-1 text-foreground">
              {s.icon}
              <span className="tnum font-medium">
                {numberFormatter.format(s.value)}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
