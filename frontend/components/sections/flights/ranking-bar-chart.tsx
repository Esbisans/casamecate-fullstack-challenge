import { Bar } from "@/components/charts/bar";
import { BarChart } from "@/components/charts/bar-chart";
import { BarValueLabels } from "@/components/charts/bar-value-labels";
import { BarYAxis } from "@/components/charts/bar-y-axis";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ROW_HEIGHT_PX = 64;
const VERTICAL_PADDING_PX = 24;

export type RankingItem = {
  name: string;
  value: number;
};

type Props = {
  title: string;
  subtitle: string;
  items: RankingItem[];
};

export function RankingBarChart({ title, subtitle, items }: Props) {
  const data = items.map((it) => ({ name: it.name, value: it.value }));
  const chartHeight = data.length * ROW_HEIGHT_PX + VERTICAL_PADDING_PX;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-foreground-muted">{subtitle}</p>
      </CardHeader>
      <CardContent>
        <BarChart
          data={data}
          xDataKey="name"
          orientation="horizontal"
          height={chartHeight}
          margin={{ top: 12, right: 72, bottom: 12, left: 120 }}
          barGap={0.25}
        >
          <Bar
            dataKey="value"
            fill="var(--color-stone-12)"
            lineCap="round"
          />
          <BarYAxis />
          <BarValueLabels valueKey="value" />
        </BarChart>
      </CardContent>
    </Card>
  );
}
