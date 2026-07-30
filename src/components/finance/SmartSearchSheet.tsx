import { useMemo, useState } from "react";
import { Search, Sparkles, WandSparkles } from "lucide-react";
import { BottomSheet } from "@/components/common/BottomSheet";
import { Input } from "@/components/ui/input";
import { resolveIcon } from "@/data/icon-registry";
import { useLedger } from "@/providers/LedgerProvider";
import { smartSearch } from "@/lib/finance-intelligence";
import { useMoneyFormatter } from "@/hooks/useMoneyFormatter";
import { toMoney } from "@/utils/format";
import { shortDate } from "@/utils/dates";
import { stagger } from "@/animations/motion";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "Quanto gastei com gasolina este ano?",
  "Mostrar todos os pagamentos acima de R$ 500",
  "Quanto recebi da empresa X?",
  "Quanto gastei com mercado?",
];

/** Busca inteligente em linguagem natural sobre o histórico financeiro. */
export function SmartSearchSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const ledger = useLedger();
  const money = useMoneyFormatter();
  const [query, setQuery] = useState("");
  const result = useMemo(() => smartSearch(query, ledger), [query, ledger]);

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Busca inteligente"
      description="Pergunte com suas palavras — a IA interpreta e responde com os dados reais."
    >
      <div className="space-y-4 pb-3">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Quanto gastei com gasolina este ano?"
            className="h-12 rounded-[var(--radius-xl)] border-border bg-card pl-9 shadow-xs"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={s}
              style={stagger(i, 40)}
              onClick={() => setQuery(s)}
              className="press animate-[fade_0.35s_var(--ease-premium)_both] rounded-full border border-border bg-card px-3 py-1.5 text-[0.7rem] font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              {s}
            </button>
          ))}
        </div>

        {query.trim() && (
          <div className="animate-[rise_0.4s_var(--ease-premium)_both] rounded-[var(--radius-2xl)] border border-primary/30 bg-accent/60 p-4">
            <p className="flex items-start gap-2 text-sm font-medium leading-relaxed text-accent-foreground">
              <WandSparkles className="mt-0.5 size-4 shrink-0" aria-hidden strokeWidth={2.1} />
              {result.answer}
            </p>
          </div>
        )}

        <div className="space-y-2">
          {result.matches.slice(0, 24).map((item, i) => {
            const Icon = resolveIcon(item.icon);
            return (
              <div
                key={item.id}
                style={stagger(i, 30)}
                className="surface-card animate-[fade_0.3s_var(--ease-premium)_both] flex items-center gap-3 p-3"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-[var(--radius-lg)] bg-muted text-muted-foreground">
                  <Icon className="size-4" aria-hidden strokeWidth={2} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">{item.title}</span>
                  <span className="block text-[0.68rem] text-muted-foreground">
                    {shortDate(item.date)} · {item.category}
                  </span>
                </span>
                <span
                  className={cn(
                    "numeric text-sm font-semibold",
                    item.amount > 0 ? "text-success" : "text-foreground",
                  )}
                >
                  {money(toMoney(item.amount), { signed: true })}
                </span>
              </div>
            );
          })}
          {!query.trim() && (
            <p className="flex items-center justify-center gap-2 pt-2 text-center text-xs text-muted-foreground">
              <Sparkles className="size-3.5" aria-hidden /> Comece digitando ou escolha uma sugestão.
            </p>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
