import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border-subtle bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-baseline gap-2 text-lg font-semibold tracking-tight text-foreground"
        >
          Casamecate
          <span className="text-base text-foreground-muted font-normal">
            Reto Técnico FullStack
          </span>
        </Link>
      </div>
    </header>
  );
}
