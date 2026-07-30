import type { Entity, ISODate, Money, UUID } from "@/types/common";

/* ── Identity ───────────────────────────────────────────── */

export interface User extends Entity {
  name: string;
  email: string;
  avatarUrl?: string;
  locale: string;
  currency: string;
  onboardedAt?: ISODate;
}

/* ── Accounts & categories ──────────────────────────────── */

export type AccountKind = "checking" | "savings" | "credit_card" | "cash" | "brokerage" | "wallet";

export interface Account extends Entity {
  userId: UUID;
  name: string;
  kind: AccountKind;
  institution?: string;
  balance: Money;
  archived: boolean;
}

export type CategoryKind = "income" | "expense";

export interface Category extends Entity {
  userId: UUID;
  name: string;
  kind: CategoryKind;
  /** lucide-react icon name */
  icon: string;
  /** design-system token name, never a raw hex */
  colorToken: string;
  parentId?: UUID;
  budgetLimit?: Money;
}

/* ── Cash flow ──────────────────────────────────────────── */

export type TransactionKind = "income" | "expense" | "transfer";
export type TransactionStatus = "pending" | "cleared" | "scheduled" | "canceled";

export interface Transaction extends Entity {
  userId: UUID;
  accountId: UUID;
  categoryId?: UUID;
  kind: TransactionKind;
  status: TransactionStatus;
  description: string;
  amount: Money;
  occurredAt: ISODate;
  notes?: string;
  tags: string[];
  attachmentIds: UUID[];
  installmentId?: UUID;
  subscriptionId?: UUID;
}

export type RecurrenceInterval = "weekly" | "monthly" | "quarterly" | "yearly";

export interface Subscription extends Entity {
  userId: UUID;
  name: string;
  merchant?: string;
  amount: Money;
  interval: RecurrenceInterval;
  nextChargeAt: ISODate;
  categoryId?: UUID;
  active: boolean;
}

export interface Installment extends Entity {
  userId: UUID;
  description: string;
  totalAmount: Money;
  installmentCount: number;
  paidCount: number;
  firstDueAt: ISODate;
  categoryId?: UUID;
  accountId?: UUID;
}

/* ── Wealth ─────────────────────────────────────────────── */

export type InvestmentClass =
  | "fixed_income"
  | "equities"
  | "funds"
  | "real_estate"
  | "crypto"
  | "pension"
  | "other";

export interface Investment extends Entity {
  userId: UUID;
  name: string;
  assetClass: InvestmentClass;
  invested: Money;
  currentValue: Money;
  institution?: string;
  maturityAt?: ISODate;
}

export interface EmergencyReserve extends Entity {
  userId: UUID;
  targetMonths: number;
  monthlyBaseline: Money;
  currentValue: Money;
}

export type GoalStatus = "active" | "paused" | "achieved";

export interface Goal extends Entity {
  userId: UUID;
  title: string;
  targetAmount: Money;
  savedAmount: Money;
  dueAt?: ISODate;
  status: GoalStatus;
  icon: string;
  colorToken: string;
}

/* ── Cofre Digital ──────────────────────────────────────── */

export type DocumentKind =
  | "receipt"
  | "invoice"
  | "warranty"
  | "statement"
  | "contract"
  | "tax"
  | "other";

export type DocumentMime = "application/pdf" | "image/jpeg" | "image/png" | "image/heic";

export interface VaultFolder extends Entity {
  userId: UUID;
  name: string;
  parentId?: UUID;
  icon: string;
  colorToken: string;
  documentCount: number;
}

export interface VaultDocument extends Entity {
  userId: UUID;
  folderId?: UUID;
  title: string;
  kind: DocumentKind;
  mimeType: DocumentMime;
  sizeBytes: number;
  storagePath: string;
  thumbnailPath?: string;
  issuedAt?: ISODate;
  amount?: Money;
  tags: string[];
  favorite: boolean;
  linkedTransactionId?: UUID;
  /** Populated by the future OCR pipeline. */
  ocr?: DocumentOcrResult;
}

export type OcrStatus = "not_started" | "queued" | "processing" | "done" | "failed";

export interface DocumentOcrResult {
  status: OcrStatus;
  processedAt?: ISODate;
  rawText?: string;
  confidence?: number;
  extracted?: {
    merchant?: string;
    total?: Money;
    issuedAt?: ISODate;
    documentNumber?: string;
  };
}

/* ── AI ─────────────────────────────────────────────────── */

export type ChatRole = "user" | "assistant" | "system";

export interface AiMessage extends Entity {
  conversationId: UUID;
  role: ChatRole;
  content: string;
  attachmentIds: UUID[];
  /** Rich blocks (charts, tables, action cards) rendered by the UI layer. */
  blocks?: AiResponseBlock[];
}

export type AiResponseBlock =
  | { type: "text"; text: string }
  | { type: "metric"; label: string; value: string; trend?: number }
  | { type: "chart"; chart: "line" | "bar" | "donut"; series: Array<{ label: string; value: number }> }
  | { type: "list"; items: string[] }
  | { type: "action"; label: string; actionId: string };

export interface AiConversation extends Entity {
  userId: UUID;
  title: string;
  lastMessageAt: ISODate;
  messageCount: number;
  pinned: boolean;
}

/* ── Settings & security ────────────────────────────────── */

export interface AppSettings extends Entity {
  userId: UUID;
  themeMode: "light" | "dark" | "system";
  hideBalances: boolean;
  notifications: {
    bills: boolean;
    goals: boolean;
    insights: boolean;
    security: boolean;
  };
  security: {
    biometricEnabled: boolean;
    pinEnabled: boolean;
    autoLockMinutes: number;
  };
  backup: {
    autoBackup: boolean;
    lastBackupAt?: ISODate;
  };
}
