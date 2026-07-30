import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/** Standard search input of the design system — focus glow + clear affordance. */
export function SearchField({ value, onChange, placeholder, className }: SearchFieldProps) {
  return (
    <div
      className={cn(
        "group relative flex h-12 items-center rounded-[var(--radius-xl)] border border-border bg-card px-3 shadow-xs transition-all duration-300 [transition-timing-function:var(--ease-premium)] focus-within:border-primary/45 focus-within:shadow-md",
        className,
      )}
    >
      <Search
        className="size-4 shrink-0 text-muted-foreground transition-colors group-focus-within:text-primary"
        aria-hidden
        strokeWidth={2}
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
      {value && (
        <button
          aria-label="Limpar busca"
          onClick={() => onChange("")}
          className="press grid size-6 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
        >
          <X className="size-3.5" aria-hidden />
        </button>
      )}
    </div>
  );
}
