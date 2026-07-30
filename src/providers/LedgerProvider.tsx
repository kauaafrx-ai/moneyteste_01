/**
 * Editable, browser-persisted ledger.
 * Every user-editable entity of the app lives here so any screen can
 * create / update / delete records. Amounts are stored in cents.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "ledger.v1";

export interface CategoryRecord {
  id: string;
  label: string;
  amount: number;
  icon: string;
  colorVar: string;
}

export interface SubscriptionRecord {
  id: string;
  name: string;
  brand: string;
  amount: number;
  dueDay: number;
  cycle: "mensal" | "anual";
}

export interface BillRecord {
  id: string;
  title: string;
  amount: number;
  dueDate: string; // yyyy-mm-dd
  icon: string;
  status: "pending" | "due" | "late" | "paid";
}

export interface ActivityRecord {
  id: string;
  title: string;
  category: string;
  amount: number; // signed
  date: string; // yyyy-mm-dd
  icon: string;
  kind: "income" | "expense";
}

export interface GoalRecord {
  id: string;
  title: string;
  current: number;
  target: number;
  icon: string;
  deadline: string;
}

export interface InstallmentRecord {
  id: string;
  title: string;
  bank: string;
  network: string;
  total: number;
  count: number;
  paid: number;
  dueDay: number;
  firstDue: string; // yyyy-mm-dd
}

export interface ReceiptRecord {
  id: string;
  title: string;
  folder: string;
  fileName: string;
  mimeType: string;
  dataUrl: string;
  createdAt: string;
  amount?: number;
}

export interface AssetRecord {
  id: string;
  label: string;
  amount: number;
  icon: string;
  colorVar: string;
}

/* ── Central de Compromissos Financeiros ─────────────────── */

export type CommitmentDirection = "payable" | "receivable";
export type CommitmentStatus = "paid" | "pending" | "scheduled" | "awaiting" | "late" | "canceled";
export type CommitmentPriority = "alta" | "media" | "baixa";
export type CommitmentMethod = "pix" | "boleto" | "cartao" | "dinheiro" | "transferencia";
export type CommitmentRecurrence = "none" | "weekly" | "biweekly" | "monthly" | "yearly";

export interface CommitmentRecord {
  id: string;
  direction: CommitmentDirection;
  counterparty: string;
  amount: number;
  category: string;
  description?: string;
  dueDate: string; // yyyy-mm-dd
  priority: CommitmentPriority;
  method: CommitmentMethod;
  bank?: string;
  pixKey?: string;
  barcode?: string;
  status: CommitmentStatus;
  notes?: string;
  receiptId?: string;
  recurrence: CommitmentRecurrence;
  groupId?: string;
  installmentIndex?: number;
  installmentCount?: number;
  paidAt?: string;
  contact?: string;
}

export interface LedgerState {
  categories: CategoryRecord[];
  subscriptions: SubscriptionRecord[];
  bills: BillRecord[];
  activity: ActivityRecord[];
  goals: GoalRecord[];
  installments: InstallmentRecord[];
  receipts: ReceiptRecord[];
  folders: string[];
  assets: AssetRecord[];
  commitments: CommitmentRecord[];
  reserve: { current: number; monthlyCost: number; months: number };
}


const today = new Date();
const iso = (offsetDays: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

const SEED: LedgerState = {
  categories: [
    { id: "moradia", label: "Moradia", amount: 248_000, icon: "home", colorVar: "var(--chart-1)" },
    { id: "alimentacao", label: "Alimentação", amount: 164_300, icon: "utensils", colorVar: "var(--chart-2)" },
    { id: "transporte", label: "Transporte", amount: 98_400, icon: "car", colorVar: "var(--chart-3)" },
    { id: "lazer", label: "Lazer", amount: 82_600, icon: "music", colorVar: "var(--chart-4)" },
    { id: "compras", label: "Compras", amount: 142_880, icon: "bag", colorVar: "var(--chart-5)" },
  ],
  subscriptions: [
    { id: "s1", name: "Netflix", brand: "netflix", amount: 4_490, dueDay: 12, cycle: "mensal" },
    { id: "s2", name: "Spotify", brand: "spotify", amount: 2_190, dueDay: 5, cycle: "mensal" },
    { id: "s3", name: "Academia", brand: "academia", amount: 12_900, dueDay: 8, cycle: "mensal" },
  ],
  bills: [
    { id: "b1", title: "Aluguel", amount: 320_000, dueDate: iso(2), icon: "building", status: "due" },
    { id: "b2", title: "Energia elétrica", amount: 28_640, dueDate: iso(5), icon: "zap", status: "pending" },
    { id: "b3", title: "Internet fibra", amount: 14_990, dueDate: iso(8), icon: "wifi", status: "pending" },
    { id: "b4", title: "Seguro do carro", amount: 96_400, dueDate: iso(12), icon: "car", status: "pending" },
  ],
  activity: [
    { id: "a1", title: "Salário", category: "Receita fixa", amount: 1_180_000, date: iso(0), icon: "bank", kind: "income" },
    { id: "a2", title: "Mercado", category: "Alimentação", amount: -48_720, date: iso(0), icon: "cart", kind: "expense" },
    { id: "a3", title: "Uber", category: "Transporte", amount: -3_240, date: iso(-1), icon: "car", kind: "expense" },
    { id: "a4", title: "Café", category: "Alimentação", amount: -2_190, date: iso(-1), icon: "coffee", kind: "expense" },
    { id: "a5", title: "Academia", category: "Saúde", amount: -18_900, date: iso(-6), icon: "dumbbell", kind: "expense" },
  ],
  goals: [
    { id: "g1", title: "Viagem para Portugal", current: 1_840_000, target: 2_800_000, icon: "plane", deadline: "Dez 2026" },
    { id: "g2", title: "Entrada do apartamento", current: 6_200_000, target: 12_000_000, icon: "home", deadline: "Mar 2028" },
    { id: "g3", title: "Trocar de carro", current: 940_000, target: 4_500_000, icon: "car", deadline: "Set 2027" },
  ],
  installments: [
    { id: "p1", title: "Notebook", bank: "nubank", network: "mastercard", total: 720_000, count: 12, paid: 4, dueDay: 10, firstDue: iso(-90) },
    { id: "p2", title: "Passagem aérea", bank: "itau", network: "visa", total: 412_000, count: 6, paid: 2, dueDay: 15, firstDue: iso(-45) },
  ],
  receipts: [],
  folders: ["Comprovantes", "Notas fiscais", "Garantias", "Extratos"],
  assets: [
    { id: "rf", label: "Renda fixa", amount: 9_820_000, icon: "bank", colorVar: "var(--chart-2)" },
    { id: "rv", label: "Renda variável", amount: 6_140_000, icon: "building", colorVar: "var(--chart-1)" },
    { id: "fii", label: "Fundos imobiliários", amount: 3_560_000, icon: "home", colorVar: "var(--chart-3)" },
    { id: "int", label: "Internacional", amount: 2_120_900, icon: "plane", colorVar: "var(--chart-4)" },
  ],
  commitments: [
    {
      id: "c1", direction: "payable", counterparty: "Lucas Almeida", amount: 32_000, category: "Empréstimo",
      description: "PIX emprestado no fim de semana", dueDate: iso(3), priority: "media", method: "pix",
      bank: "nubank", pixKey: "lucas.almeida@email.com", status: "pending", recurrence: "none",
    },
    {
      id: "c2", direction: "payable", counterparty: "Condomínio Vista Verde", amount: 74_500, category: "Moradia",
      description: "Taxa condominial", dueDate: iso(-2), priority: "alta", method: "boleto",
      bank: "itau", barcode: "34191.79001 01043.510047 91020.150008 5 91230000074500",
      status: "pending", recurrence: "monthly",
    },
    {
      id: "c3", direction: "payable", counterparty: "Faculdade Horizonte", amount: 128_000, category: "Educação",
      description: "Mensalidade", dueDate: iso(9), priority: "alta", method: "boleto", status: "scheduled",
      recurrence: "monthly",
    },
    {
      id: "c4", direction: "receivable", counterparty: "Marina Costa", amount: 18_500, category: "Divisão de despesas",
      description: "Parte do jantar de aniversário", dueDate: iso(1), priority: "baixa", method: "pix",
      status: "awaiting", recurrence: "none", contact: "5511999990000",
    },
    {
      id: "c5", direction: "receivable", counterparty: "Studio Vega", amount: 240_000, category: "Reembolso",
      description: "Reembolso de viagem corporativa", dueDate: iso(12), priority: "media", method: "transferencia",
      status: "awaiting", recurrence: "none",
    },
  ],
  reserve: { current: 3_120_000, monthlyCost: 800_000, months: 6 },

};

export const uid = () => Math.random().toString(36).slice(2, 10);

interface LedgerContextValue extends LedgerState {
  update: (patch: Partial<LedgerState>) => void;
  set: <K extends keyof LedgerState>(key: K, value: LedgerState[K]) => void;
  reset: () => void;
  hydrated: boolean;
}

const LedgerContext = createContext<LedgerContextValue | null>(null);

export function LedgerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LedgerState>(SEED);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...SEED, ...(JSON.parse(raw) as LedgerState) });
    } catch {
      /* ignore corrupted storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota exceeded — keep working in memory */
    }
  }, [state, hydrated]);

  const update = useCallback((patch: Partial<LedgerState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const set = useCallback(
    <K extends keyof LedgerState>(key: K, value: LedgerState[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const reset = useCallback(() => setState(SEED), []);

  const value = useMemo(
    () => ({ ...state, update, set, reset, hydrated }),
    [state, update, set, reset, hydrated],
  );

  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>;
}

export function useLedger() {
  const ctx = useContext(LedgerContext);
  if (!ctx) throw new Error("useLedger must be used inside <LedgerProvider>");
  return ctx;
}

/** Generic CRUD helper for a list field of the ledger. */
export function useCollection<K extends keyof LedgerState>(key: K) {
  const ledger = useLedger();
  const items = ledger[key] as LedgerState[K] & Array<{ id: string }>;

  const add = useCallback(
    (item: unknown) => ledger.set(key, [...(items as unknown[]), item] as LedgerState[K]),
    [ledger, key, items],
  );
  const patch = useCallback(
    (id: string, changes: object) =>
      ledger.set(
        key,
        (items as Array<{ id: string }>).map((i) =>
          i.id === id ? { ...i, ...changes } : i,
        ) as LedgerState[K],
      ),
    [ledger, key, items],
  );
  const remove = useCallback(
    (id: string) =>
      ledger.set(
        key,
        (items as Array<{ id: string }>).filter((i) => i.id !== id) as LedgerState[K],
      ),
    [ledger, key, items],
  );

  return { items, add, patch, remove };
}
