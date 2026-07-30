import { APP } from "@/constants/app";
import type { ISODate, Money } from "@/types/common";

/** Formatting helpers — pure, side-effect free, UI-agnostic. */

export const toMoney = (amount: number, currency: string = APP.currency): Money => ({
  amount,
  currency,
});

export function formatMoney(
  value: Money,
  options: { compact?: boolean; hidden?: boolean; signed?: boolean } = {},
): string {
  if (options.hidden) return "••••••";
  const units = value.amount / 100;
  const formatted = new Intl.NumberFormat(APP.locale, {
    style: "currency",
    currency: value.currency,
    notation: options.compact ? "compact" : "standard",
    maximumFractionDigits: options.compact ? 1 : 2,
  }).format(Math.abs(units));
  if (!options.signed) return units < 0 ? `-${formatted}` : formatted;
  return `${units < 0 ? "−" : "+"}${formatted}`;
}

export function formatPercent(ratio: number, fractionDigits = 1): string {
  return new Intl.NumberFormat(APP.locale, {
    style: "percent",
    maximumFractionDigits: fractionDigits,
  }).format(ratio);
}

export function formatDate(date: ISODate, style: "short" | "long" | "month" = "short"): string {
  const d = new Date(date);
  if (style === "month") {
    return new Intl.DateTimeFormat(APP.locale, { month: "long", year: "numeric" }).format(d);
  }
  return new Intl.DateTimeFormat(APP.locale, {
    day: "2-digit",
    month: style === "long" ? "long" : "2-digit",
    year: "numeric",
  }).format(d);
}

export function formatBytes(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let value = bytes;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
