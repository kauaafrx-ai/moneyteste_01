import type { ReactNode } from "react";
import { Drawer as Vaul } from "vaul";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/** Modern bottom sheet: spring drag, blurred scrim, grabber handle. */
export function BottomSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: BottomSheetProps) {
  return (
    <Vaul.Root open={open} onOpenChange={onOpenChange}>
      <Vaul.Portal>
        <Vaul.Overlay className="fixed inset-0 z-50 bg-foreground/25 backdrop-blur-[6px] data-[state=closed]:animate-[fade_0.2s_ease-in_reverse] data-[state=open]:animate-[fade_0.3s_var(--ease-premium)]" />
        <Vaul.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[88vh] w-full max-w-[var(--app-max-width)] flex-col rounded-t-[var(--radius-4xl)] border border-border bg-card pb-[max(env(safe-area-inset-bottom),1rem)] shadow-floating outline-none",
            className,
          )}
        >
          <div className="mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-border-strong" aria-hidden />
          {(title || description) && (
            <div className="px-5 pb-3 pt-4">
              {title && <Vaul.Title className="text-lg font-semibold text-foreground">{title}</Vaul.Title>}
              {description && (
                <Vaul.Description className="mt-1 text-sm text-muted-foreground">
                  {description}
                </Vaul.Description>
              )}
            </div>
          )}
          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">{children}</div>
          {footer && <div className="border-t border-border px-5 pt-3">{footer}</div>}
        </Vaul.Content>
      </Vaul.Portal>
    </Vaul.Root>
  );
}
