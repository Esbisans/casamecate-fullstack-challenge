import { ArrowUpRight, Check, Circle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MorphButton } from "@/components/ui/morph-button";
import { QuestionStats } from "@/components/sections/stackoverflow/question-stats";
import type { QuestionSummary } from "@/lib/api";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  question: QuestionSummary;
  className?: string;
};

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  month: "long",
  year: "numeric",
});

function formatDate(iso: string) {
  return dateFormatter.format(new Date(iso));
}

export function QuestionCard({ eyebrow, question, className }: Props) {
  return (
    <Card
      className={cn("flex h-full flex-col gap-4 p-6", className)}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-foreground-faint">
          {eyebrow}
        </span>
        <MorphButton
          href={question.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir "${question.title}" en Stack Overflow`}
          label="Ver"
        >
          <ArrowUpRight className="size-3" strokeWidth={2} />
        </MorphButton>
      </div>

      <a
        href={question.link}
        target="_blank"
        rel="noopener noreferrer"
        className="line-clamp-3 text-base font-semibold leading-snug tracking-tight text-foreground transition-colors hover:text-foreground-muted"
      >
        {question.title}
      </a>

      <AnsweredBadge isAnswered={question.is_answered} />

      <div className="mt-auto flex flex-col gap-3">
        <QuestionStats score={question.score} views={question.view_count} />

        <div className="flex items-center justify-between text-xs text-foreground-muted">
          <span className="truncate">{question.owner_name}</span>
          <span>{formatDate(question.creation_date)}</span>
        </div>
      </div>
    </Card>
  );
}

function AnsweredBadge({ isAnswered }: { isAnswered: boolean }) {
  if (isAnswered) {
    return (
      <span className="inline-flex w-fit items-center gap-1 rounded-full bg-azure-100 px-2.5 py-1 text-xs font-medium text-azure-900">
        <Check className="size-3.5" strokeWidth={2.5} />
        Contestada
      </span>
    );
  }

  return (
    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-stone-3 px-2.5 py-1 text-xs font-medium text-foreground-muted">
      <Circle className="size-3.5" strokeWidth={2} />
      Sin contestar
    </span>
  );
}
