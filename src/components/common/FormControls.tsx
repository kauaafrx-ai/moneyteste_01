import { useId } from "react";
import { cn } from "@/lib/utils";

/** Labelled field wrapper shared by every editor sheet. */
export function Field({
  label,
  children,
  hint,
  className,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-semibold text-foreground">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[0.7rem] text-muted-foreground">{hint}</span>}
    </label>
  );
}

const baseInput =
  "h-11 w-full rounded-[var(--radius-xl)] border border-border bg-card px-3 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(baseInput, props.className)} />;
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(baseInput, "appearance-none", props.className)} />;
}

/**
 * Currency field: the user types in reais, the value is stored in cents.
 */
export function MoneyInput({
  cents,
  onChangeCents,
  placeholder = "0,00",
}: {
  cents: number;
  onChangeCents: (cents: number) => void;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
        R$
      </span>
      <input
        id={id}
        inputMode="decimal"
        placeholder={placeholder}
        value={cents === 0 ? "" : (cents / 100).toFixed(2).replace(".", ",")}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "");
          onChangeCents(digits ? Number(digits) : 0);
        }}
        className={cn(baseInput, "numeric pl-9 text-right font-semibold")}
      />
    </div>
  );
}
