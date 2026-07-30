import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string; dataKey?: string | number }>;
  label?: string | number;
  formatter?: (value: number) => string;
  className?: string;
  extra?: ReactNode;
}

const LABELS: Record<string, string> = {
  income: "Entradas",
  expense: "Saídas",
  value: "Valor",
};

/** One tooltip for every chart in the product. */
export function ChartTooltip({ active, payload, label, formatter, className }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "animate-[pop_0.18s_var(--ease-spring)_both] min-w-32 rounded-[var(--radius-lg)] border border-border bg-popover/95 px-3 py-2 shadow-elevated backdrop-blur-md",
        className,
      )}
    >
      {label !== undefined && (
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      )}
      <ul className="mt-1.5 space-y-1">
        {payload.map((entry, i) => (
          <li key={i} className="flex items-center justify-between gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="size-2 rounded-full" style={{ background: entry.color }} aria-hidden />
              {LABELS[String(entry.dataKey ?? entry.name)] ?? entry.name}
            </span>
            <span className="numeric font-semibold text-foreground">
              {formatter ? formatter(Number(entry.value ?? 0)) : entry.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
