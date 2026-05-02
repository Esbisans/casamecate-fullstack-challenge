import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-12">
      <Skeleton className="h-8 w-72" />
      <Skeleton className="mt-3 h-4 w-96" />
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/2] lg:col-span-2" />
        ))}
      </div>
    </main>
  );
}
