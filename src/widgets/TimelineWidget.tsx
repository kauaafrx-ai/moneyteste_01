import { useMemo } from "react";
import { Bot, Clock3 } from "lucide-react";
import { useLedger, type ActivityRecord } from "@/providers/LedgerProvider";
import { resolveIcon } from "@/data/icon-registry";
import { commentTransaction, daysUntil } from "@/lib/finance-intelligence";
import { useMoneyFormatter } from "@/hooks/useMoneyFormatter";
import { toMoney } from "@/utils/format";
import { stagger } from "@/animations/motion";
import { cn } from "@/lib/utils";

function groupLabel(date: string) {
  const d = daysUntil(date);
  if (d === 0) return "Hoje";
  if (d === -1) return "Ontem";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long" }).format(
    new Date(`${date}T00:00:00`),
  );
}

function timeOf(item: ActivityRecord) {
  // Horário estável derivado do id enquanto não há timestamp real.
  const seed = [...item.id].reduce((s, c) => s + c.charCodeAt(0), 0);
  const h = 7 + (seed % 14);
  const m = (seed * 7) % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Linha do tempo financeira com comentários da IA em cada movimentação. */
export function TimelineWidget({ limit = 12 }: { limit?: number }) {
  const money = useMoneyFormatter();
  const { activity, categories } = useLedger();

  const groups = useMemo(() => {
    const sorted = [...activity].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
    const map = new Map<string, ActivityRecord[]>();
    for (const item of sorted) {
      map.set(item.date, [...(map.get(item.date) ?? []), item]);
    }
    return [...map.entries()];
  }, [activity, limit]);

  const colorOf = (label: string) =>
    categories.find((c) => c.label.toLowerCase() === label.toLowerCase())?.colorVar ?? "var(--chart-2)";

  return (
    <div className="space-y-5">
      {groups.map(([date, items], gi) => (
        <div key={date} style={stagger(gi, 60)} className="animate-[rise_0.5s_var(--ease-premium)_both]">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {groupLabel(date)}
            </span>
            <span className="h-px flex-1 bg-border" aria-hidden />
          </div>

          <ol className="relative space-y-3 pl-5">
            <span className="absolute bottom-2 left-[0.3rem] top-2 w-px bg-border" aria-hidden />
            {items.map((item, i) => {
              const Icon = resolveIcon(item.icon);
              const positive = item.amount > 0;
              return (
                <li
                  key={item.id}
                  style={stagger(i, 55)}
                  className="animate-[fade_0.4s_var(--ease-premium)_both] relative"
                >
                  <span
                    aria-hidden
                    className="absolute -left-5 top-4 size-2.5 rounded-full ring-4 ring-background"
                    style={{ background: colorOf(item.category) }}
                  />
                  <div className="surface-card card-interactive p-3.5">
                    <div className="flex items-center gap-3">
                      <span
                        className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-lg)] text-primary-foreground"
                        style={{ background: colorOf(item.category) }}
                      >
                        <Icon className="size-4" aria-hidden strokeWidth={2.1} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[0.7rem] text-muted-foreground">
                          <Clock3 className="size-3" aria-hidden />
                          {timeOf(item)} · {item.category}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "numeric shrink-0 text-sm font-semibold",
                          positive ? "text-success" : "text-foreground",
                        )}
                      >
                        {money(toMoney(item.amount), { signed: true })}
                      </span>
                    </div>

                    <p className="mt-2.5 flex items-start gap-2 rounded-[var(--radius-lg)] bg-accent/60 px-2.5 py-2 text-[0.72rem] leading-relaxed text-accent-foreground">
                      <Bot className="mt-0.5 size-3.5 shrink-0" aria-hidden strokeWidth={2.1} />
                      {commentTransaction(item, activity)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </div>
  );
}
