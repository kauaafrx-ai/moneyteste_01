import { cn } from "@/lib/utils";

interface SegmentedControlProps<T extends string> {
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/** Animated segmented control used for filters and view modes. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  return (
    <div
      role="tablist"
      className={cn(
        "relative flex w-full rounded-[var(--radius-xl)] border border-border bg-muted p-1",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-y-1 rounded-[var(--radius-lg)] bg-card shadow-sm transition-transform duration-300 [transition-timing-function:var(--ease-premium)]"
        style={{
          width: `calc((100% - 0.5rem) / ${options.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
          left: "0.25rem",
        }}
      />
      {options.map((option) => (
        <button
          key={option.value}
          role="tab"
          aria-selected={option.value === value}
          onClick={() => onChange(option.value)}
          className={cn(
            "relative z-10 flex-1 rounded-[var(--radius-lg)] px-3 py-1.5 text-xs font-semibold transition-colors duration-300",
            option.value === value ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
