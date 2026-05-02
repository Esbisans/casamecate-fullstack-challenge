import { EmptyState } from "@/components/ui/empty-state";
import { getTopAirports } from "@/lib/api";
import { RankingBarChart } from "./ranking-bar-chart";

type Props = {
  year?: number;
  apiLimit: number;
};

export async function TopAirportsCard({ year, apiLimit }: Props) {
  const airports = await getTopAirports(year, apiLimit);

  if (airports.length === 0) {
    return (
      <EmptyState
        title="Sin datos"
        description="No hay aeropuertos registrados."
      />
    );
  }

  return (
    <RankingBarChart
      title="Aeropuertos top"
      subtitle="Por número de movimientos"
      items={airports.map((a) => ({
        name: a.name,
        value: a.total_flights,
      }))}
    />
  );
}
