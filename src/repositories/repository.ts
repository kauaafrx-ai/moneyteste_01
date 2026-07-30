import type { Page, QueryOptions, UUID } from "@/types/common";

/**
 * Repository contracts. The UI never talks to a data source directly — it
 * goes through controllers/services which depend on these interfaces.
 * Swapping the persistence layer therefore requires zero UI changes.
 */
export interface ReadRepository<T, TFilter = unknown> {
  list(options?: QueryOptions<TFilter>): Promise<Page<T>>;
  getById(id: UUID): Promise<T | null>;
}

export interface WriteRepository<T> {
  create(input: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
  update(id: UUID, input: Partial<T>): Promise<T>;
  remove(id: UUID): Promise<void>;
}

export type Repository<T, TFilter = unknown> = ReadRepository<T, TFilter> & WriteRepository<T>;

export class NotImplementedRepositoryError extends Error {
  constructor(name: string) {
    super(`Repository "${name}" ainda não possui implementação nesta etapa da arquitetura.`);
    this.name = "NotImplementedRepositoryError";
  }
}
