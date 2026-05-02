"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  DEFAULT_FLIGHT_LIMIT,
  DEFAULT_FLIGHT_YEAR,
  type LimitFilter,
  type YearFilter,
} from "@/lib/api/flights-filters";

const YEAR_OPTIONS: { value: YearFilter; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "2021", label: "2021" },
  { value: "2022", label: "2022" },
  { value: "2023", label: "2023" },
];

const LIMIT_OPTIONS: { value: LimitFilter; label: string }[] = [
  { value: "1", label: "1" },
  { value: "todos", label: "Todos" },
];

type Props = {
  year: YearFilter;
  limit: LimitFilter;
};

export function FlightsFilters({ year, limit }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const update = (key: "year" | "limit", value: string, defaultValue: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === defaultValue) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  return (
    <div
      data-pending={isPending ? "" : undefined}
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-foreground-faint">
          Año
        </span>
        <SegmentedControl<YearFilter>
          options={YEAR_OPTIONS}
          value={year}
          onChange={(v) => update("year", v, DEFAULT_FLIGHT_YEAR)}
          layoutId="flights-year-filter"
          ariaLabel="Filtrar por año"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-foreground-faint">
          Mostrar
        </span>
        <SegmentedControl<LimitFilter>
          options={LIMIT_OPTIONS}
          value={limit}
          onChange={(v) => update("limit", v, DEFAULT_FLIGHT_LIMIT)}
          layoutId="flights-limit-filter"
          ariaLabel="Cuántos resultados mostrar"
        />
      </div>
    </div>
  );
}
