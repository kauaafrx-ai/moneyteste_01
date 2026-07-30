import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useMoneyFormatter } from "@/hooks/useMoneyFormatter";
import { toMoney } from "@/utils/format";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { ChartTooltip } from "@/components/common/ChartTooltip";
import { MONTH_FLOW, WEEK_FLOW } from "@/data/demo";

type Range = "week" | "month";

/** Income vs expense flow, animated area chart with an elegant tooltip. */
export function FlowChartWidget({ height = 176 }: { height?: number }) {
  const [range, setRange] = useState<Range>("week");
  const money = useMoneyFormatter();
  const data = range === "week" ? WEEK_FLOW : MONTH_FLOW;

  const income = data.reduce((sum, p) => sum + p.income, 0);
  const expense = data.reduce((sum, p) => sum + p.expense, 0);

  return (
    <div className="surface-card animate-[rise_0.5s_var(--ease-premium)_both] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Entradas x Saídas</p>
          <p className="numeric mt-1 text-xl font-semibold text-foreground">
            {money(toMoney(income - expense), { signed: true })}
          </p>
          <p className="mt-0.5 text-[0.7rem] text-muted-foreground">Resultado do período</p>
        </div>
        <SegmentedControl<Range>
          value={range}
          onChange={setRange}
          className="w-auto"
          options={[
            { value: "week", label: "Semana" },
            { value: "month", label: "Mês" },
          ]}
        />
      </div>

      <div className="mt-4 -ml-3 -mr-2" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
            <defs>
              <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.28} />
                <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 6" stroke="var(--border)" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              dy={6}
            />
            <Tooltip
              cursor={{ stroke: "var(--border-strong)", strokeWidth: 1 }}
              content={<ChartTooltip formatter={(v) => money(toMoney(v), { compact: true })} />}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="var(--chart-1)"
              strokeWidth={2.4}
              fill="url(#incomeFill)"
              animationDuration={900}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="var(--chart-2)"
              strokeWidth={2.4}
              fill="url(#expenseFill)"
              animationDuration={1100}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center gap-4 text-[0.72rem] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-chart-1" aria-hidden /> Entradas{" "}
          <b className="numeric font-semibold text-foreground">{money(toMoney(income), { compact: true })}</b>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-chart-2" aria-hidden /> Saídas{" "}
          <b className="numeric font-semibold text-foreground">{money(toMoney(expense), { compact: true })}</b>
        </span>
      </div>
    </div>
  );
}
