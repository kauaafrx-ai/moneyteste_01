/**
 * DATABASE ARCHITECTURE (design-time only — no runtime implementation yet).
 *
 * The domain is persistence-agnostic: repositories talk to this schema
 * description, so the same models can be backed by a local store today and
 * a hosted Postgres (Lovable Cloud) tomorrow with zero domain changes.
 *
 * Conventions:
 *  - snake_case tables and columns
 *  - every table has id (uuid), created_at, updated_at
 *  - every user-scoped table has user_id and is protected by row-level security
 *  - money is stored as integer minor units + currency code
 */

export type ColumnType =
  | "uuid"
  | "text"
  | "integer"
  | "bigint"
  | "boolean"
  | "timestamptz"
  | "jsonb"
  | "enum";

export interface ColumnSpec {
  type: ColumnType;
  nullable?: boolean;
  unique?: boolean;
  references?: `${string}.${string}`;
  enumValues?: readonly string[];
  comment?: string;
}

export interface TableSpec {
  name: string;
  userScoped: boolean;
  columns: Record<string, ColumnSpec>;
  indexes?: string[][];
}

const base: Record<string, ColumnSpec> = {
  id: { type: "uuid" },
  created_at: { type: "timestamptz" },
  updated_at: { type: "timestamptz" },
};

const userRef: ColumnSpec = { type: "uuid", references: "users.id" };
const money = (prefix: string): Record<string, ColumnSpec> => ({
  [`${prefix}_amount`]: { type: "bigint", comment: "minor units" },
  [`${prefix}_currency`]: { type: "text" },
});

export const SCHEMA: TableSpec[] = [
  {
    name: "users",
    userScoped: false,
    columns: {
      ...base,
      email: { type: "text", unique: true },
      name: { type: "text" },
      avatar_url: { type: "text", nullable: true },
      locale: { type: "text" },
      currency: { type: "text" },
      onboarded_at: { type: "timestamptz", nullable: true },
    },
  },
  {
    name: "accounts",
    userScoped: true,
    columns: {
      ...base,
      user_id: userRef,
      name: { type: "text" },
      kind: {
        type: "enum",
        enumValues: ["checking", "savings", "credit_card", "cash", "brokerage", "wallet"],
      },
      institution: { type: "text", nullable: true },
      ...money("balance"),
      archived: { type: "boolean" },
    },
    indexes: [["user_id"]],
  },
  {
    name: "categories",
    userScoped: true,
    columns: {
      ...base,
      user_id: userRef,
      name: { type: "text" },
      kind: { type: "enum", enumValues: ["income", "expense"] },
      icon: { type: "text" },
      color_token: { type: "text" },
      parent_id: { type: "uuid", nullable: true, references: "categories.id" },
      ...money("budget_limit"),
    },
    indexes: [["user_id", "kind"]],
  },
  {
    name: "transactions",
    userScoped: true,
    columns: {
      ...base,
      user_id: userRef,
      account_id: { type: "uuid", references: "accounts.id" },
      category_id: { type: "uuid", nullable: true, references: "categories.id" },
      kind: { type: "enum", enumValues: ["income", "expense", "transfer"] },
      status: { type: "enum", enumValues: ["pending", "cleared", "scheduled", "canceled"] },
      description: { type: "text" },
      ...money("value"),
      occurred_at: { type: "timestamptz" },
      notes: { type: "text", nullable: true },
      tags: { type: "jsonb" },
      installment_id: { type: "uuid", nullable: true, references: "installments.id" },
      subscription_id: { type: "uuid", nullable: true, references: "subscriptions.id" },
    },
    indexes: [["user_id", "occurred_at"], ["user_id", "category_id"], ["user_id", "status"]],
  },
  {
    name: "subscriptions",
    userScoped: true,
    columns: {
      ...base,
      user_id: userRef,
      name: { type: "text" },
      merchant: { type: "text", nullable: true },
      ...money("value"),
      interval: { type: "enum", enumValues: ["weekly", "monthly", "quarterly", "yearly"] },
      next_charge_at: { type: "timestamptz" },
      category_id: { type: "uuid", nullable: true, references: "categories.id" },
      active: { type: "boolean" },
    },
    indexes: [["user_id", "next_charge_at"]],
  },
  {
    name: "installments",
    userScoped: true,
    columns: {
      ...base,
      user_id: userRef,
      description: { type: "text" },
      ...money("total"),
      installment_count: { type: "integer" },
      paid_count: { type: "integer" },
      first_due_at: { type: "timestamptz" },
      category_id: { type: "uuid", nullable: true, references: "categories.id" },
      account_id: { type: "uuid", nullable: true, references: "accounts.id" },
    },
    indexes: [["user_id"]],
  },
  {
    name: "goals",
    userScoped: true,
    columns: {
      ...base,
      user_id: userRef,
      title: { type: "text" },
      ...money("target"),
      ...money("saved"),
      due_at: { type: "timestamptz", nullable: true },
      status: { type: "enum", enumValues: ["active", "paused", "achieved"] },
      icon: { type: "text" },
      color_token: { type: "text" },
    },
    indexes: [["user_id", "status"]],
  },
  {
    name: "emergency_reserves",
    userScoped: true,
    columns: {
      ...base,
      user_id: userRef,
      target_months: { type: "integer" },
      ...money("monthly_baseline"),
      ...money("current"),
    },
  },
  {
    name: "investments",
    userScoped: true,
    columns: {
      ...base,
      user_id: userRef,
      name: { type: "text" },
      asset_class: {
        type: "enum",
        enumValues: ["fixed_income", "equities", "funds", "real_estate", "crypto", "pension", "other"],
      },
      ...money("invested"),
      ...money("current"),
      institution: { type: "text", nullable: true },
      maturity_at: { type: "timestamptz", nullable: true },
    },
    indexes: [["user_id", "asset_class"]],
  },
  {
    name: "vault_folders",
    userScoped: true,
    columns: {
      ...base,
      user_id: userRef,
      name: { type: "text" },
      parent_id: { type: "uuid", nullable: true, references: "vault_folders.id" },
      icon: { type: "text" },
      color_token: { type: "text" },
    },
    indexes: [["user_id", "parent_id"]],
  },
  {
    name: "vault_documents",
    userScoped: true,
    columns: {
      ...base,
      user_id: userRef,
      folder_id: { type: "uuid", nullable: true, references: "vault_folders.id" },
      title: { type: "text" },
      kind: {
        type: "enum",
        enumValues: ["receipt", "invoice", "warranty", "statement", "contract", "tax", "other"],
      },
      mime_type: { type: "text" },
      size_bytes: { type: "bigint" },
      storage_path: { type: "text" },
      thumbnail_path: { type: "text", nullable: true },
      issued_at: { type: "timestamptz", nullable: true },
      ...money("value"),
      tags: { type: "jsonb" },
      favorite: { type: "boolean" },
      linked_transaction_id: { type: "uuid", nullable: true, references: "transactions.id" },
      ocr: { type: "jsonb", nullable: true, comment: "DocumentOcrResult — filled by OCR pipeline" },
    },
    indexes: [["user_id", "folder_id"], ["user_id", "favorite"], ["user_id", "kind"]],
  },
  {
    name: "ai_conversations",
    userScoped: true,
    columns: {
      ...base,
      user_id: userRef,
      title: { type: "text" },
      last_message_at: { type: "timestamptz" },
      pinned: { type: "boolean" },
    },
    indexes: [["user_id", "last_message_at"]],
  },
  {
    name: "ai_messages",
    userScoped: true,
    columns: {
      ...base,
      user_id: userRef,
      conversation_id: { type: "uuid", references: "ai_conversations.id" },
      role: { type: "enum", enumValues: ["user", "assistant", "system"] },
      content: { type: "text" },
      blocks: { type: "jsonb", nullable: true },
    },
    indexes: [["conversation_id", "created_at"]],
  },
  {
    name: "app_settings",
    userScoped: true,
    columns: {
      ...base,
      user_id: userRef,
      theme_mode: { type: "enum", enumValues: ["light", "dark", "system"] },
      hide_balances: { type: "boolean" },
      notifications: { type: "jsonb" },
      security: { type: "jsonb" },
      backup: { type: "jsonb" },
    },
  },
];

export const TABLE_NAMES = SCHEMA.map((t) => t.name);
