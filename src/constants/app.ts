/**
 * Global application constants. No business logic — configuration only.
 */
export const APP = {
  name: "Aurum",
  tagline: "Sua vida financeira, com clareza absoluta.",
  description:
    "Aurum é o app financeiro premium para controlar receitas, despesas, patrimônio, documentos e decisões com inteligência.",
  locale: "pt-BR",
  currency: "BRL",
  version: "0.1.0",
} as const;

export const QUERY_KEYS = {
  accounts: ["accounts"] as const,
  transactions: ["transactions"] as const,
  categories: ["categories"] as const,
  subscriptions: ["subscriptions"] as const,
  installments: ["installments"] as const,
  goals: ["goals"] as const,
  reserve: ["reserve"] as const,
  investments: ["investments"] as const,
  documents: ["documents"] as const,
  vaultFolders: ["vault-folders"] as const,
  aiConversations: ["ai-conversations"] as const,
  settings: ["settings"] as const,
} as const;

export const PAGINATION = {
  defaultPageSize: 25,
  maxPageSize: 100,
} as const;

export const CACHE = {
  /** Short-lived, frequently mutated data. */
  volatileMs: 30_000,
  /** Reference data (categories, settings). */
  referenceMs: 5 * 60_000,
} as const;
