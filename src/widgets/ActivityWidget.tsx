import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { useMoneyFormatter } from "@/hooks/useMoneyFormatter";
import { toMoney } from "@/utils/format";
import { shortDate } from "@/utils/dates";
import { useCollection, useLedger, type ActivityRecord } from "@/providers/LedgerProvider";
import { ActivityEditor } from "@/components/finance/ActivityEditor";
import { IconTile } from "@/components/common/IconPicker";
import { stagger } from "@/animations/motion";
import { cn } from "@/lib/utils";

interface ActivityWidgetProps {
  title?: string;
  limit?: number;
  onSeeAll?: () => void;
  filter?: (item: ActivityRecord) => boolean;
}

/** Recent movements — add, edit and remove custom entries. */
export function ActivityWidget({
  title = "Movimentações recentes",
  limit = 5,
  onSeeAll,
  filter,
}: ActivityWidgetProps) {
  const money = useMoneyFormatter();
  const { categories } = useLedger();
  const { items, add, patch, remove } = useCollection("activity");
  const [editing, setEditing] = useState<ActivityRecord | null>(null);
  const [open, setOpen] = useState(false);

  const rows = [...items]
    .filter((i) => (filter ? filter(i) : true))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);

  return (
    <>
      <div className="surface-card animate-[rise_0.5s_var(--ease-premium)_both] overflow-hidden">
        <div className="hairline flex items-center gap-2 px-4 py-3">
          <p className="flex-1 text-sm font-semibold text-foreground">{title}</p>
          {onSeeAll && (
            <button
              onClick={onSeeAll}
              className="press flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-primary hover:bg-accent"
            >
              Ver tudo <ArrowRight className="size-3.5" aria-hidden />
            </button>
          )}
          <button
            aria-label="Adicionar lançamento"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            className="press grid size-7 place-items-center rounded-full bg-accent text-accent-foreground"
          >
            <Plus className="size-3.5" aria-hidden strokeWidth={2.4} />
          </button>
        </div>
        <ul>
          {rows.map((item, i) => (
            <li key={item.id} style={stagger(i, 50)} className="animate-[fade_0.4s_var(--ease-premium)_both]">
              <button
                onClick={() => {
                  setEditing(item);
                  setOpen(true);
                }}
                className="press hairline flex w-full items-center gap-3 px-4 py-3 text-left last:border-0 hover:bg-muted/50"
              >
                <IconTile icon={item.icon} tone={item.kind === "income" ? "success" : "muted"} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">{item.title}</span>
                  <span className="mt-0.5 block truncate text-[0.72rem] text-muted-foreground">
                    {item.category} · {shortDate(item.date)}
                  </span>
                </span>
                <span
                  className={cn(
                    "numeric shrink-0 text-sm font-semibold",
                    item.kind === "income" ? "text-success" : "text-foreground",
                  )}
                >
                  {money(toMoney(item.amount), { signed: true })}
                </span>
              </button>
            </li>
          ))}
          {rows.length === 0 && (
            <li className="px-4 py-6 text-center text-xs text-muted-foreground">
              Sem movimentações. Toque em + para registrar.
            </li>
          )}
        </ul>
      </div>

      <ActivityEditor
        open={open}
        onOpenChange={setOpen}
        initial={editing}
        categories={categories.map((c) => c.label)}
        onSave={(item) => (editing ? patch(item.id, item) : add(item))}
        onDelete={remove}
      />
    </>
  );
}
