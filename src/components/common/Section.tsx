import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/** Vertical rhythm primitive used by every screen. */
export function Section({ title, description, action, children, className, style }: SectionProps) {
  return (
    <section className={cn("animate-[rise_0.5s_var(--ease-premium)_both]", className)} style={style}>
      {(title || action) && (
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            {title && <h2 className="text-base font-semibold text-foreground">{title}</h2>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
