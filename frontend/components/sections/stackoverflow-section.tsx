import { Suspense } from "react";
import {
  getAnsweredCount,
  getLeastViewsQuestion,
  getOldestNewestQuestions,
  getTopScoreQuestion,
} from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AnsweredDonut } from "@/components/sections/stackoverflow/answered-donut";
import { OldestNewestLineChart } from "@/components/sections/stackoverflow/oldest-newest-line-chart";
import { QuestionCard } from "@/components/sections/stackoverflow/question-card";

function DonutSkeleton() {
  return (
    <Card className="p-6">
      <Skeleton className="mx-auto mt-2 size-[180px] rounded-full" />
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </Card>
  );
}

function QuestionCardSkeleton() {
  return (
    <Card className="flex h-full flex-col gap-4 p-6">
      <Skeleton className="h-3 w-20" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="mt-auto space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-40" />
      </div>
    </Card>
  );
}

function TimelineSkeleton() {
  return (
    <Card className="p-6">
      <Skeleton className="h-5 w-44" />
      <Skeleton className="mt-2 h-4 w-72" />
      <div className="mt-8 grid grid-cols-2 gap-8">
        <div className="space-y-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="ml-auto space-y-3 text-right">
          <Skeleton className="ml-auto h-4 w-20" />
          <Skeleton className="ml-auto h-7 w-32" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </Card>
  );
}

async function AnsweredDonutCard() {
  const data = await getAnsweredCount();
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Preguntas contestadas vs sin contestar</CardTitle>
        <CardDescription>Búsqueda &ldquo;perl&rdquo; en StackOverflow</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <AnsweredDonut data={data} />
      </CardContent>
    </Card>
  );
}

async function TopScoreCard() {
  const data = await getTopScoreQuestion();
  return <QuestionCard eyebrow="Mayor puntuación" question={data} />;
}

async function LeastViewsCard() {
  const data = await getLeastViewsQuestion();
  return <QuestionCard eyebrow="Menor número de vistas" question={data} />;
}

async function TimelineCard() {
  const data = await getOldestNewestQuestions();
  return <OldestNewestLineChart data={data} />;
}

export function StackOverflowSection() {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Suspense fallback={<DonutSkeleton />}>
          <div className="lg:col-span-2">
            <AnsweredDonutCard />
          </div>
        </Suspense>
        <Suspense fallback={<QuestionCardSkeleton />}>
          <div className="lg:col-span-2">
            <TopScoreCard />
          </div>
        </Suspense>
        <Suspense fallback={<QuestionCardSkeleton />}>
          <div className="lg:col-span-2">
            <LeastViewsCard />
          </div>
        </Suspense>
        <Suspense fallback={<TimelineSkeleton />}>
          <div className="lg:col-span-6">
            <TimelineCard />
          </div>
        </Suspense>
      </div>
    </section>
  );
}
