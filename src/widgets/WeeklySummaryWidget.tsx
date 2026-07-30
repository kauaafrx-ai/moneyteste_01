import { Sparkles, TrendingDown } from "lucide-react";
import { useMoneyFormatter } from "@/hooks/useMoneyFormatter";
import { toMoney } from "@/utils/format";
import { ProgressBar } from "@/components/common/Progress";
import { WEEK_SUMMARY } from "@/data/demo";

/** Weekly spending pulse with an inline insight. */
export function WeeklySummaryWidget() {
  const money = useMoneyFormatter();
  const pct = Math.round((WEEK_SUMMARY.spent / WEEK_SUMMARY.budget) * 100);

  return (
    <div className="surface-card animate-[rise_0.5s_var(--ease-premium)_both] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-eyebrow text-muted-foreground">Resumo semanal</p>
          <p className="numeric mt-1 text-xl font-semibold text-foreground">
            {money(toMoney(WEEK_SUMMARY.spent))}
          </p>
          <p className="mt-0.5 text-[0.72rem] text-muted-foreground">
            de {money(toMoney(WEEK_SUMMARY.budget), { compact: true })} planejados
          </p>
        </div>
        <span className="grid size-10 place-items-center rounded-[var(--radius-lg)] bg-success/12 text-success">
          <TrendingDown className="size-[1.1rem]" aria-hidden strokeWidth={2} />
        </span>
      </div>

      <ProgressBar className="mt-3" value={pct} tone={pct > 90 ? "warning" : "primary"} />

      <p className="mt-3 flex items-start gap-2 rounded-[var(--radius-lg)] bg-accent/60 p-3 text-[0.75rem] leading-relaxed text-accent-foreground">
        <Sparkles className="mt-0.5 size-3.5 shrink-0" aria-hidden strokeWidth={2} />
        {WEEK_SUMMARY.best}
      </p>
    </div>
  );
}
