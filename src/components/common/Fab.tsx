import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { RippleLayer, useRipple } from "./Ripple";

interface FabProps {
  onClick?: () => void;
  label: string;
  className?: string;
}

/** Floating action button anchored just above the bottom navigation. */
export function Fab({ onClick, label, className }: FabProps) {
  const { ripples, onPointerDown } = useRipple();

  return (
    <button
      aria-label={label}
      onClick={onClick}
      onPointerDown={onPointerDown}
      className={cn(
        "ripple-host press bg-gradient-emerald shadow-brand-glow animate-ring fixed bottom-[calc(var(--bottom-nav-height)+1.5rem)] right-[max(1rem,calc(50%-var(--app-max-width)/2+1rem))] z-40 grid size-14 place-items-center rounded-full text-primary-foreground",
        className,
      )}
    >
      <Plus className="size-6" aria-hidden strokeWidth={2.2} />
      <RippleLayer ripples={ripples} />
    </button>
  );
}
