import { cacheLife, cacheTag } from "next/cache";
import {
  flightsAirlinesFlightsPerDay,
  flightsTopAirlines,
  flightsTopAirports,
  flightsTopDays,
} from "./generated";

export async function getTopAirports(year?: number, limit?: number) {
  "use cache";
  cacheLife("hours");
  cacheTag(
    "flights:airports",
    `flights:airports:${year ?? "all"}:${limit ?? "default"}`
  );

  const { data } = await flightsTopAirports({
    query: {
      ...(year !== undefined && { year }),
      ...(limit !== undefined && { limit }),
    },
    throwOnError: true,
  });
  return data ?? [];
}

export async function getTopAirlines(year?: number, limit?: number) {
  "use cache";
  cacheLife("hours");
  cacheTag(
    "flights:airlines",
    `flights:airlines:${year ?? "all"}:${limit ?? "default"}`
  );

  const { data } = await flightsTopAirlines({
    query: {
      ...(year !== undefined && { year }),
      ...(limit !== undefined && { limit }),
    },
    throwOnError: true,
  });
  return data ?? [];
}

export async function getTopDays(year?: number, limit?: number) {
  "use cache";
  cacheLife("hours");
  cacheTag(
    "flights:days",
    `flights:days:${year ?? "all"}:${limit ?? "default"}`
  );

  const { data } = await flightsTopDays({
    query: {
      ...(year !== undefined && { year }),
      ...(limit !== undefined && { limit }),
    },
    throwOnError: true,
  });
  return data ?? [];
}

export async function getAirlinesAboveN(moreThan = 2, year?: number) {
  "use cache";
  cacheLife("hours");
  cacheTag(
    "flights:airlines-per-day",
    `flights:airlines-per-day:${moreThan}:${year ?? "all"}`
  );

  const { data } = await flightsAirlinesFlightsPerDay({
    query: { more_than: moreThan, ...(year !== undefined && { year }) },
    throwOnError: true,
  });
  return data ?? [];
}
