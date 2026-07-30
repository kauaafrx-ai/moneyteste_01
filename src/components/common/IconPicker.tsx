import { ICON_KEYS, ICONS, resolveIcon } from "@/data/icon-registry";
import { cn } from "@/lib/utils";

/** Compact grid to choose the icon of a record. */
export function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="grid max-h-40 grid-cols-8 gap-1.5 overflow-y-auto rounded-[var(--radius-xl)] border border-border bg-surface p-2">
      {ICON_KEYS.map((key) => {
        const Icon = ICONS[key];
        const active = key === value;
        return (
          <button
            key={key}
            type="button"
            aria-label={key}
            onClick={() => onChange(key)}
            className={cn(
              "press grid aspect-square place-items-center rounded-[var(--radius-md)] border transition-colors",
              active
                ? "border-primary bg-accent text-accent-foreground"
                : "border-transparent bg-card text-muted-foreground hover:bg-muted",
            )}
          >
            <Icon className="size-4" aria-hidden strokeWidth={1.9} />
          </button>
        );
      })}
    </div>
  );
}

/** Round icon tile used across lists. */
export function IconTile({
  icon,
  className,
  tone = "muted",
}: {
  icon: string;
  className?: string;
  tone?: "muted" | "success" | "accent";
}) {
  const Icon = resolveIcon(icon);
  return (
    <span
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full",
        tone === "success" && "bg-success/12 text-success",
        tone === "accent" && "bg-accent text-accent-foreground",
        tone === "muted" && "bg-muted text-foreground",
        className,
      )}
    >
      <Icon className="size-4" aria-hidden strokeWidth={1.9} />
    </span>
  );
}
