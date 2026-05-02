"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { Bar } from "@/components/charts/bar";
import { BarChart } from "@/components/charts/bar-chart";
import { BarValueLabels } from "@/components/charts/bar-value-labels";
import { BarYAxis } from "@/components/charts/bar-y-axis";
import { ChartTooltip } from "@/components/charts/tooltip";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchAirlinesAboveN } from "@/lib/api/flights-actions";
import { cn } from "@/lib/utils";

type Item = {
  airline: string;
  date: string;
  total_flights: number;
};

type Props = {
  year?: number;
  initialThreshold: number;
  initialData: Item[];
};

const MIN = 1;
const MAX = 10;
const TICKS = [1, 5, 10];
const DEBOUNCE_MS = 300;
const ROW_HEIGHT_PX = 44;
const VERTICAL_PADDING_PX = 24;

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatShortDate(iso: string) {
  return dateFormatter.format(new Date(`${iso}T00:00:00`));
}

export function ActiveAirlinesCard({
  year,
  initialThreshold,
  initialData,
}: Props) {
  const sliderId = useId();
  const [threshold, setThreshold] = useState(initialThreshold);
  const [items, setItems] = useState(initialData);
  const [isPending, startTransition] = useTransition();

  const lastFetched = useRef({ threshold: initialThreshold, year });

  // Debounced refetch when threshold or year changes after the initial render.
  useEffect(() => {
    if (
      lastFetched.current.threshold === threshold &&
      lastFetched.current.year === year
    ) {
      return;
    }

    const timer = setTimeout(() => {
      lastFetched.current = { threshold, year };
      startTransition(async () => {
        const next = await fetchAirlinesAboveN(threshold, year);
        setItems(next);
      });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [threshold, year]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Aerolíneas activas</CardTitle>
        <p className="text-sm text-foreground-muted">
          Fechas en las que una aerolínea operó más vuelos que el umbral
          seleccionado
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <label
              htmlFor={sliderId}
              className="text-sm font-medium text-foreground"
            >
              Más de
            </label>
            <div className="relative flex-1">
              <input
                id={sliderId}
                type="range"
                min={MIN}
                max={MAX}
                step={1}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="block h-1.5 w-full cursor-pointer appearance-none rounded-full bg-stone-3 accent-stone-12"
              />
            </div>
            <span className="tnum w-6 text-center text-sm font-semibold text-foreground">
              {threshold}
            </span>
            <span className="text-sm text-foreground-muted">
              vuelos por día
            </span>
          </div>

          {/* Tick labels — positioned by percentage along the slider */}
          <div className="relative ml-[58px] mr-[140px] h-4">
            {TICKS.map((t) => {
              const pct = ((t - MIN) / (MAX - MIN)) * 100;
              const translate =
                t === MIN
                  ? "0"
                  : t === MAX
                    ? "-100%"
                    : "-50%";
              return (
                <span
                  key={t}
                  className="absolute top-0 text-xs text-foreground-faint"
                  style={{
                    left: `${pct}%`,
                    transform: `translateX(${translate})`,
                  }}
                >
                  {t}
                </span>
              );
            })}
          </div>
        </div>

        {/* Bar chart */}
        <div
          data-pending={isPending ? "" : undefined}
          className={cn(
            "transition-opacity duration-200",
            isPending && "opacity-60"
          )}
        >
          {items.length > 0 ? (
            <>
              <BarChart
                data={items.map((item) => ({
                  label: `${item.airline} · ${formatShortDate(item.date)}`,
                  flights: item.total_flights,
                }))}
                xDataKey="label"
                orientation="horizontal"
                height={
                  items.length * ROW_HEIGHT_PX + VERTICAL_PADDING_PX
                }
                margin={{ top: 12, right: 56, bottom: 12, left: 200 }}
                barGap={0.3}
              >
                <Bar
                  dataKey="flights"
                  fill="var(--color-stone-9)"
                  lineCap="round"
                />
                <BarYAxis />
                <BarValueLabels valueKey="flights" />
                <ChartTooltip
                  showCrosshair={false}
                  showDots={false}
                  showDatePill={false}
                  rows={(point) => {
                    const flights = Number(point.flights ?? 0);
                    return [
                      {
                        color: "var(--color-stone-9)",
                        label: "Vuelos en el día",
                        value: `${flights} ${flights === 1 ? "vuelo" : "vuelos"}`,
                      },
                    ];
                  }}
                />
              </BarChart>
              <p className="mt-3 text-xs text-foreground-faint">
                {items.length === 1
                  ? "1 resultado"
                  : `${items.length} resultados`}
              </p>
            </>
          ) : (
            <div className="py-10 text-center text-sm text-foreground-muted">
              No hay combinaciones que superen ese umbral.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
