import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumCalendarProps {
  /** Day-of-month → marker tone, used to flag bills and receipts. */
  markers?: Record<number, "income" | "expense" | "both">;
  onSelect?: (date: Date) => void;
  className?: string;
}

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

/** Calendar tuned for financial scanning: dense grid, marker dots, spring feedback. */
export function PremiumCalendar({ markers = {}, onSelect, className }: PremiumCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<number | null>(today.getDate());

  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const leading = new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay();
  const isCurrentMonth =
    cursor.getFullYear() === today.getFullYear() && cursor.getMonth() === today.getMonth();

  const shift = (delta: number) =>
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1));

  return (
    <div className={cn("surface-card animate-[rise_0.5s_var(--ease-premium)_both] p-4", className)}>
      <div className="flex items-center justify-between">
        <button
          aria-label="Mês anterior"
          onClick={() => shift(-1)}
          className="press grid size-9 place-items-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>
        <p className="text-sm font-semibold text-foreground">
          {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
        </p>
        <button
          aria-label="Próximo mês"
          onClick={() => shift(1)}
          className="press grid size-9 place-items-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((d, i) => (
          <span key={i} className="text-[0.65rem] font-semibold uppercase text-muted-foreground">
            {d}
          </span>
        ))}
        {Array.from({ length: leading }).map((_, i) => (
          <span key={`pad-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const marker = markers[day];
          const isToday = isCurrentMonth && day === today.getDate();
          const isSelected = selected === day;
          return (
            <button
              key={day}
              onClick={() => {
                setSelected(day);
                onSelect?.(new Date(cursor.getFullYear(), cursor.getMonth(), day));
              }}
              className={cn(
                "press relative mx-auto grid size-9 place-items-center rounded-[var(--radius-md)] text-[0.8rem] font-medium transition-all duration-300 [transition-timing-function:var(--ease-spring)]",
                isSelected
                  ? "bg-gradient-emerald scale-105 text-primary-foreground shadow-brand-glow"
                  : isToday
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-muted",
              )}
            >
              {day}
              {marker && (
                <span className="absolute bottom-1 flex gap-0.5">
                  {(marker === "income" || marker === "both") && (
                    <span className={cn("size-1 rounded-full", isSelected ? "bg-primary-foreground" : "bg-success")} />
                  )}
                  {(marker === "expense" || marker === "both") && (
                    <span className={cn("size-1 rounded-full", isSelected ? "bg-primary-foreground/70" : "bg-destructive")} />
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 text-[0.7rem] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-success" /> Recebimentos
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-destructive" /> Vencimentos
        </span>
      </div>
    </div>
  );
}
