import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: ReactNode;
  backTo?: string;
  className?: string;
}

export function ScreenHeader({
  title,
  subtitle,
  eyebrow,
  actions,
  backTo,
  className,
}: ScreenHeaderProps) {
  return (
    <header className={cn("flex items-start justify-between gap-3 pt-2", className)}>
      <div className="flex min-w-0 items-start gap-2">
        {backTo && (
          <Link
            to={backTo}
            aria-label="Voltar"
            className="press mt-1 flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-xs hover:bg-accent"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </Link>
        )}
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-primary">
              {eyebrow}
            </p>
          )}
          <h1 className="truncate text-2xl font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
