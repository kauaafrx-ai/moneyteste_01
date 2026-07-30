import { cn } from "@/lib/utils";

/** Loading placeholder with the brand sheen. Used by every widget. */
export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("skeleton-sheen rounded-[var(--radius-md)] bg-muted", className)}
    />
  );
}

export function SkeletonLines({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBlock key={i} className={cn("h-3", i === lines - 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}
