import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useMoneyFormatter } from "@/hooks/useMoneyFormatter";
import { toMoney } from "@/utils/format";
import { ChartTooltip } from "@/components/common/ChartTooltip";
import { DeltaBadge } from "@/components/common/DeltaBadge";
import { AnimatedNumber } from "@/components/common/AnimatedNumber";
import { usePreferences } from "@/providers/PreferencesProvider";
import { NET_WORTH_SERIES } from "@/data/demo";

/** Twelve-month net worth evolution. */
export function WealthTrendWidget({ height = 190 }: { height?: number }) {
  const money = useMoneyFormatter();
  const { hideBalances } = usePreferences();
  const first = NET_WORTH_SERIES[0].value;
  const last = NET_WORTH_SERIES[NET_WORTH_SERIES.length - 1].value;
  const ratio = (last - first) / first;

  return (
    <div className="surface-card animate-[rise_0.5s_var(--ease-premium)_both] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-eyebrow text-muted-foreground">Patrimônio total</p>
          {hideBalances ? (
            <p className="numeric mt-1 text-2xl font-semibold text-foreground">••••••</p>
          ) : (
            <AnimatedNumber
              value={last}
              format={(v) => money(toMoney(Math.round(v)))}
              className="mt-1 block text-2xl font-semibold text-foreground"
            />
          )}
        </div>
        <DeltaBadge ratio={ratio} className="mt-1" />
      </div>

      <div className="mt-4 -ml-3 -mr-2" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={NET_WORTH_SERIES} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
            <defs>
              <linearGradient id="wealthFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 6" stroke="var(--border)" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              interval={1}
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              dy={6}
            />
            <Tooltip
              cursor={{ stroke: "var(--border-strong)", strokeWidth: 1 }}
              content={<ChartTooltip formatter={(v) => money(toMoney(v), { compact: true })} />}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--chart-1)"
              strokeWidth={2.6}
              fill="url(#wealthFill)"
              animationDuration={1100}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
