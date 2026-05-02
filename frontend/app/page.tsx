import { FlightsSection } from "@/components/sections/flights-section";
import { StackOverflowSection } from "@/components/sections/stackoverflow-section";
import { ViewSwitcher } from "@/components/site/view-switcher";
import {
  parseLimitFilter,
  parseYearFilter,
} from "@/lib/api/flights-filters";

type SearchParams = Promise<{ year?: string; limit?: string }>;

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const year = parseYearFilter(sp.year);
  const limit = parseLimitFilter(sp.limit);

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-12">
      <ViewSwitcher
        stackoverflow={<StackOverflowSection />}
        flights={<FlightsSection year={year} limit={limit} />}
      />
    </main>
  );
}
