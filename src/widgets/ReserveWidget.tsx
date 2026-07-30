import { PiggyBank, ShieldCheck } from "lucide-react";
import { useMoneyFormatter } from "@/hooks/useMoneyFormatter";
import { toMoney } from "@/utils/format";
import { ProgressRing } from "@/components/common/Progress";
import { OVERVIEW } from "@/data/demo";

/** Emergency reserve coverage, rendered as an animated ring. */
export function ReserveWidget() {
  const money = useMoneyFormatter();
  const pct = Math.round((OVERVIEW.reserve / OVERVIEW.reserveTarget) * 100);

  return (
    <div className="surface-card animate-[rise_0.5s_var(--ease-premium)_both] flex items-center gap-4 p-4">
      <ProgressRing value={pct} size={96}>
        <div>
          <p className="numeric text-lg font-semibold text-foreground">{pct}%</p>
          <p className="text-[0.6rem] uppercase tracking-[0.12em] text-muted-foreground">Coberto</p>
        </div>
      </ProgressRing>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <PiggyBank className="size-4 text-primary" aria-hidden strokeWidth={2} />
          <p className="text-sm font-semibold text-foreground">Reserva de emergência</p>
        </div>
        <p className="numeric mt-2 text-xl font-semibold text-foreground">
          {money(toMoney(OVERVIEW.reserve))}
        </p>
        <p className="mt-1 text-[0.72rem] text-muted-foreground">
          Meta {money(toMoney(OVERVIEW.reserveTarget), { compact: true })} · 6 meses de custo
        </p>
        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-success/12 px-2 py-0.5 text-[0.7rem] font-semibold text-success">
          <ShieldCheck className="size-3" aria-hidden strokeWidth={2.4} />
          3,9 meses protegidos
        </p>
      </div>
    </div>
  );
}
