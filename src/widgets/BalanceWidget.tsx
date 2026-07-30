import { Eye, EyeOff, Plus, Send, ArrowLeftRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { usePreferences } from "@/providers/PreferencesProvider";
import { useMoneyFormatter } from "@/hooks/useMoneyFormatter";
import { toMoney } from "@/utils/format";
import { AnimatedNumber } from "@/components/common/AnimatedNumber";
import { DeltaBadge } from "@/components/common/DeltaBadge";
import { BALANCE_SPARK, OVERVIEW } from "@/data/demo";
import { cn } from "@/lib/utils";

const QUICK_ACTIONS = [
  { id: "add", label: "Lançar", icon: Plus },
  { id: "transfer", label: "Transferir", icon: ArrowLeftRight },
  { id: "pay", label: "Pagar", icon: Send },
];

/** Hero widget: consolidated balance, trend sparkline and quick actions. */
export function BalanceWidget({ onAction }: { onAction?: (id: string) => void }) {
  const { hideBalances, toggleBalances } = usePreferences();
  const money = useMoneyFormatter();

  return (
    <section className="bg-gradient-brand shadow-elevated animate-[rise_0.5s_var(--ease-premium)_both] relative overflow-hidden rounded-[var(--radius-3xl)] p-5 text-primary-foreground">
      <div aria-hidden className="animate-float absolute -right-16 -top-24 size-60 rounded-full bg-primary-glow/35 blur-3xl" />
      <div aria-hidden className="absolute -bottom-24 -left-10 size-48 rounded-full bg-primary/25 blur-3xl" />

      <div className="relative flex items-center justify-between">
        <span className="text-eyebrow opacity-80">Saldo consolidado</span>
        <button
          onClick={toggleBalances}
          aria-label={hideBalances ? "Mostrar valores" : "Ocultar valores"}
          className="press grid size-8 place-items-center rounded-full bg-primary-foreground/15 hover:bg-primary-foreground/25"
        >
          {hideBalances ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
        </button>
      </div>

      <div className="relative mt-2.5 flex items-end gap-3">
        {hideBalances ? (
          <p className="numeric text-[2.35rem] font-semibold leading-none">••••••</p>
        ) : (
          <AnimatedNumber
            value={OVERVIEW.balance}
            format={(v) => money(toMoney(Math.round(v)))}
            className="text-[2.35rem] font-semibold leading-none"
          />
        )}
        <DeltaBadge ratio={OVERVIEW.deltaRatio} tone="onBrand" className="mb-1" />
      </div>
      <p className="relative mt-1.5 text-xs opacity-80">Comparado ao mês anterior</p>

      <div className="relative -mx-1 mt-3 h-14">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={BALANCE_SPARK} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
            <defs>
              <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity={0.45} />
                <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="currentColor"
              strokeWidth={2}
              fill="url(#sparkFill)"
              isAnimationActive
              animationDuration={900}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="relative mt-3 grid grid-cols-2 gap-3">
        {[
          { label: "Receitas", value: OVERVIEW.income },
          { label: "Despesas", value: OVERVIEW.expense },
        ].map((item) => (
          <div key={item.label} className="rounded-[var(--radius-xl)] bg-primary-foreground/10 p-3 backdrop-blur-sm">
            <p className="text-[0.65rem] uppercase tracking-[0.14em] opacity-80">{item.label}</p>
            <p className="numeric mt-1 text-base font-semibold">{money(toMoney(item.value))}</p>
          </div>
        ))}
      </div>

      <div className="relative mt-4 grid grid-cols-3 gap-2">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => onAction?.(action.id)}
            className={cn(
              "press flex flex-col items-center gap-1.5 rounded-[var(--radius-xl)] bg-primary-foreground/10 py-2.5 text-[0.7rem] font-semibold",
              "hover:bg-primary-foreground/20",
            )}
          >
            <action.icon className="size-4" aria-hidden strokeWidth={2} />
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}
