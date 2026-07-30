import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BottomNavigation } from "./BottomNavigation";

interface AppShellProps {
  children: ReactNode;
  className?: string;
}

/**
 * App container: mobile-first canvas, safe areas, ambient brand light and
 * the persistent bottom navigation.
 */
export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-emerald opacity-[0.07] blur-3xl"
      />
      <main
        className={cn(
          "relative mx-auto w-full max-w-[var(--app-max-width)] px-4 pt-[max(env(safe-area-inset-top),1rem)]",
          "pb-[calc(var(--bottom-nav-height)+2.5rem)]",
          className,
        )}
      >
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
