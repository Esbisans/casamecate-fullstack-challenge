import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getTopDays } from "@/lib/api";

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const numberFormatter = new Intl.NumberFormat("es-MX");

function formatHumanDate(iso: string) {
  // ISO date with time component pinned to local midnight to avoid timezone
  // shifts that would render the day before in some locales.
  return dateFormatter.format(new Date(`${iso}T00:00:00`));
}

type Props = {
  year?: number;
  apiLimit: number;
};

export async function TopDaysCard({ year, apiLimit }: Props) {
  const days = await getTopDays(year, apiLimit);

  if (days.length === 0) {
    return (
      <EmptyState
        title="Sin datos"
        description="No hay días registrados."
      />
    );
  }

  const [hero, ...rest] = days;
  const otherDays = rest.slice(0, 4);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Día con más vuelos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <p className="text-3xl font-semibold tracking-tight text-foreground">
            {formatHumanDate(hero!.date)}
          </p>
          <p className="text-base text-foreground-muted">
            {numberFormatter.format(hero!.total_flights)} vuelos
          </p>
        </div>

        {otherDays.length > 0 && (
          <>
            <div className="my-6 h-px bg-stone-3" />
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-foreground-faint">
              Otros días destacados
            </p>
            <ul className="divide-y divide-stone-3">
              {otherDays.map((d) => (
                <li
                  key={d.date}
                  className="flex items-center justify-between py-2.5"
                >
                  <span className="text-sm text-foreground">
                    {formatHumanDate(d.date)}
                  </span>
                  <span className="tnum text-sm font-medium text-foreground-muted">
                    {numberFormatter.format(d.total_flights)} vuelos
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
