import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { RippleLayer, useRipple } from "./Ripple";

const buttonStyles = cva(
  "ripple-host press inline-flex items-center justify-center gap-2 font-semibold outline-none select-none whitespace-nowrap disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        primary: "bg-gradient-emerald text-primary-foreground shadow-brand-glow hover:brightness-[1.04]",
        petrol: "bg-gradient-brand text-primary-foreground shadow-elevated hover:brightness-[1.05]",
        soft: "bg-accent text-accent-foreground hover:bg-accent/80",
        outline: "border border-border bg-card text-foreground shadow-xs hover:border-primary/40 hover:bg-accent/50",
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
        danger: "bg-destructive text-destructive-foreground shadow-md hover:brightness-105",
      },
      size: {
        sm: "h-9 rounded-[var(--radius-lg)] px-3 text-xs",
        md: "h-11 rounded-[var(--radius-xl)] px-4 text-sm",
        lg: "h-13 rounded-[var(--radius-2xl)] px-5 text-[0.95rem]",
        icon: "size-10 rounded-full",
      },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", block: false },
  },
);

export interface PremiumButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {
  loading?: boolean;
  icon?: ReactNode;
}

/** The single button primitive of the design system. */
export const PremiumButton = forwardRef<HTMLButtonElement, PremiumButtonProps>(function PremiumButton(
  { className, variant, size, block, loading, icon, children, onPointerDown, disabled, ...props },
  ref,
) {
  const { ripples, onPointerDown: rippleDown } = useRipple();

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      onPointerDown={(e) => {
        rippleDown(e);
        onPointerDown?.(e);
      }}
      className={cn(buttonStyles({ variant, size, block }), className)}
      {...props}
    >
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : icon}
      {children}
      <RippleLayer ripples={ripples} />
    </button>
  );
});
