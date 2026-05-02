"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Code2, Plane, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

type ViewKey = "stackoverflow" | "flights";

type ViewItem = {
  key: ViewKey;
  label: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
};

const views: ViewItem[] = [
  {
    key: "stackoverflow",
    label: "StackOverflow",
    icon: Code2,
    eyebrow: "Sección 1",
    title: "StackOverflow · perl",
    description: "Métricas de preguntas etiquetadas con Perl en Stack Exchange.",
  },
  {
    key: "flights",
    label: "Vuelos",
    icon: Plane,
    eyebrow: "Sección 2",
    title: "Vuelos México",
    description: "Movimientos por aeropuerto, aerolínea y día durante el año.",
  },
];

const TRANSITION = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 0.5,
  duration: 0.5,
};

const SWAP_VARIANTS = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

type Props = {
  stackoverflow: React.ReactNode;
  flights: React.ReactNode;
  defaultView?: ViewKey;
};

export function ViewSwitcher({
  stackoverflow,
  flights,
  defaultView = "stackoverflow",
}: Props) {
  const [view, setView] = useState<ViewKey>(defaultView);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabElementRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const activeTabElement = activeTabElementRef.current;
    if (!activeTabElement) return;

    const { offsetLeft, offsetWidth } = activeTabElement;
    const clipLeft = offsetLeft;
    const clipRight = offsetLeft + offsetWidth;
    container.style.clipPath = `inset(0 ${Number(
      100 - (clipRight / container.offsetWidth) * 100
    ).toFixed()}% 0 ${Number(
      (clipLeft / container.offsetWidth) * 100
    ).toFixed()}% round 17px)`;
  }, [view]);

  const content = view === "stackoverflow" ? stackoverflow : flights;
  const activeView = views.find((v) => v.key === view) ?? views[0]!;

  return (
    <MotionConfig transition={TRANSITION}>
      <div className="space-y-10">
        <div className="flex justify-center">
          <div className="relative w-fit">
            <div className="relative flex w-full justify-center gap-1.5">
              {views.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    ref={item.key === view ? activeTabElementRef : null}
                    onClick={() => setView(item.key)}
                    type="button"
                    className={cn(
                      "flex h-[34px] items-center gap-2 rounded-full px-4 text-sm font-medium whitespace-nowrap",
                      "text-foreground-muted transition-colors hover:text-foreground"
                    )}
                  >
                    <Icon className="size-4" strokeWidth={1.75} />
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div
              ref={containerRef}
              aria-hidden
              className="absolute top-0 left-0 z-10 w-full overflow-hidden"
              style={{
                transition: "clip-path 0.25s ease",
                clipPath: "inset(0 50% 0 0% round 17px)",
              }}
            >
              <div className="relative flex w-full justify-center gap-1.5 bg-primary">
                {views.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setView(item.key)}
                      type="button"
                      tabIndex={-1}
                      className="flex h-[34px] items-center gap-2 rounded-full px-4 text-sm font-medium text-primary-foreground whitespace-nowrap"
                    >
                      <Icon className="size-4" strokeWidth={1.75} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <SectionHeader
          eyebrow={activeView.eyebrow}
          title={activeView.title}
          description={activeView.description}
        />

        <div className="relative">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={view}
              variants={SWAP_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}
