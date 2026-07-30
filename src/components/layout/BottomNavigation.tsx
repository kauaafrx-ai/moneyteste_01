import { Link, useLocation } from "@tanstack/react-router";
import { PRIMARY_NAV, isNavItemActive } from "@/constants/navigation";
import { cn } from "@/lib/utils";

/**
 * Apple-Wallet inspired navigation: sliding pill indicator, spring icon
 * scale and gradual color transition on the active destination.
 */
export function BottomNavigation() {
  const pathname = useLocation({ select: (l) => l.pathname });
  const activeIndex = Math.max(
    0,
    PRIMARY_NAV.findIndex((item) => isNavItemActive(item, pathname)),
  );
  const count = PRIMARY_NAV.length;

  return (
    <nav
      aria-label="Navegação principal"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-[max(env(safe-area-inset-bottom),0.75rem)]"
    >
      <div className="surface-glass shadow-floating pointer-events-auto relative mx-3 flex w-full max-w-[var(--app-max-width)] items-center rounded-[var(--radius-3xl)] border border-border/70 p-1.5">
        {/* Sliding indicator */}
        <span
          aria-hidden
          className="absolute bottom-1.5 top-1.5 rounded-[var(--radius-2xl)] bg-accent transition-transform duration-[420ms] [transition-timing-function:var(--ease-spring)]"
          style={{
            width: `calc((100% - 0.75rem) / ${count})`,
            left: "0.375rem",
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
        {PRIMARY_NAV.map((item) => {
          const active = isNavItemActive(item, pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.path}
              aria-current={active ? "page" : undefined}
              className="press group relative flex flex-1 flex-col items-center gap-1 rounded-[var(--radius-2xl)] px-1 py-2"
            >
              <Icon
                aria-hidden
                className={cn(
                  "relative size-[1.35rem] transition-all duration-[420ms] [transition-timing-function:var(--ease-spring)]",
                  active
                    ? "-translate-y-0.5 scale-[1.16] text-primary"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
                strokeWidth={active ? 2.3 : 1.8}
              />
              <span
                className={cn(
                  "relative text-[0.65rem] font-semibold tracking-tight transition-colors duration-300",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.label}
              </span>
              <span
                className={cn(
                  "relative h-[3px] rounded-full bg-primary transition-all duration-[420ms] [transition-timing-function:var(--ease-spring)]",
                  active ? "w-5 opacity-100" : "w-0 opacity-0",
                )}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
