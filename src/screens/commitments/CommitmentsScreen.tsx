import { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, CalendarDays, CheckCircle2, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Section } from "@/components/common/Section";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { MetricTile } from "@/components/common/MetricTile";
import { CommitmentEditor } from "@/components/finance/CommitmentEditor";
import { useCollection, type CommitmentRecord } from "@/providers/LedgerProvider";
import { buildCommitmentReport, effectiveStatus, sortCommitmentsByAi } from "@/lib/finance-intelligence";
import { useMoneyFormatter } from "@/hooks/useMoneyFormatter";
import { toMoney } from "@/utils/format";
import { shortDate } from "@/utils/dates";
import { stagger } from "@/animations/motion";
import { cn } from "@/lib/utils";

type Tab = "payable" | "receivable" | "resumo";

const statusChip: Record<string, string> = {
  paid: "bg-success/12 text-success",
  pending: "bg-muted text-muted-foreground",
  scheduled: "bg-info/12 text-info",
  awaiting: "bg-warning/15 text-warning-foreground",
  late: "bg-destructive/12 text-destructive",
  canceled: "bg-muted text-muted-foreground line-through",
};

const statusLabel: Record<string, string> = {
  paid: "Quitado",
  pending: "Pendente",
  scheduled: "Agendado",
  awaiting: "Aguardando",
  late: "Atrasado",
  canceled: "Cancelado",
};

/** Central de Compromissos Financeiros — pagar, receber e acompanhar. */
export function CommitmentsScreen() {
  const money = useMoneyFormatter();
  const { items, add, patch, remove } = useCollection("commitments");
  const [tab, setTab] = useState<Tab>("payable");
  const [editing, setEditing] = useState<CommitmentRecord | null>(null);
  const [open, setOpen] = useState(false);

  const report = useMemo(() => buildCommitmentReport(items), [items]);
  const list = useMemo(() => sortCommitmentsByAi(items.filter((c) => c.direction === tab)), [items, tab]);

  const openNew = () => {
    setEditing(null);
    setOpen(true);
  };

  return (
    <AppShell>
      <ScreenHeader
        eyebrow="Compromissos"
        title="Central de contas"
        subtitle="O que você tem que pagar e o que tem a receber."
        actions={
          <button
            aria-label="Novo compromisso"
            onClick={openNew}
            className="press grid size-10 place-items-center rounded-full bg-gradient-brand text-primary-foreground shadow-brand-glow"
          >
            <Plus className="size-4" aria-hidden strokeWidth={2.4} />
          </button>
        }
      />

      <div className="mt-5 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <MetricTile
            label="A pagar"
            value={money(toMoney(report.totalPayable), { compact: true })}
            icon={ArrowUpRight}
            style={stagger(0)}
          />
          <MetricTile
            label="A receber"
            value={money(toMoney(report.totalReceivable), { compact: true })}
            icon={ArrowDownLeft}
            tone="success"
            style={stagger(1)}
          />
          <MetricTile label="Quitados" value={String(report.settled)} icon={CheckCircle2} style={stagger(2)} />
          <MetricTile
            label="Em atraso"
            value={String(report.overdue)}
            icon={CalendarDays}
            style={stagger(3)}
          />
        </div>

        <SegmentedControl
          value={tab}
          onChange={setTab}
          options={[
            { value: "payable", label: "Pagar" },
            { value: "receivable", label: "Receber" },
            { value: "resumo", label: "Resumo" },
          ]}
        />

        {tab !== "resumo" && (
          <Section
            title={tab === "payable" ? "Tenho que pagar" : "Tenho que receber"}
            description="Ordenado pela prioridade calculada pela IA."
          >
            <div className="space-y-2.5">
              {list.map((c, i) => {
                const status = effectiveStatus(c);
                return (
                  <button
                    key={c.id}
                    style={stagger(i, 45)}
                    onClick={() => {
                      setEditing(c);
                      setOpen(true);
                    }}
                    className="surface-card card-interactive press animate-[rise_0.45s_var(--ease-premium)_both] flex w-full items-center gap-3 p-3.5 text-left"
                  >
                    <span
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-[var(--radius-lg)]",
                        c.direction === "payable"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-success/12 text-success",
                      )}
                    >
                      {c.direction === "payable" ? (
                        <ArrowUpRight className="size-4" aria-hidden strokeWidth={2.2} />
                      ) : (
                        <ArrowDownLeft className="size-4" aria-hidden strokeWidth={2.2} />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-foreground">
                        {c.counterparty}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1.5 text-[0.68rem] text-muted-foreground">
                        {shortDate(c.dueDate)} · {c.category}
                        <span
                          className={cn(
                            "rounded-full px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider",
                            statusChip[status],
                          )}
                        >
                          {statusLabel[status]}
                        </span>
                      </span>
                    </span>
                    <span className="numeric shrink-0 text-sm font-semibold text-foreground">
                      {money(toMoney(c.amount))}
                    </span>
                  </button>
                );
              })}

              <button
                onClick={openNew}
                className="press flex w-full items-center justify-center gap-2 rounded-[var(--radius-2xl)] border border-dashed border-border bg-card p-3 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <Plus className="size-4" aria-hidden strokeWidth={2.2} />
                {tab === "payable" ? "Adicionar pagamento" : "Adicionar recebimento"}
              </button>
            </div>
          </Section>
        )}

        {tab === "resumo" && (
          <Section title="Resumo inteligente" description="Como seus compromissos se comportam.">
            <div className="surface-card space-y-3 p-4">
              <p className="text-xs text-muted-foreground">
                Você quitou <strong className="text-foreground">{report.settled}</strong> compromissos, com
                média de <strong className="text-foreground">{report.avgSettleDays}</strong> dia(s) em relação
                ao vencimento.
              </p>
              {report.topCounterparties.map((p, i) => (
                <div
                  key={p.name}
                  style={stagger(i, 45)}
                  className="animate-[fade_0.4s_var(--ease-premium)_both] flex items-center justify-between gap-3 border-t border-border pt-2 text-xs"
                >
                  <span className="truncate font-medium text-foreground">{p.name}</span>
                  <span className="numeric shrink-0 text-muted-foreground">
                    {p.count}× · {money(toMoney(p.amount), { compact: true })}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>

      <CommitmentEditor
        open={open}
        onOpenChange={setOpen}
        initial={editing}
        defaultDirection={tab === "receivable" ? "receivable" : "payable"}
        onSave={(record) => (editing ? patch(record.id, record) : add(record))}
        onDelete={(id) => remove(id)}
      />
    </AppShell>
  );
}
