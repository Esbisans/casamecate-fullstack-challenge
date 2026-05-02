import { Suspense } from "react";
import {
  type LimitFilter,
  type YearFilter,
  limitFilterToQuery,
  yearFilterToQuery,
} from "@/lib/api/flights-filters";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FlightsFilters } from "@/components/sections/flights/flights-filters";
import { TopAirportsCard } from "@/components/sections/flights/top-airports-card";
import { TopAirlinesCard } from "@/components/sections/flights/top-airlines-card";
import { TopDaysCard } from "@/components/sections/flights/top-days-card";
import { ActiveAirlinesCardWrapper } from "@/components/sections/flights/active-airlines-card-wrapper";

type Props = {
  year: YearFilter;
  limit: LimitFilter;
};

function RankingCardSkeleton({ expectedRows }: { expectedRows: number }) {
  return (
    <Card className="h-full p-6">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="mt-2 h-4 w-44" />
      <div className="mt-6 space-y-4">
        {Array.from({ length: expectedRows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 flex-1 rounded-md" />
            <Skeleton className="h-4 w-8" />
          </div>
        ))}
      </div>
    </Card>
  );
}

function ActiveAirlinesSkeleton() {
  return (
    <Card className="h-full p-6">
      <Skeleton className="h-5 w-44" />
      <Skeleton className="mt-2 h-4 w-72" />
      <div className="mt-6 flex items-center gap-4">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-2 flex-1 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="mt-8 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-9 flex-1 rounded-md" />
            <Skeleton className="h-4 w-6" />
          </div>
        ))}
      </div>
    </Card>
  );
}

function TopDaysCardSkeleton({ expectedRows }: { expectedRows: number }) {
  return (
    <Card className="h-full p-6">
      <Skeleton className="h-5 w-44" />
      <div className="mt-6 flex flex-col gap-2">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-5 w-24" />
      </div>
      {expectedRows > 1 && (
        <>
          <div className="my-6 h-px bg-stone-3" />
          <Skeleton className="h-3 w-32" />
          <div className="mt-3 space-y-3">
            {Array.from({ length: expectedRows - 1 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-1"
              >
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}

export function FlightsSection({ year, limit }: Props) {
  const yearNum = yearFilterToQuery(year);
  const apiLimit = limitFilterToQuery(limit);
  const filterKey = `${year}-${limit}`;
  const expectedRows = limit === "todos" ? 5 : 1;

  return (
    <section className="space-y-6">
      <FlightsFilters year={year} limit={limit} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
        <Suspense
          key={`airports-${filterKey}`}
          fallback={<RankingCardSkeleton expectedRows={expectedRows} />}
        >
          <div className="lg:col-span-3">
            <TopAirportsCard year={yearNum} apiLimit={apiLimit} />
          </div>
        </Suspense>
        <Suspense
          key={`airlines-${filterKey}`}
          fallback={<RankingCardSkeleton expectedRows={expectedRows} />}
        >
          <div className="lg:col-span-3">
            <TopAirlinesCard year={yearNum} apiLimit={apiLimit} />
          </div>
        </Suspense>

        <Suspense
          key={`days-${filterKey}`}
          fallback={<TopDaysCardSkeleton expectedRows={expectedRows} />}
        >
          <div className="lg:col-span-3">
            <TopDaysCard year={yearNum} apiLimit={apiLimit} />
          </div>
        </Suspense>

        <Suspense
          key={`active-${year}`}
          fallback={<ActiveAirlinesSkeleton />}
        >
          <div className="lg:col-span-3">
            <ActiveAirlinesCardWrapper year={yearNum} />
          </div>
        </Suspense>
      </div>
    </section>
  );
}
