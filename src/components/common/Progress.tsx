import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  tone?: "primary" | "petrol" | "warning" | "success";
  label?: string;
  hint?: string;
}

const toneMap = {
  primary: "bg-gradient-emerald",
  petrol: "bg-gradient-brand",
  warning: "bg-warning",
  success: "bg-success",
} as const;

/** Animated progress track — fills in on mount and on every value change. */
export function ProgressBar({ value, max = 100, className, tone = "primary", label, hint }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const id = window.setTimeout(() => setWidth(pct), 80);
    return () => window.clearTimeout(id);
  }, [pct]);

  return (
    <div className={cn("w-full", className)}>
      {(label || hint) && (
        <div className="mb-1.5 flex items-baseline justify-between gap-2">
          {label && <span className="text-xs font-medium text-foreground">{label}</span>}
          {hint && <span className="numeric text-xs text-muted-foreground">{hint}</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-[900ms]", toneMap[tone])}
          style={{ width: `${width}%`, transitionTimingFunction: "var(--ease-premium)" }}
        />
      </div>
    </div>
  );
}

interface ProgressRingProps {
  value: number;
  size?: number;
  stroke?: number;
  className?: string;
  children?: React.ReactNode;
}

/** Circular progress used by reserve coverage and goal cards. */
export function ProgressRing({ value, size = 92, stroke = 8, className, children }: ProgressRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const pct = Math.max(0, Math.min(1, value / 100));
    const id = window.setTimeout(() => setOffset(circumference * (1 - pct)), 80);
    return () => window.clearTimeout(id);
  }, [value, circumference]);

  return (
    <div className={cn("relative grid place-items-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke="var(--primary)"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s var(--ease-premium)" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}
