/**
 * Service layer contracts — orchestration boundaries between the UI and
 * the data/infra layers. Implementations arrive in later stages.
 */
import type { AiResponseBlock, VaultDocument } from "@/models";
import type { DateRange, Money, UUID } from "@/types/common";

export interface AnalyticsService {
  cashflowSummary(range: DateRange): Promise<{
    income: Money;
    expense: Money;
    balance: Money;
    savingsRate: number;
  }>;
  categoryBreakdown(range: DateRange): Promise<Array<{ categoryId: UUID; total: Money }>>;
  netWorthSeries(range: DateRange): Promise<Array<{ date: string; value: Money }>>;
}

export interface StorageService {
  upload(file: File, path: string): Promise<{ storagePath: string }>;
  getSignedUrl(storagePath: string, expiresInSeconds?: number): Promise<string>;
  remove(storagePath: string): Promise<void>;
}

export interface OcrService {
  enqueue(documentId: UUID): Promise<void>;
  extract(document: VaultDocument): Promise<VaultDocument["ocr"]>;
}

export interface AiService {
  sendMessage(input: {
    conversationId?: UUID;
    content: string;
    attachmentIds?: UUID[];
  }): Promise<{ conversationId: UUID; blocks: AiResponseBlock[] }>;
  suggestions(): Promise<string[]>;
}

export interface AuthService {
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  unlockWithBiometrics(): Promise<boolean>;
  unlockWithPin(pin: string): Promise<boolean>;
}

export interface BackupService {
  export(format: "json" | "csv"): Promise<Blob>;
  import(file: File): Promise<{ imported: number }>;
}

export interface ServiceRegistry {
  analytics: AnalyticsService;
  storage: StorageService;
  ocr: OcrService;
  ai: AiService;
  auth: AuthService;
  backup: BackupService;
}
