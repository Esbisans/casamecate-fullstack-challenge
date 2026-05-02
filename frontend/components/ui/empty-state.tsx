import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
};

export function EmptyState({ title, description, icon, className }: Props) {
  return (
    <Card
      className={cn(
        "flex h-full flex-col items-center justify-center gap-2 p-8 text-center",
        className
      )}
    >
      {icon ? (
        <div className="text-foreground-faint" aria-hidden>
          {icon}
        </div>
      ) : null}
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? (
        <p className="max-w-xs text-xs text-foreground-muted">{description}</p>
      ) : null}
    </Card>
  );
}
