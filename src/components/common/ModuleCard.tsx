import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  meta?: string;
  tone?: "default" | "primary" | "petrol" | "warning";
  footer?: ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const toneMap = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-accent text-accent-foreground",
  petrol: "bg-secondary text-secondary-foreground",
  warning: "bg-warning/15 text-warning-foreground",
} as const;

/**
 * Structural card used to scaffold a feature area before its logic exists.
 * Keeps the visual language consistent while modules are implemented.
 */
export function ModuleCard({
  icon: Icon,
  title,
  description,
  meta,
  tone = "default",
  footer,
  onClick,
  className,
  style,
}: ModuleCardProps) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      style={style}
      className={cn(
        "surface-card press animate-[rise_0.5s_var(--ease-premium)_both] w-full p-4 text-left",
        onClick && "hover:shadow-elevated",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)]", toneMap[tone])}>
          <Icon className="size-[1.15rem]" aria-hidden strokeWidth={1.9} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-sm font-semibold text-foreground">{title}</h3>
            {meta && <span className="numeric shrink-0 text-xs text-muted-foreground">{meta}</span>}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
          {footer && <div className="mt-3">{footer}</div>}
        </div>
      </div>
    </Comp>
  );
}
