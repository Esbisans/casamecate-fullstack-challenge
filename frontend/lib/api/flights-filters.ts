export const FLIGHT_YEARS = ["2021", "2022", "2023"] as const;
export type FlightYear = (typeof FLIGHT_YEARS)[number];

export type YearFilter = FlightYear | "todos";
export type LimitFilter = "1" | "todos";

export const DEFAULT_FLIGHT_YEAR: YearFilter = "todos";
export const DEFAULT_FLIGHT_LIMIT: LimitFilter = "todos";

export function parseYearFilter(raw: string | undefined): YearFilter {
  if (raw === "todos") return "todos";
  if (raw && (FLIGHT_YEARS as readonly string[]).includes(raw)) {
    return raw as FlightYear;
  }
  return DEFAULT_FLIGHT_YEAR;
}

export function parseLimitFilter(raw: string | undefined): LimitFilter {
  return raw === "1" || raw === "todos" ? raw : DEFAULT_FLIGHT_LIMIT;
}

export function yearFilterToQuery(value: YearFilter): number | undefined {
  return value === "todos" ? undefined : Number(value);
}

export function limitFilterToQuery(value: LimitFilter): number {
  return value === "todos" ? 0 : 1;
}
