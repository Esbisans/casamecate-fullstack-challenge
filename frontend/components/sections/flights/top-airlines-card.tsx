import { EmptyState } from "@/components/ui/empty-state";
import { getTopAirlines } from "@/lib/api";
import { RankingBarChart } from "./ranking-bar-chart";

type Props = {
  year?: number;
  apiLimit: number;
};

export async function TopAirlinesCard({ year, apiLimit }: Props) {
  const airlines = await getTopAirlines(year, apiLimit);

  if (airlines.length === 0) {
    return (
      <EmptyState
        title="Sin datos"
        description="No hay aerolíneas registradas."
      />
    );
  }

  return (
    <RankingBarChart
      title="Aerolíneas top"
      subtitle="Por número de vuelos"
      items={airlines.map((a) => ({
        name: a.name,
        value: a.total_flights,
      }))}
    />
  );
}
