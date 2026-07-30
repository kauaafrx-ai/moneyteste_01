import { useState } from "react";
import { Pencil, Plus, Target } from "lucide-react";
import { useMoneyFormatter } from "@/hooks/useMoneyFormatter";
import { toMoney } from "@/utils/format";
import { ProgressBar } from "@/components/common/Progress";
import { GoalEditor } from "@/components/finance/GoalEditor";
import { resolveIcon } from "@/data/icon-registry";
import { useCollection, type GoalRecord } from "@/providers/LedgerProvider";
import { stagger } from "@/animations/motion";

/** Goals with animated progress tracks — tap a goal to edit its values. */
export function GoalsWidget({ limit = 3 }: { limit?: number }) {
  const money = useMoneyFormatter();
  const { items, add, patch, remove } = useCollection("goals");
  const [editing, setEditing] = useState<GoalRecord | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      {items.slice(0, limit).map((goal, i) => {
        const pct = Math.min(100, Math.round((goal.current / Math.max(goal.target, 1)) * 100));
        const Icon = resolveIcon(goal.icon);
        return (
          <button
            key={goal.id}
            style={stagger(i, 60)}
            onClick={() => {
              setEditing(goal);
              setOpen(true);
            }}
            className="surface-card card-interactive animate-[rise_0.5s_var(--ease-premium)_both] w-full p-4 text-left"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-lg)] bg-accent text-accent-foreground">
                <Icon className="size-[1.1rem]" aria-hidden strokeWidth={1.9} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{goal.title}</p>
                <p className="text-[0.72rem] text-muted-foreground">
                  {goal.deadline ? `Meta para ${goal.deadline}` : "Sem prazo definido"}
                </p>
              </div>
              <Pencil className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            </div>
            <ProgressBar
              className="mt-3"
              value={pct}
              label={`${pct}% concluído`}
              hint={`${money(toMoney(goal.current), { compact: true })} / ${money(toMoney(goal.target), { compact: true })}`}
            />
          </button>
        );
      })}

      <button
        onClick={() => {
          setEditing(null);
          setOpen(true);
        }}
        className="press flex w-full items-center justify-center gap-2 rounded-[var(--radius-2xl)] border border-dashed border-border bg-card p-3 text-xs font-semibold text-muted-foreground hover:bg-accent"
      >
        <Plus className="size-4" aria-hidden strokeWidth={2.2} /> Nova meta
      </button>

      {items.length === 0 && (
        <div className="surface-card grid place-items-center gap-2 p-8 text-center">
          <Target className="size-5 text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">Nenhuma meta criada</p>
        </div>
      )}

      <GoalEditor
        open={open}
        onOpenChange={setOpen}
        initial={editing}
        onSave={(goal) => (editing ? patch(goal.id, goal) : add(goal))}
        onDelete={remove}
      />
    </div>
  );
}
