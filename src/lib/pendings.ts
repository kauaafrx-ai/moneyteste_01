/**
 * Unified pendency engine — pure functions.
 * Aggregates everything that requires the user's attention: bills, PIX and
 * other commitments (payables/receivables), subscriptions about to renew and
 * goals close to completion.
 */
import type {
  BillRecord,
  CommitmentRecord,
  GoalRecord,
  InstallmentRecord,
  SubscriptionRecord,
} from "@/providers/LedgerProvider";

export type PendingKind =
  | "bill"
  | "payable"
  | "receivable"
  | "pix"
  | "installment"
  | "subscription"
  | "goal";

export type PendingSeverity = "late" | "today" | "soon" | "info";

export interface PendingItem {
  id: string;
  kind: PendingKind;
  title: string;
  detail: string;
  amount: number;
  /** Signed for cash direction: positive = entra, negative = sai. */
  signedAmount: number;
  dueDate: string;
  daysLeft: number;
  severity: PendingSeverity;
  sourceId: string;
}

const DAY = 86_400_000;

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export function daysUntil(isoDate: string): number {
  const target = new Date(`${isoDate}T00:00:00`);
  return Math.round((target.getTime() - startOfToday().getTime()) / DAY);
}

export function severityFor(daysLeft: number): PendingSeverity {
  if (daysLeft < 0) return "late";
  if (daysLeft === 0) return "today";
  if (daysLeft <= 7) return "soon";
  return "info";
}

export function dueLabel(daysLeft: number): string {
  if (daysLeft < -1) return `Atrasado há ${Math.abs(daysLeft)} dias`;
  if (daysLeft === -1) return "Atrasado há 1 dia";
  if (daysLeft === 0) return "Vence hoje";
  if (daysLeft === 1) return "Vence amanhã";
  return `Vence em ${daysLeft} dias`;
}

/** Next occurrence (yyyy-mm-dd) of a monthly due day. */
export function nextMonthlyDue(dueDay: number): string {
  const today = startOfToday();
  const candidate = new Date(today.getFullYear(), today.getMonth(), dueDay);
  if (candidate < today) candidate.setMonth(candidate.getMonth() + 1);
  return candidate.toISOString().slice(0, 10);
}

interface BuildInput {
  bills: BillRecord[];
  commitments: CommitmentRecord[];
  subscriptions: SubscriptionRecord[];
  installments: InstallmentRecord[];
  goals: GoalRecord[];
}

export function buildPendings({
  bills,
  commitments,
  subscriptions,
  installments,
  goals,
}: BuildInput): PendingItem[] {
  const items: PendingItem[] = [];

  for (const bill of bills) {
    if (bill.status === "paid") continue;
    const daysLeft = daysUntil(bill.dueDate);
    items.push({
      id: `bill-${bill.id}`,
      kind: "bill",
      title: bill.title,
      detail: "Conta a pagar",
      amount: bill.amount,
      signedAmount: -bill.amount,
      dueDate: bill.dueDate,
      daysLeft,
      severity: severityFor(daysLeft),
      sourceId: bill.id,
    });
  }

  for (const c of commitments) {
    if (c.status === "paid" || c.status === "canceled") continue;
    const daysLeft = daysUntil(c.dueDate);
    const isPix = c.method === "pix";
    const receivable = c.direction === "receivable";
    items.push({
      id: `commitment-${c.id}`,
      kind: isPix ? "pix" : receivable ? "receivable" : "payable",
      title: c.counterparty,
      detail: receivable
        ? `A receber · ${c.category}`
        : `${isPix ? "PIX pendente" : "A pagar"} · ${c.category}`,
      amount: c.amount,
      signedAmount: receivable ? c.amount : -c.amount,
      dueDate: c.dueDate,
      daysLeft,
      severity: severityFor(daysLeft),
      sourceId: c.id,
    });
  }

  for (const p of installments) {
    if (p.paid >= p.count) continue;
    const dueDate = nextMonthlyDue(p.dueDay);
    const daysLeft = daysUntil(dueDate);
    const value = Math.round(p.total / p.count);
    items.push({
      id: `installment-${p.id}`,
      kind: "installment",
      title: p.title,
      detail: `Parcela ${p.paid + 1}/${p.count}`,
      amount: value,
      signedAmount: -value,
      dueDate,
      daysLeft,
      severity: severityFor(daysLeft),
      sourceId: p.id,
    });
  }

  for (const s of subscriptions) {
    const dueDate = nextMonthlyDue(s.dueDay);
    const daysLeft = daysUntil(dueDate);
    if (daysLeft > 10) continue;
    items.push({
      id: `subscription-${s.id}`,
      kind: "subscription",
      title: s.name,
      detail: `Assinatura ${s.cycle}`,
      amount: s.amount,
      signedAmount: -s.amount,
      dueDate,
      daysLeft,
      severity: severityFor(daysLeft),
      sourceId: s.id,
    });
  }

  for (const g of goals) {
    const ratio = g.target > 0 ? g.current / g.target : 0;
    if (ratio < 0.6) continue;
    items.push({
      id: `goal-${g.id}`,
      kind: "goal",
      title: g.title,
      detail: `Objetivo ${Math.round(ratio * 100)}% concluído · ${g.deadline}`,
      amount: Math.max(0, g.target - g.current),
      signedAmount: 0,
      dueDate: "",
      daysLeft: 999,
      severity: "info",
      sourceId: g.id,
    });
  }

  return items.sort((a, b) => a.daysLeft - b.daysLeft);
}

export const PENDING_GROUPS: { id: PendingKind | "all"; label: string }[] = [
  { id: "all", label: "Tudo" },
  { id: "bill", label: "Contas" },
  { id: "pix", label: "PIX" },
  { id: "payable", label: "Dívidas" },
  { id: "receivable", label: "A receber" },
  { id: "subscription", label: "Assinaturas" },
  { id: "goal", label: "Objetivos" },
];
