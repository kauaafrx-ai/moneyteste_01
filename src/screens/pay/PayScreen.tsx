import { useMemo, useState } from "react";
import {
  AlarmClock,
  CheckCircle2,
  CreditCard,
  Handshake,
  Repeat,
  Smartphone,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Section } from "@/components/common/Section";
import { PremiumButton } from "@/components/common/PremiumButton";
import { useLedger, useCollection } from "@/providers/LedgerProvider";
import { useMoneyFormatter } from "@/hooks/useMoneyFormatter";
import { toMoney, amountTone } from "@/utils/format";
import { buildPendings, dueLabel, type PendingItem, type PendingKind } from "@/lib/pendings";
import { stagger } from "@/animations/motion";
import { cn } from "@/lib/utils";

const ICONS: Record<PendingKind, LucideIcon> = {
  bill: Zap,
  payable: Handshake,
  receivable: Handshake,
  pix: Smartphone,
  installment: CreditCard,
  subscription: Repeat,
  goal: Zap,
};

const FILTERS: { id: "all" | PendingKind; label: string }[] = [
  { id: "all", label: "Tudo" },
  { id: "bill", label: "Contas" },
  { id: "pix", label: "PIX" },
  { id: "payable", label: "Dívidas" },
  { id: "installment", label: "Parcelas" },
  { id: "subscription", label: "Assinaturas" },
];

/**
 * "Pagar" — everything that has to leave the account, in one screen.
 * Marking as paid writes back to the ledger record of origin.
 */
export function PayScreen() {
  const { bills, commitments, subscriptions, installments, goals } = useLedger();
  const billsCol = useCollection("bills");
  const commitmentsCol = useCollection("commitments");
  const installmentsCol = useCollection("installments");
  const money = useMoneyFormatter();
  const [filter, setFilter] = useState<"all" | PendingKind>("all");

  const payables = useMemo(
    () =>
      buildPendings({ bills, commitments, subscriptions, installments, goals }).filter(
        (p) => p.signedAmount < 0,
      ),
    [bills, commitments, subscriptions, installments, goals],
  );

  const visible = filter === "all" ? payables : payables.filter((p) => p.kind === filter);
  const late = payables.filter((p) => p.severity === "late");
  const total = visible.reduce((s, p) => s + p.amount, 0);
  const lateTotal = late.reduce((s, p) => s + p.amount, 0);

  const markPaid = (item: PendingItem) => {
    if (item.kind === "bill") billsCol.patch(item.sourceId, { status: "paid" });
    else if (item.kind === "pix" || item.kind === "payable")
      commitmentsCol.patch(item.sourceId, {
        status: "paid",
        paidAt: new Date().toISOString().slice(0, 10),
      });
    else if (item.kind === "installment") {
      const parcel = installments.find((p) => p.id === item.sourceId);
      if (parcel) installmentsCol.patch(item.sourceId, { paid: Math.min(parcel.count, parcel.paid + 1) });
    }
  };

  return (
    <AppShell>
      <ScreenHeader
        eyebrow="Saídas"
        title="Pagar"
        subtitle="Tudo que precisa ser pago, reunido e priorizado."
        backTo="/"
      />

      <div className="mt-5 space-y-6">
        <section className="bg-gradient-brand shadow-elevated animate-[rise_0.5s_var(--ease-premium)_both] relative overflow-hidden rounded-[var(--radius-3xl)] p-5 text-primary-foreground">
          <div aria-hidden className="animate-float absolute -right-14 -top-20 size-52 rounded-full bg-primary-glow/30 blur-3xl" />
          <p className="text-eyebrow relative opacity-80">Total selecionado</p>
          <p className="numeric relative mt-1 text-[2.1rem] font-semibold leading-none">
            {money(toMoney(total))}
          </p>
          <div className="relative mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-[var(--radius-xl)] bg-primary-foreground/10 p-3 backdrop-blur-sm">
              <p className="text-[0.65rem] uppercase tracking-[0.14em] opacity-80">Em atraso</p>
              <p className="numeric mt-1 text-base font-semibold">{money(toMoney(lateTotal))}</p>
            </div>
            <div className="rounded-[var(--radius-xl)] bg-primary-foreground/10 p-3 backdrop-blur-sm">
              <p className="text-[0.65rem] uppercase tracking-[0.14em] opacity-80">Itens</p>
              <p className="numeric mt-1 text-base font-semibold">{visible.length}</p>
            </div>
          </div>
        </section>

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {FILTERS.map((f, i) => (
            <button
              key={f.id}
              style={stagger(i, 30)}
              onClick={() => setFilter(f.id)}
              className={cn(
                "press animate-[fade_0.3s_var(--ease-premium)_both] shrink-0 rounded-full border px-3 py-2 text-xs font-semibold shadow-xs transition-colors",
                filter === f.id
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <Section title="Pendências" description="Toque em pagar para dar baixa imediata.">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-[var(--radius-2xl)] border border-dashed border-border p-10 text-center">
              <CheckCircle2 className="size-7 text-success" aria-hidden />
              <p className="text-sm font-semibold text-foreground">Nada a pagar por aqui</p>
              <p className="text-xs text-muted-foreground">Você quitou tudo desta categoria.</p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {visible.map((item, i) => {
                const Icon = ICONS[item.kind];
                return (
                  <li
                    key={item.id}
                    style={stagger(i, 45)}
                    className="surface-card card-interactive animate-[rise_0.4s_var(--ease-premium)_both] p-3.5"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "grid size-10 shrink-0 place-items-center rounded-[var(--radius-lg)] border transition-transform duration-200 hover:scale-110",
                          item.severity === "late"
                            ? "border-destructive/40 bg-destructive/10 text-destructive"
                            : "border-border bg-surface text-muted-foreground",
                        )}
                      >
                        <Icon className="size-4" aria-hidden strokeWidth={1.9} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-foreground">
                          {item.title}
                        </span>
                        <span className="mt-0.5 flex items-center gap-1.5 text-[0.7rem] text-muted-foreground">
                          {item.severity === "late" && (
                            <AlarmClock className="size-3 text-destructive" aria-hidden />
                          )}
                          {dueLabel(item.daysLeft)} · {item.detail}
                        </span>
                      </span>
                      <span className={cn("numeric text-sm font-semibold", amountTone(-1))}>
                        {money(toMoney(item.amount))}
                      </span>
                    </div>
                    {item.kind !== "subscription" && (
                      <PremiumButton
                        variant="soft"
                        size="sm"
                        block
                        className="mt-3"
                        onClick={() => markPaid(item)}
                      >
                        Marcar como pago
                      </PremiumButton>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Section>
      </div>
    </AppShell>
  );
}
