import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PreferencesProvider } from "./PreferencesProvider";
import { LedgerProvider } from "./LedgerProvider";
import { FloatingAiButton } from "@/components/ai/FloatingAiButton";

/**
 * Single composition point for cross-cutting providers.
 * QueryClientProvider lives in __root.tsx (router-owned client).
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <PreferencesProvider>
      <LedgerProvider>
        <TooltipProvider delayDuration={200}>
          {children}
          <FloatingAiButton />
          <Toaster position="top-center" richColors closeButton />
        </TooltipProvider>
      </LedgerProvider>
    </PreferencesProvider>
  );
}
