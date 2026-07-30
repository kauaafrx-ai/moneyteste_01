import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Pencil, Plus } from "lucide-react";
import { useMoneyFormatter } from "@/hooks/useMoneyFormatter";
import { toMoney } from "@/utils/format";
import { ChartTooltip } from "@/components/common/ChartTooltip";
import { CategoryEditor } from "@/components/finance/CategoryEditor";
import { useCollection, type CategoryRecord } from "@/providers/LedgerProvider";
import { stagger } from "@/animations/motion";

interface BreakdownWidgetProps {
  title?: string;
  caption?: string;
  editable?: boolean;
}

/** Donut breakdown of categories with an editable legend. */
export function BreakdownWidget({
  title = "Gastos por categoria",
  caption = "Este mês",
  editable = true,
}: BreakdownWidgetProps) {
  const money = useMoneyFormatter();
  const { items, add, patch, remove } = useCollection("categories");
  const [editing, setEditing] = useState<CategoryRecord | null>(null);
  const [open, setOpen] = useState(false);

  const total = items.reduce((sum, c) => sum + c.amount, 0) || 1;

  return (
    <div className="surface-card animate-[rise_0.5s_var(--ease-premium)_both] p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <span className="text-[0.7rem] text-muted-foreground">{caption}</span>
      </div>

      <div className="mt-3 flex items-center gap-4">
        <div className="relative size-[124px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<ChartTooltip formatter={(v) => money(toMoney(v))} />} />
              <Pie
                data={items}
                dataKey="amount"
                nameKey="label"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={3}
                cornerRadius={6}
                stroke="none"
                animationDuration={900}
              >
                {items.map((slice) => (
                  <Cell key={slice.id} fill={slice.colorVar} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">Total</p>
              <p className="numeric text-sm font-semibold text-foreground">
                {money(toMoney(total), { compact: true })}
              </p>
            </div>
          </div>
        </div>

        <ul className="min-w-0 flex-1 space-y-2">
          {items.map((slice, i) => (
            <li key={slice.id} style={stagger(i, 60)} className="animate-[fade_0.35s_var(--ease-premium)_both]">
              <button
                disabled={!editable}
                onClick={() => {
                  setEditing(slice);
                  setOpen(true);
                }}
                className="flex w-full items-center gap-2 rounded-[var(--radius-md)] py-0.5 text-left enabled:hover:bg-muted/60"
              >
                <span className="size-2 shrink-0 rounded-full" style={{ background: slice.colorVar }} aria-hidden />
                <span className="min-w-0 flex-1 truncate text-xs text-foreground">{slice.label}</span>
                <span className="numeric shrink-0 text-xs font-semibold text-muted-foreground">
                  {Math.round((slice.amount / total) * 100)}%
                </span>
                {editable && <Pencil className="size-3 shrink-0 text-muted-foreground" aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {editable && (
        <>
          <button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            className="press mt-3 flex w-full items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-dashed border-border p-2 text-xs font-semibold text-muted-foreground hover:bg-accent"
          >
            <Plus className="size-3.5" aria-hidden strokeWidth={2.4} /> Nova categoria
          </button>
          <CategoryEditor
            open={open}
            onOpenChange={setOpen}
            initial={editing}
            onSave={(item) => (editing ? patch(item.id, item) : add(item))}
            onDelete={remove}
          />
        </>
      )}
    </div>
  );
}
