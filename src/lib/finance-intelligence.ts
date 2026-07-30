/**
 * Motor de Inteligência Financeira — puro, sem efeitos colaterais.
 * Todos os valores monetários em centavos.
 */
import type {
  ActivityRecord,
  BillRecord,
  CategoryRecord,
  CommitmentRecord,
  GoalRecord,
  InstallmentRecord,
  LedgerState,
} from "@/providers/LedgerProvider";

export type Band = "excelente" | "boa" | "atencao" | "critica";

export interface ScoreFactor {
  id: string;
  label: string;
  /** 0–100 dentro do fator */
  score: number;
  /** peso relativo (0–1) */
  weight: number;
  detail: string;
  advice: string;
}

export interface HealthScore {
  score: number;
  band: Band;
  emoji: string;
  headline: string;
  factors: ScoreFactor[];
  highlights: string[];
}

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));
const round = (v: number) => Math.round(v);

export const DAY = 86_400_000;

export function daysUntil(iso: string, from = new Date()): number {
  const target = new Date(`${iso}T00:00:00`);
  const base = new Date(from);
  base.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - base.getTime()) / DAY);
}

export function monthKey(iso: string) {
  return iso.slice(0, 7);
}

export function bandOf(score: number): Band {
  if (score >= 85) return "excelente";
  if (score >= 70) return "boa";
  if (score >= 50) return "atencao";
  return "critica";
}

export const BAND_META: Record<Band, { label: string; emoji: string; tone: "success" | "primary" | "warning" | "destructive" }> = {
  excelente: { label: "Excelente", emoji: "🟢", tone: "success" },
  boa: { label: "Boa", emoji: "🟢", tone: "primary" },
  atencao: { label: "Atenção", emoji: "🟡", tone: "warning" },
  critica: { label: "Crítica", emoji: "🔴", tone: "destructive" },
};

/* ── Agregações base ─────────────────────────────────────── */

export interface Aggregates {
  income30: number;
  expense30: number;
  incomePrev: number;
  expensePrev: number;
  savings30: number;
  savingsRatio: number;
  netWorth: number;
  netWorthGrowth: number;
  reserveMonths: number;
  reserveRatio: number;
  lateBills: number;
  openDebt: number;
  goalsAchieved: number;
  goalsTotal: number;
  byCategory: Array<{ id: string; label: string; amount: number; prev: number; colorVar: string }>;
}

export function aggregate(state: LedgerState): Aggregates {
  const now = new Date();
  const inWindow = (iso: string, start: number, end: number) => {
    const d = daysUntil(iso, now);
    return d <= -start && d > -end;
  };

  const sum = (list: ActivityRecord[], sign: 1 | -1) =>
    list.reduce((acc, a) => (sign > 0 ? (a.amount > 0 ? acc + a.amount : acc) : a.amount < 0 ? acc - a.amount : acc), 0);

  const cur = state.activity.filter((a) => inWindow(a.date, 0, 30));
  const prev = state.activity.filter((a) => inWindow(a.date, 30, 60));

  const income30 = sum(cur, 1);
  const expense30 = sum(cur, -1);
  const incomePrev = sum(prev, 1);
  const expensePrev = sum(prev, -1);
  const savings30 = income30 - expense30;
  const savingsRatio = income30 > 0 ? savings30 / income30 : 0;

  const assets = state.assets.reduce((s, a) => s + a.amount, 0);
  const openDebt = state.installments.reduce(
    (s, p) => s + Math.max(0, Math.round((p.total / p.count) * (p.count - p.paid))),
    0,
  );
  const netWorth = assets + state.reserve.current - openDebt;
  const netWorthGrowth = assets > 0 ? savings30 / Math.max(assets, 1) : 0;

  const reserveMonths = state.reserve.monthlyCost > 0 ? state.reserve.current / state.reserve.monthlyCost : 0;
  const reserveRatio = state.reserve.months > 0 ? reserveMonths / state.reserve.months : 0;

  const lateBills =
    state.bills.filter((b) => b.status !== "paid" && daysUntil(b.dueDate, now) < 0).length +
    state.commitments.filter((c) => c.direction === "payable" && c.status !== "paid" && c.status !== "canceled" && daysUntil(c.dueDate, now) < 0).length;

  const goalsAchieved = state.goals.filter((g) => g.current >= g.target).length;

  const byCategory = state.categories.map((c) => {
    const match = (a: ActivityRecord) => a.amount < 0 && a.category.toLowerCase() === c.label.toLowerCase();
    const amount = cur.filter(match).reduce((s, a) => s - a.amount, 0) || c.amount;
    const prevAmount = prev.filter(match).reduce((s, a) => s - a.amount, 0) || Math.round(c.amount * 0.86);
    return { id: c.id, label: c.label, amount, prev: prevAmount, colorVar: c.colorVar };
  });

  return {
    income30,
    expense30,
    incomePrev,
    expensePrev,
    savings30,
    savingsRatio,
    netWorth,
    netWorthGrowth,
    reserveMonths,
    reserveRatio,
    lateBills,
    openDebt,
    goalsAchieved,
    goalsTotal: state.goals.length,
    byCategory,
  };
}

/* ── Saúde Financeira ────────────────────────────────────── */

export function computeHealthScore(state: LedgerState): HealthScore {
  const a = aggregate(state);

  const spendRatio = a.income30 > 0 ? a.expense30 / a.income30 : 1;
  const factors: ScoreFactor[] = [
    {
      id: "spend",
      label: "Gastos sobre a renda",
      score: clamp(100 - (spendRatio - 0.5) * 200),
      weight: 0.2,
      detail: `Você comprometeu ${Math.round(spendRatio * 100)}% da renda dos últimos 30 dias.`,
      advice: "Mantenha os gastos abaixo de 70% da renda para liberar espaço de investimento.",
    },
    {
      id: "savings",
      label: "Economia mensal",
      score: clamp(a.savingsRatio * 400),
      weight: 0.16,
      detail: `Sobrou ${Math.round(Math.max(a.savingsRatio, 0) * 100)}% da renda neste período.`,
      advice: "Automatize uma transferência no dia do recebimento para elevar a taxa de poupança.",
    },
    {
      id: "reserve",
      label: "Reserva de emergência",
      score: clamp(a.reserveRatio * 100),
      weight: 0.18,
      detail: `Sua reserva cobre ${a.reserveMonths.toFixed(1)} meses de custo fixo.`,
      advice: "Uma reserva de 6 meses reduz drasticamente o risco de endividamento.",
    },
    {
      id: "debt",
      label: "Dívidas em aberto",
      score: clamp(100 - (a.openDebt / Math.max(a.income30 * 6, 1)) * 100),
      weight: 0.16,
      detail: `Saldo devedor de parcelamentos equivalente a ${(a.openDebt / Math.max(a.income30, 1)).toFixed(1)}x sua renda mensal.`,
      advice: "Quite primeiro as dívidas com maior custo e evite novos parcelamentos longos.",
    },
    {
      id: "punctuality",
      label: "Pontualidade",
      score: clamp(100 - a.lateBills * 22),
      weight: 0.12,
      detail: a.lateBills === 0 ? "Nenhum compromisso em atraso." : `${a.lateBills} compromisso(s) em atraso.`,
      advice: "Agende pagamentos recorrentes para não depender da memória.",
    },
    {
      id: "wealth",
      label: "Crescimento do patrimônio",
      score: clamp(50 + a.netWorthGrowth * 1200),
      weight: 0.1,
      detail: `Variação estimada de ${(a.netWorthGrowth * 100).toFixed(1)}% no mês.`,
      advice: "Aportes constantes importam mais que o tamanho de cada aporte.",
    },
    {
      id: "goals",
      label: "Objetivos financeiros",
      score: a.goalsTotal
        ? clamp(
            (state.goals.reduce((s, g) => s + Math.min(1, g.current / Math.max(g.target, 1)), 0) / a.goalsTotal) * 100,
          )
        : 40,
      weight: 0.08,
      detail: a.goalsTotal ? `${a.goalsAchieved} de ${a.goalsTotal} objetivos concluídos.` : "Nenhum objetivo cadastrado.",
      advice: "Objetivos com prazo definido aumentam a taxa de conclusão.",
    },
  ];

  const score = round(factors.reduce((s, f) => s + f.score * f.weight, 0));
  const band = bandOf(score);

  const highlights: string[] = [];
  if (a.netWorthGrowth > 0) highlights.push(`Seu patrimônio cresceu ${(a.netWorthGrowth * 100).toFixed(1)}% este mês.`);
  if (a.savings30 > 0) highlights.push(`Você economizou ${formatCents(a.savings30)} nos últimos 30 dias.`);
  if (a.reserveMonths >= 1) highlights.push(`Sua reserva cobre ${a.reserveMonths.toFixed(1)} meses de despesas.`);
  if (a.lateBills > 0) highlights.push(`${a.lateBills} compromisso(s) precisam de atenção imediata.`);

  return {
    score,
    band,
    emoji: BAND_META[band].emoji,
    headline:
      band === "excelente"
        ? "Sua organização financeira está acima da média."
        : band === "boa"
          ? "Bom equilíbrio — há espaço para otimizar."
          : band === "atencao"
            ? "Alguns pontos estão pressionando seu orçamento."
            : "Priorize reduzir despesas e regularizar atrasos.",
    factors,
    highlights,
  };
}

/* ── Radar de gastos anormais ────────────────────────────── */

export type AnomalySeverity = "alta" | "media" | "baixa";

export interface Anomaly {
  id: string;
  title: string;
  description: string;
  severity: AnomalySeverity;
  kind: "categoria" | "recorrencia" | "duplicidade" | "impulso" | "assinatura";
}

export function detectAnomalies(state: LedgerState): Anomaly[] {
  const a = aggregate(state);
  const out: Anomaly[] = [];

  for (const c of a.byCategory) {
    if (c.prev > 0 && c.amount > c.prev * 1.2) {
      const growth = Math.round((c.amount / c.prev - 1) * 100);
      out.push({
        id: `cat-${c.id}`,
        kind: "categoria",
        severity: growth > 50 ? "alta" : growth > 30 ? "media" : "baixa",
        title: `${c.label} aumentou ${growth}% este mês`,
        description: `De ${formatCents(c.prev)} para ${formatCents(c.amount)} em relação ao período anterior.`,
      });
    }
  }

  const byMerchant = new Map<string, ActivityRecord[]>();
  for (const item of state.activity.filter((i) => i.amount < 0)) {
    const key = item.title.trim().toLowerCase();
    byMerchant.set(key, [...(byMerchant.get(key) ?? []), item]);
  }
  for (const [key, items] of byMerchant) {
    if (items.length >= 4) {
      out.push({
        id: `rep-${key}`,
        kind: "recorrencia",
        severity: items.length >= 6 ? "media" : "baixa",
        title: `${items.length} compras em ${items[0].title}`,
        description: `Total de ${formatCents(items.reduce((s, i) => s - i.amount, 0))} no período analisado.`,
      });
    }
    const sameDay = new Map<string, ActivityRecord[]>();
    for (const i of items) {
      const k = `${i.date}|${i.amount}`;
      sameDay.set(k, [...(sameDay.get(k) ?? []), i]);
    }
    for (const [k, dup] of sameDay) {
      if (dup.length > 1) {
        out.push({
          id: `dup-${key}-${k}`,
          kind: "duplicidade",
          severity: "alta",
          title: `Possível duplicidade em ${dup[0].title}`,
          description: `${dup.length} lançamentos idênticos de ${formatCents(-dup[0].amount)} no mesmo dia.`,
        });
      }
    }
  }

  const avgTicket =
    state.activity.filter((i) => i.amount < 0).reduce((s, i) => s - i.amount, 0) /
    Math.max(state.activity.filter((i) => i.amount < 0).length, 1);
  for (const i of state.activity.filter((i) => i.amount < 0)) {
    if (-i.amount > avgTicket * 3 && daysUntil(i.date) > -30) {
      out.push({
        id: `imp-${i.id}`,
        kind: "impulso",
        severity: "media",
        title: `Gasto muito acima da média em ${i.title}`,
        description: `${formatCents(-i.amount)} — cerca de ${((-i.amount / Math.max(avgTicket, 1))).toFixed(1)}x o seu ticket médio.`,
      });
    }
  }

  const unusedSubs = state.subscriptions.filter(
    (s) => !state.activity.some((a2) => a2.title.toLowerCase().includes(s.name.toLowerCase())),
  );
  for (const s of unusedSubs) {
    out.push({
      id: `sub-${s.id}`,
      kind: "assinatura",
      severity: "baixa",
      title: `Assinatura sem uso registrado: ${s.name}`,
      description: `${formatCents(s.amount)} por mês sem movimentações associadas.`,
    });
  }

  const rank: Record<AnomalySeverity, number> = { alta: 0, media: 1, baixa: 2 };
  return out.sort((x, y) => rank[x.severity] - rank[y.severity]).slice(0, 8);
}

/* ── Feed inteligente ────────────────────────────────────── */

export interface FeedItem {
  id: string;
  tone: "positive" | "neutral" | "alert";
  title: string;
  body: string;
  metric?: string;
}

export function buildFeed(state: LedgerState): FeedItem[] {
  const a = aggregate(state);
  const items: FeedItem[] = [];

  if (a.savings30 > 0) {
    items.push({
      id: "f-save",
      tone: "positive",
      title: "Você fechou o período no azul",
      body: `Sobraram ${formatCents(a.savings30)} depois de todas as saídas registradas.`,
      metric: `${Math.round(a.savingsRatio * 100)}%`,
    });
  }
  if (a.netWorthGrowth !== 0) {
    items.push({
      id: "f-wealth",
      tone: a.netWorthGrowth > 0 ? "positive" : "alert",
      title: a.netWorthGrowth > 0 ? "Seu patrimônio aumentou" : "Seu patrimônio recuou",
      body: `Variação estimada de ${(a.netWorthGrowth * 100).toFixed(1)}% considerando aportes e saldo devedor.`,
      metric: `${(a.netWorthGrowth * 100).toFixed(1)}%`,
    });
  }
  const reserveGoal = Math.round(a.reserveRatio * 100);
  items.push({
    id: "f-reserve",
    tone: reserveGoal >= 70 ? "positive" : "neutral",
    title: "Meta da reserva de emergência",
    body: `Você atingiu ${reserveGoal}% do objetivo de ${state.reserve.months} meses de cobertura.`,
    metric: `${reserveGoal}%`,
  });

  const drops = a.byCategory.filter((c) => c.prev > 0 && c.amount < c.prev * 0.9);
  for (const d of drops.slice(0, 2)) {
    items.push({
      id: `f-drop-${d.id}`,
      tone: "positive",
      title: `Você reduziu gastos com ${d.label.toLowerCase()}`,
      body: `Queda de ${Math.round((1 - d.amount / d.prev) * 100)}% em relação ao período anterior.`,
      metric: `-${Math.round((1 - d.amount / d.prev) * 100)}%`,
    });
  }

  const nearGoal = state.goals.find((g) => g.current / Math.max(g.target, 1) > 0.6);
  if (nearGoal) {
    items.push({
      id: `f-goal-${nearGoal.id}`,
      tone: "positive",
      title: `Objetivo "${nearGoal.title}" avançando`,
      body: `Já são ${formatCents(nearGoal.current)} de ${formatCents(nearGoal.target)} guardados.`,
      metric: `${Math.round((nearGoal.current / nearGoal.target) * 100)}%`,
    });
  }

  if (a.lateBills > 0) {
    items.push({
      id: "f-late",
      tone: "alert",
      title: "Compromissos em atraso",
      body: `${a.lateBills} pendência(s) passaram do vencimento. Regularize para proteger sua pontuação.`,
    });
  }

  return items;
}

/* ── IA comentando cada movimentação ─────────────────────── */

export function commentTransaction(item: ActivityRecord, all: ActivityRecord[]): string {
  if (item.amount > 0) {
    const sameSource = all.filter((a) => a.amount > 0 && a.title === item.title);
    return sameSource.length > 1
      ? `Entrada recorrente de ${item.title}. É a ${sameSource.length}ª registrada.`
      : "Nova entrada registrada — considere destinar parte para a reserva.";
  }

  const same = all.filter((a) => a.amount < 0 && a.title.toLowerCase() === item.title.toLowerCase());
  const sameCategory = all.filter((a) => a.amount < 0 && a.category === item.category);
  const avg = sameCategory.reduce((s, a) => s - a.amount, 0) / Math.max(sameCategory.length, 1);
  const value = -item.amount;

  if (same.length >= 4) return `Este é o ${same.length}º gasto em ${item.title} no período analisado.`;
  if (value > avg * 1.6) return `Acima da média de ${item.category.toLowerCase()} (${formatCents(Math.round(avg))}).`;
  if (value < avg * 0.6) return `Abaixo da média de ${item.category.toLowerCase()} — bom controle.`;
  return `Este gasto está dentro da média dos últimos meses em ${item.category.toLowerCase()}.`;
}

/* ── Busca inteligente ───────────────────────────────────── */

export interface SearchResult {
  answer: string;
  total: number;
  matches: ActivityRecord[];
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export function smartSearch(query: string, state: LedgerState): SearchResult {
  const q = normalize(query.trim());
  if (!q) return { answer: "", total: 0, matches: [] };

  const wantsIncome = /(recebi|receita|entrada|ganhei|salario)/.test(q);
  const wantsExpense = /(gastei|paguei|saida|despesa|comprei)/.test(q);
  const aboveMatch = q.match(/acima de r?\$?\s*([\d.,]+)/);
  const threshold = aboveMatch ? Math.round(parseFloat(aboveMatch[1].replace(/\./g, "").replace(",", ".")) * 100) : 0;

  const stop = new Set([
    "quanto","gastei","com","este","esse","ano","mes","mês","paguei","ao","a","o","de","da","do","em","recebi","recebido",
    "empresa","quanto?","mostrar","todos","os","acima","r$","meu","minha","na","no","que","eu","total","pix","tenho",
  ]);
  const terms = q.split(/\s+/).filter((t) => t.length > 2 && !stop.has(t));

  const matches = state.activity.filter((item) => {
    if (wantsIncome && item.amount <= 0) return false;
    if (wantsExpense && item.amount >= 0) return false;
    if (threshold && Math.abs(item.amount) < threshold) return false;
    if (!terms.length) return true;
    const haystack = normalize(`${item.title} ${item.category}`);
    return terms.some((t) => haystack.includes(t));
  });

  const total = matches.reduce((s, m) => s + Math.abs(m.amount), 0);
  const subject = terms.length ? terms.join(", ") : wantsIncome ? "entradas" : "movimentações";

  return {
    answer: matches.length
      ? `Encontrei ${matches.length} movimentação(ões) sobre ${subject}, somando ${formatCents(total)}.`
      : `Não encontrei movimentações para "${query}". Tente outro termo ou período.`,
    total,
    matches: matches.slice(0, 40),
  };
}

/* ── Objetivos inteligentes ──────────────────────────────── */

export interface GoalPlan {
  monthsLeft: number;
  monthlyNeeded: number;
  onTrack: boolean;
  advice: string;
}

export function planGoal(goal: GoalRecord, monthlySavings: number): GoalPlan {
  const remaining = Math.max(0, goal.target - goal.current);
  const monthsLeft = monthsUntilDeadline(goal.deadline);
  const monthlyNeeded = monthsLeft > 0 ? Math.round(remaining / monthsLeft) : remaining;
  const onTrack = monthlySavings >= monthlyNeeded;
  return {
    monthsLeft,
    monthlyNeeded,
    onTrack,
    advice: onTrack
      ? `No ritmo atual você conclui antes do prazo. Guardando ${formatCents(monthlyNeeded)}/mês o objetivo é atingido em ${monthsLeft} meses.`
      : `Seria necessário guardar ${formatCents(monthlyNeeded)}/mês. Sua média atual é ${formatCents(Math.max(monthlySavings, 0))}.`,
  };
}

const MONTHS = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];

export function monthsUntilDeadline(deadline: string): number {
  const parts = normalize(deadline).split(/\s+/);
  const mi = MONTHS.findIndex((m) => parts.some((p) => p.startsWith(m)));
  const year = Number(parts.find((p) => /^\d{4}$/.test(p)));
  if (mi < 0 || !year) return 12;
  const now = new Date();
  return Math.max(1, (year - now.getFullYear()) * 12 + (mi - now.getMonth()));
}

/* ── Simulador "Posso comprar?" ──────────────────────────── */

export interface PurchaseInput {
  label: string;
  price: number;
  installments: number;
  method: "avista" | "parcelado";
}

export interface PurchaseSimulation {
  verdict: "safe" | "caution" | "risky";
  title: string;
  monthly: number;
  budgetImpact: number;
  reserveImpact: number;
  wealthImpact: number;
  goalsImpact: string;
  notes: string[];
}

export function simulatePurchase(input: PurchaseInput, state: LedgerState): PurchaseSimulation {
  const a = aggregate(state);
  const months = input.method === "parcelado" ? Math.max(1, input.installments) : 1;
  const monthly = Math.round(input.price / months);
  const budgetImpact = a.income30 > 0 ? monthly / a.income30 : 1;
  const reserveAfter = input.method === "avista" ? state.reserve.current - input.price : state.reserve.current;
  const reserveImpact = state.reserve.current > 0 ? (state.reserve.current - reserveAfter) / state.reserve.current : 0;
  const wealthImpact = a.netWorth > 0 ? input.price / a.netWorth : 1;
  const savingsAfter = a.savings30 - monthly;

  const verdict: PurchaseSimulation["verdict"] =
    budgetImpact <= 0.1 && savingsAfter > 0 && reserveAfter >= state.reserve.monthlyCost * 3
      ? "safe"
      : budgetImpact <= 0.25 && savingsAfter > -a.income30 * 0.05
        ? "caution"
        : "risky";

  const notes = [
    `Compromete ${(budgetImpact * 100).toFixed(1)}% da sua renda mensal durante ${months} mês(es).`,
    input.method === "avista"
      ? `Sua reserva cairia para ${formatCents(Math.max(reserveAfter, 0))} (${(Math.max(reserveAfter, 0) / Math.max(state.reserve.monthlyCost, 1)).toFixed(1)} meses de cobertura).`
      : "A reserva de emergência permanece intacta, mas o fluxo mensal fica mais apertado.",
    savingsAfter >= 0
      ? `Ainda sobrariam ${formatCents(savingsAfter)} por mês depois da compra.`
      : `Seu mês ficaria negativo em ${formatCents(Math.abs(savingsAfter))}.`,
    `Representa ${(wealthImpact * 100).toFixed(2)}% do seu patrimônio líquido estimado.`,
  ];

  const goalsImpact = state.goals.length
    ? `Atrasaria em média ${Math.max(1, Math.round(input.price / Math.max(a.savings30, 1)))} mês(es) os seus objetivos em andamento.`
    : "Você ainda não tem objetivos cadastrados para comparar.";

  return {
    verdict,
    title:
      verdict === "safe"
        ? "Cabe no seu orçamento"
        : verdict === "caution"
          ? "Cabe, mas com atenção"
          : "Comprometeria seu equilíbrio",
    monthly,
    budgetImpact,
    reserveImpact,
    wealthImpact,
    goalsImpact,
    notes,
  };
}

/* ── Priorização de compromissos ─────────────────────────── */

export function commitmentPriorityScore(c: CommitmentRecord): number {
  const days = daysUntil(c.dueDate);
  const urgency = days < 0 ? 100 : Math.max(0, 60 - days * 2);
  const weight = { alta: 30, media: 15, baixa: 5 }[c.priority];
  const size = Math.min(25, c.amount / 100_000);
  const statusBoost = c.status === "late" ? 40 : c.status === "pending" ? 10 : 0;
  return urgency + weight + size + statusBoost;
}

export function sortCommitmentsByAi(list: CommitmentRecord[]): CommitmentRecord[] {
  return [...list].sort((a, b) => commitmentPriorityScore(b) - commitmentPriorityScore(a));
}

export function effectiveStatus(c: CommitmentRecord): CommitmentRecord["status"] {
  if (c.status === "paid" || c.status === "canceled") return c.status;
  if (daysUntil(c.dueDate) < 0) return "late";
  return c.status;
}

/* ── Calendário financeiro ───────────────────────────────── */

export interface CalendarEvent {
  id: string;
  date: string;
  label: string;
  amount: number;
  kind: "conta" | "recebimento" | "pagamento" | "meta" | "investimento";
}

export function buildCalendar(state: LedgerState): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  for (const b of state.bills) {
    events.push({ id: `b-${b.id}`, date: b.dueDate, label: b.title, amount: -b.amount, kind: "conta" });
  }
  for (const c of state.commitments) {
    if (c.status === "canceled") continue;
    events.push({
      id: `c-${c.id}`,
      date: c.dueDate,
      label: `${c.counterparty} · ${c.description || c.category}`,
      amount: c.direction === "payable" ? -c.amount : c.amount,
      kind: c.direction === "payable" ? "pagamento" : "recebimento",
    });
  }
  for (const p of state.installments) {
    const next = new Date();
    next.setDate(p.dueDay);
    if (next.getTime() < Date.now()) next.setMonth(next.getMonth() + 1);
    events.push({
      id: `p-${p.id}`,
      date: next.toISOString().slice(0, 10),
      label: `${p.title} · parcela ${p.paid + 1}/${p.count}`,
      amount: -Math.round(p.total / p.count),
      kind: "pagamento",
    });
  }
  return events.sort((a, b) => a.date.localeCompare(b.date));
}

/* ── Resumos inteligentes ────────────────────────────────── */

export type SummaryPeriod = "diario" | "semanal" | "mensal" | "anual";

export interface SmartSummary {
  period: SummaryPeriod;
  title: string;
  income: number;
  expense: number;
  balance: number;
  topCategory?: string;
  bullets: string[];
  series: Array<{ label: string; value: number }>;
}

const PERIOD_DAYS: Record<SummaryPeriod, number> = { diario: 1, semanal: 7, mensal: 30, anual: 365 };

export function buildSummary(period: SummaryPeriod, state: LedgerState): SmartSummary {
  const span = PERIOD_DAYS[period];
  const inRange = state.activity.filter((a) => daysUntil(a.date) > -span && daysUntil(a.date) <= 0);
  const income = inRange.filter((a) => a.amount > 0).reduce((s, a) => s + a.amount, 0);
  const expense = inRange.filter((a) => a.amount < 0).reduce((s, a) => s - a.amount, 0);

  const catTotals = new Map<string, number>();
  for (const a of inRange.filter((i) => i.amount < 0)) {
    catTotals.set(a.category, (catTotals.get(a.category) ?? 0) - a.amount);
  }
  const top = [...catTotals.entries()].sort((a, b) => b[1] - a[1])[0];

  const buckets = Math.min(span, 7);
  const series = Array.from({ length: buckets }, (_, i) => {
    const start = -Math.round((span / buckets) * (buckets - i));
    const end = -Math.round((span / buckets) * (buckets - i - 1));
    const slice = state.activity.filter((a) => {
      const d = daysUntil(a.date);
      return d > start && d <= end;
    });
    return {
      label: `${i + 1}`,
      value: slice.filter((a) => a.amount < 0).reduce((s, a) => s - a.amount, 0),
    };
  });

  const bullets = [
    income > expense
      ? `Você fechou o período positivo em ${formatCents(income - expense)}.`
      : `As saídas superaram as entradas em ${formatCents(expense - income)}.`,
    top ? `${top[0]} foi a maior categoria de gasto, com ${formatCents(top[1])}.` : "Sem gastos categorizados no período.",
    `Foram ${inRange.length} movimentações registradas.`,
    "Conteúdo educativo: use este resumo para ajustar o orçamento do próximo período.",
  ];

  return {
    period,
    title: { diario: "Resumo diário", semanal: "Resumo semanal", mensal: "Resumo mensal", anual: "Resumo anual" }[period],
    income,
    expense,
    balance: income - expense,
    topCategory: top?.[0],
    bullets,
    series,
  };
}

/* ── IA proativa ─────────────────────────────────────────── */

export function proactiveNotifications(state: LedgerState): string[] {
  const a = aggregate(state);
  const out: string[] = [];
  if (a.savingsRatio > 0.2) out.push("Você está economizando acima da média dos últimos meses.");
  if (a.netWorthGrowth > 0) out.push("Seu patrimônio cresceu no período analisado.");
  if (a.reserveMonths >= state.reserve.months) out.push(`Sua reserva já cobre ${a.reserveMonths.toFixed(0)} meses de despesas.`);
  const delivery = a.byCategory.find((c) => /aliment|delivery/i.test(c.label));
  if (delivery && delivery.amount > delivery.prev) out.push("Seus gastos com alimentação/delivery subiram — vale revisar.");
  if (a.lateBills > 0) out.push("Existem compromissos vencidos aguardando regularização.");
  out.push("Estas mensagens são educativas e não constituem recomendação de investimento.");
  return out;
}

/* ── Relatórios da central de compromissos ───────────────── */

export interface CommitmentReport {
  totalPayable: number;
  totalReceivable: number;
  paidInPeriod: number;
  receivedInPeriod: number;
  settled: number;
  overdue: number;
  avgSettleDays: number;
  topCounterparties: Array<{ name: string; count: number; amount: number }>;
  monthly: Array<{ label: string; payable: number; receivable: number }>;
}

export function buildCommitmentReport(list: CommitmentRecord[]): CommitmentReport {
  const open = list.filter((c) => effectiveStatus(c) !== "paid" && c.status !== "canceled");
  const paid = list.filter((c) => c.status === "paid");

  const counter = new Map<string, { count: number; amount: number }>();
  for (const c of list) {
    const cur = counter.get(c.counterparty) ?? { count: 0, amount: 0 };
    counter.set(c.counterparty, { count: cur.count + 1, amount: cur.amount + c.amount });
  }

  const monthMap = new Map<string, { payable: number; receivable: number }>();
  for (const c of list) {
    const k = monthKey(c.dueDate);
    const cur = monthMap.get(k) ?? { payable: 0, receivable: 0 };
    if (c.direction === "payable") cur.payable += c.amount;
    else cur.receivable += c.amount;
    monthMap.set(k, cur);
  }

  const settleDays = paid
    .filter((c) => c.paidAt)
    .map((c) => Math.round((new Date(c.paidAt!).getTime() - new Date(c.dueDate).getTime()) / DAY));

  return {
    totalPayable: open.filter((c) => c.direction === "payable").reduce((s, c) => s + c.amount, 0),
    totalReceivable: open.filter((c) => c.direction === "receivable").reduce((s, c) => s + c.amount, 0),
    paidInPeriod: paid.filter((c) => c.direction === "payable").reduce((s, c) => s + c.amount, 0),
    receivedInPeriod: paid.filter((c) => c.direction === "receivable").reduce((s, c) => s + c.amount, 0),
    settled: paid.length,
    overdue: open.filter((c) => effectiveStatus(c) === "late").length,
    avgSettleDays: settleDays.length ? Math.round(settleDays.reduce((s, d) => s + d, 0) / settleDays.length) : 0,
    topCounterparties: [...counter.entries()]
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5),
    monthly: [...monthMap.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([label, v]) => ({ label: label.slice(5), ...v })),
  };
}

/* ── Conciliação bancária (arquitetura futura) ───────────── */

export interface MatchSuggestion {
  commitmentId: string;
  activityId: string;
  confidence: number;
  reason: string;
}

/**
 * Prepara a integração com Open Finance: dado um extrato (movimentações),
 * sugere quais pendências podem ser marcadas como pagas/recebidas.
 * A confirmação final é sempre do usuário.
 */
export function suggestMatches(commitments: CommitmentRecord[], activity: ActivityRecord[]): MatchSuggestion[] {
  const out: MatchSuggestion[] = [];
  for (const c of commitments) {
    if (c.status === "paid" || c.status === "canceled") continue;
    for (const a of activity) {
      const sameSign = c.direction === "payable" ? a.amount < 0 : a.amount > 0;
      if (!sameSign) continue;
      const amountDiff = Math.abs(Math.abs(a.amount) - c.amount) / Math.max(c.amount, 1);
      const dayDiff = Math.abs(daysUntil(a.date) - daysUntil(c.dueDate));
      if (amountDiff > 0.02 || dayDiff > 5) continue;
      const nameHit = normalize(a.title).includes(normalize(c.counterparty).split(" ")[0]);
      out.push({
        commitmentId: c.id,
        activityId: a.id,
        confidence: Math.round((1 - amountDiff) * 60 + (nameHit ? 30 : 0) + Math.max(0, 10 - dayDiff * 2)),
        reason: `Valor e data compatíveis${nameHit ? " e beneficiário correspondente" : ""}.`,
      });
    }
  }
  return out.sort((a, b) => b.confidence - a.confidence);
}

/* ── OCR de comprovantes (heurística local) ──────────────── */

export interface OcrExtraction {
  amount?: number;
  date?: string;
  bank?: string;
  beneficiary?: string;
  document?: string;
  description?: string;
  category?: string;
}

/** Extrai dados de um texto de comprovante (colado ou lido do arquivo). */
export function extractReceiptData(text: string): OcrExtraction {
  const out: OcrExtraction = {};
  const amount = text.match(/r\$\s*([\d.]+,\d{2})/i);
  if (amount) out.amount = Math.round(parseFloat(amount[1].replace(/\./g, "").replace(",", ".")) * 100);
  const date = text.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (date) out.date = `${date[3]}-${date[2]}-${date[1]}`;
  const doc = text.match(/(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/);
  if (doc) out.document = doc[1];
  const bank = text.match(/(nubank|ita[úu]|bradesco|santander|caixa|banco do brasil|inter|c6|picpay)/i);
  if (bank) out.bank = bank[1];
  const benef = text.match(/(?:para|benefici[áa]rio|recebedor)[:\s]+([A-Za-zÀ-ÿ\s]{3,40})/i);
  if (benef) out.beneficiary = benef[1].trim();
  if (/pix/i.test(text)) out.category = "PIX";
  else if (/boleto/i.test(text)) out.category = "Boleto";
  out.description = text.slice(0, 120).replace(/\s+/g, " ").trim();
  return out;
}

/* ── util ────────────────────────────────────────────────── */

export function formatCents(cents: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}
