"use client";

import { Card } from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <Card className="max-w-md p-8">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-foreground-faint">
          Error
        </p>
        <h2 className="mt-2 text-base font-semibold tracking-tight text-foreground">
          Algo salió mal
        </h2>
        <p className="mt-2 text-sm text-foreground-muted">
          {error.message || "No pudimos cargar los datos. Inténtalo de nuevo."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Reintentar
        </button>
      </Card>
    </main>
  );
}
