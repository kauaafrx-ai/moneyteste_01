import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeltaBadgeProps {
  /** Signed ratio, e.g. 0.082 for +8,2%. */
  ratio: number;
  /** Invert semantics for expense-style metrics (up = bad). */
  invert?: boolean;
  className?: string;
  tone?: "default" | "onBrand";
}

export function DeltaBadge({ ratio, invert = false, className, tone = "default" }: DeltaBadgeProps) {
  const flat = Math.abs(ratio) < 0.001;
  const positive = invert ? ratio < 0 : ratio > 0;
  const Icon = flat ? Minus : ratio > 0 ? ArrowUpRight : ArrowDownRight;
  const text = `${ratio > 0 ? "+" : ratio < 0 ? "−" : ""}${(Math.abs(ratio) * 100).toFixed(1).replace(".", ",")}%`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.7rem] font-semibold",
        tone === "onBrand"
          ? "bg-primary-foreground/15 text-primary-foreground"
          : flat
            ? "bg-muted text-muted-foreground"
            : positive
              ? "bg-success/12 text-success"
              : "bg-destructive/12 text-destructive",
        className,
      )}
    >
      <Icon className="size-3" aria-hidden strokeWidth={2.4} />
      {text}
    </span>
  );
}
