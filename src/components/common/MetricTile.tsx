import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricTileProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  trend?: { value: string; direction: "up" | "down" | "flat" };
  tone?: "neutral" | "success" | "destructive" | "primary";
  className?: string;
  style?: React.CSSProperties;
}

const valueTone = {
  neutral: "text-foreground",
  success: "text-success",
  destructive: "text-destructive",
  primary: "text-primary",
} as const;

/** Financial values must read instantly — display font + tabular numerals. */
export function MetricTile({ label, value, icon: Icon, trend, tone = "neutral", className, style }: MetricTileProps) {
  return (
    <div
      style={style}
      className={cn("surface-card animate-[rise_0.5s_var(--ease-premium)_both] p-4", className)}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        {Icon && <Icon className="size-3.5" aria-hidden strokeWidth={2} />}
        <span className="text-[0.7rem] font-medium uppercase tracking-[0.12em]">{label}</span>
      </div>
      <p className={cn("numeric mt-2 text-xl font-semibold", valueTone[tone])}>{value}</p>
      {trend && (
        <p
          className={cn(
            "mt-1 text-xs font-medium",
            trend.direction === "up" && "text-success",
            trend.direction === "down" && "text-destructive",
            trend.direction === "flat" && "text-muted-foreground",
          )}
        >
          {trend.value}
        </p>
      )}
    </div>
  );
}
