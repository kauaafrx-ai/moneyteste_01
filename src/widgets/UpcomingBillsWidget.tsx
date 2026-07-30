import { useState } from "react";
import { CalendarClock, Pencil, Plus } from "lucide-react";
import { useMoneyFormatter } from "@/hooks/useMoneyFormatter";
import { toMoney } from "@/utils/format";
import { dueLabel } from "@/utils/dates";
import { useCollection, type BillRecord } from "@/providers/LedgerProvider";
import { BillEditor } from "@/components/finance/BillEditor";
import { IconTile } from "@/components/common/IconPicker";
import { stagger } from "@/animations/motion";
import { cn } from "@/lib/utils";

const statusStyle: Record<BillRecord["status"], string> = {
  due: "bg-warning/15 text-warning-foreground",
  pending: "bg-muted text-muted-foreground",
  late: "bg-destructive/12 text-destructive",
  paid: "bg-success/12 text-success",
};

/** Upcoming bills — fully editable (add, edit price, remove). */
export function UpcomingBillsWidget({ limit = 4 }: { limit?: number }) {
  const money = useMoneyFormatter();
  const { items, add, patch, remove } = useCollection("bills");
  const [editing, setEditing] = useState<BillRecord | null>(null);
  const [open, setOpen] = useState(false);

  const bills = [...items].sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, limit);
  const total = bills.reduce((sum, b) => sum + b.amount, 0);

  const openNew = () => {
    setEditing(null);
    setOpen(true);
  };

  return (
    <>
      <div className="surface-card animate-[rise_0.5s_var(--ease-premium)_both] overflow-hidden">
        <div className="hairline flex items-center gap-2 px-4 py-3">
          <span className="grid size-8 place-items-center rounded-[var(--radius-md)] bg-accent text-accent-foreground">
            <CalendarClock className="size-4" aria-hidden strokeWidth={2} />
          </span>
          <p className="flex-1 text-sm font-semibold text-foreground">Próximas contas</p>
          <span className="numeric text-xs font-semibold text-muted-foreground">
            {money(toMoney(total), { compact: true })}
          </span>
          <button
            aria-label="Adicionar conta"
            onClick={openNew}
            className="press grid size-7 place-items-center rounded-full bg-accent text-accent-foreground"
          >
            <Plus className="size-3.5" aria-hidden strokeWidth={2.4} />
          </button>
        </div>
        <ul>
          {bills.map((bill, i) => (
            <li key={bill.id} style={stagger(i, 55)} className="animate-[fade_0.4s_var(--ease-premium)_both]">
              <button
                onClick={() => {
                  setEditing(bill);
                  setOpen(true);
                }}
                className="press hairline flex w-full items-center gap-3 px-4 py-3 text-left last:border-0 hover:bg-muted/50"
              >
                <IconTile icon={bill.icon} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">{bill.title}</span>
                  <span className="mt-0.5 flex items-center gap-1.5">
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[0.65rem] font-semibold",
                        statusStyle[bill.status],
                      )}
                    >
                      {bill.status === "paid" ? "Paga" : dueLabel(bill.dueDate)}
                    </span>
                  </span>
                </span>
                <span className="numeric shrink-0 text-sm font-semibold text-foreground">
                  {money(toMoney(bill.amount))}
                </span>
                <Pencil className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
              </button>
            </li>
          ))}
          {bills.length === 0 && (
            <li className="px-4 py-6 text-center text-xs text-muted-foreground">
              Nenhuma conta cadastrada. Toque em + para adicionar.
            </li>
          )}
        </ul>
      </div>

      <BillEditor
        open={open}
        onOpenChange={setOpen}
        initial={editing}
        onSave={(bill) => (editing ? patch(bill.id, bill) : add(bill))}
        onDelete={remove}
      />
    </>
  );
}
