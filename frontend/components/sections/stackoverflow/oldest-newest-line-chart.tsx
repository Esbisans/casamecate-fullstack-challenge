"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line } from "@/components/charts/line-chart";
import { Grid } from "@/components/charts/grid";
import { XAxis } from "@/components/charts/x-axis";
import { ChartTooltip } from "@/components/charts/tooltip";
import type { OldestNewestQuestions, QuestionSummary } from "@/lib/api";
import { cn } from "@/lib/utils";

type Props = {
  data: OldestNewestQuestions;
};

const CHART_MARGIN_LEFT = 96;
const CHART_MARGIN_RIGHT = 96;
const CHART_MARGIN_TOP = 96;
const CHART_MARGIN_BOTTOM = 56;

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  month: "long",
  year: "numeric",
});

function formatMonthYear(date: Date) {
  return dateFormatter.format(date);
}

export function OldestNewestLineChart({ data }: Props) {
  const oldestDate = new Date(data.oldest.creation_date);
  const newestDate = new Date(data.newest.creation_date);
  const yearsBetween = newestDate.getFullYear() - oldestDate.getFullYear();

  const points = [
    {
      date: oldestDate,
      value: 1,
      title: data.oldest.title,
      score: data.oldest.score,
      owner: data.oldest.owner_name,
    },
    {
      date: newestDate,
      value: 1,
      title: data.newest.title,
      score: data.newest.score,
      owner: data.newest.owner_name,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Línea de tiempo</CardTitle>
        <p className="text-sm text-foreground-muted">
          {yearsBetween > 0
            ? `Pregunta más vieja y más nueva — ${yearsBetween} años de diferencia`
            : "Pregunta más vieja y más nueva"}
        </p>
      </CardHeader>
      <CardContent>
        {/* Desktop: horizontal line chart */}
        <div className="relative hidden lg:block">
          <LineChart
            data={points}
            xDataKey="date"
            aspectRatio="3 / 1"
            margin={{
              top: CHART_MARGIN_TOP,
              right: CHART_MARGIN_RIGHT,
              bottom: CHART_MARGIN_BOTTOM,
              left: CHART_MARGIN_LEFT,
            }}
          >
            <Grid horizontal vertical={false} numTicksRows={4} />
            <Line
              dataKey="value"
              stroke="var(--color-stone-12)"
              strokeWidth={2.5}
            />
            <XAxis numTicks={2} />
            <ChartTooltip
              showDatePill
              showCrosshair
              showDots
              rows={(point) => [
                {
                  color: "var(--color-stone-12)",
                  label: String(point.owner ?? ""),
                  value: `puntuación ${point.score ?? ""}`,
                },
              ]}
            />
          </LineChart>

          <QuestionMarker
            eyebrow="Pregunta más vieja"
            question={data.oldest}
            align="left"
            offsetPx={CHART_MARGIN_LEFT}
            topPx={CHART_MARGIN_TOP - 28}
          />
          <QuestionMarker
            eyebrow="Pregunta más nueva"
            question={data.newest}
            align="right"
            offsetPx={CHART_MARGIN_RIGHT}
            topPx={CHART_MARGIN_TOP - 28}
          />
        </div>

        {/* Mobile / tablet: vertical timeline */}
        <div className="lg:hidden">
          <VerticalTimeline
            oldest={data.oldest}
            newest={data.newest}
            oldestLabel={formatMonthYear(oldestDate)}
            newestLabel={formatMonthYear(newestDate)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function QuestionMarker({
  eyebrow,
  question,
  align,
  offsetPx,
  topPx,
}: {
  eyebrow: string;
  question: QuestionSummary;
  align: "left" | "right";
  offsetPx: number;
  topPx: number;
}) {
  const isRight = align === "right";
  const anchor = offsetPx - 8;

  return (
    <a
      href={question.link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group absolute z-10 flex max-w-[22rem] flex-col gap-0.5 rounded-xl bg-surface px-4 py-3 shadow-raised transition-transform hover:-translate-y-0.5",
        isRight ? "text-right" : ""
      )}
      style={{
        top: topPx,
        ...(isRight ? { right: anchor } : { left: anchor }),
      }}
    >
      <span className="text-xs font-medium uppercase tracking-[0.12em] text-foreground-faint">
        {eyebrow}
      </span>
      <span className="text-base font-semibold leading-snug text-foreground">
        {question.title}
      </span>
    </a>
  );
}

function VerticalTimeline({
  oldest,
  newest,
  oldestLabel,
  newestLabel,
}: {
  oldest: QuestionSummary;
  newest: QuestionSummary;
  oldestLabel: string;
  newestLabel: string;
}) {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="absolute left-[7px] top-2 bottom-2 w-px bg-stone-6"
      />
      <div className="flex flex-col gap-6">
        <TimelineItem
          eyebrow="Pregunta más vieja"
          question={oldest}
          dateLabel={oldestLabel}
        />
        <TimelineItem
          eyebrow="Pregunta más nueva"
          question={newest}
          dateLabel={newestLabel}
        />
      </div>
    </div>
  );
}

function TimelineItem({
  eyebrow,
  question,
  dateLabel,
}: {
  eyebrow: string;
  question: QuestionSummary;
  dateLabel: string;
}) {
  return (
    <div className="relative pl-8">
      <span
        aria-hidden
        className="absolute left-0 top-1.5 size-[15px] rounded-full border-2 border-surface bg-stone-12"
      />
      <a
        href={question.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col gap-1"
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-medium uppercase tracking-[0.12em] text-foreground-faint">
            {eyebrow}
          </span>
          <span className="text-xs font-medium text-foreground-muted whitespace-nowrap">
            {dateLabel}
          </span>
        </div>
        <span className="text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-foreground-muted">
          {question.title}
        </span>
      </a>
    </div>
  );
}
