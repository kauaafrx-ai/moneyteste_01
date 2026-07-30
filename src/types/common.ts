/**
 * Shared primitive types used across models, repositories and UI.
 */
export type UUID = string;
/** ISO-8601 string. Dates are never stored as Date objects in the domain layer. */
export type ISODate = string;

/** Money is stored in minor units (cents) to avoid float drift. */
export interface Money {
  amount: number;
  currency: string;
}

export type CurrencyCode = "BRL" | "USD" | "EUR";

export interface Timestamps {
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface Entity extends Timestamps {
  id: UUID;
}

export type SortDirection = "asc" | "desc";

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface QueryOptions<TFilter = unknown> {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
  filter?: TFilter;
}

export interface DateRange {
  from: ISODate;
  to: ISODate;
}

export type AsyncState = "idle" | "loading" | "success" | "error";

export interface Result<T, E = AppError> {
  ok: boolean;
  data?: T;
  error?: E;
}

export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
