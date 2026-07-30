import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "surface-card animate-[pop_0.28s_var(--ease-spring)_both] flex flex-col items-center gap-3 border-dashed px-6 py-10 text-center",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Icon className="size-5" aria-hidden strokeWidth={1.8} />
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
