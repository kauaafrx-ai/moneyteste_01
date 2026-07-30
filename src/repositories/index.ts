import type {
  Account,
  AiConversation,
  AiMessage,
  AppSettings,
  Category,
  EmergencyReserve,
  Goal,
  Installment,
  Investment,
  Subscription,
  Transaction,
  VaultDocument,
  VaultFolder,
} from "@/models";
import type { DateRange, UUID } from "@/types/common";
import type { Repository } from "./repository";

export type { Repository, ReadRepository, WriteRepository } from "./repository";
export { NotImplementedRepositoryError } from "./repository";

export interface TransactionFilter {
  kind?: Transaction["kind"];
  status?: Transaction["status"];
  categoryIds?: UUID[];
  accountIds?: UUID[];
  range?: DateRange;
  tags?: string[];
}

export interface DocumentFilter {
  folderId?: UUID;
  kind?: VaultDocument["kind"];
  favorite?: boolean;
  tags?: string[];
  range?: DateRange;
}

/**
 * The single dependency surface consumed by services/controllers.
 * Implementations are injected by the data provider.
 */
export interface RepositoryRegistry {
  accounts: Repository<Account>;
  categories: Repository<Category>;
  transactions: Repository<Transaction, TransactionFilter>;
  subscriptions: Repository<Subscription>;
  installments: Repository<Installment>;
  goals: Repository<Goal>;
  reserve: Repository<EmergencyReserve>;
  investments: Repository<Investment>;
  vaultFolders: Repository<VaultFolder>;
  vaultDocuments: Repository<VaultDocument, DocumentFilter>;
  aiConversations: Repository<AiConversation>;
  aiMessages: Repository<AiMessage>;
  settings: Repository<AppSettings>;
}
