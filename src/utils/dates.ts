/** Date helpers shared by the editable finance widgets. */

export function daysUntil(isoDate: string): number {
  const target = new Date(`${isoDate}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export function shortDate(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function dueLabel(isoDate: string): string {
  const days = daysUntil(isoDate);
  if (days < 0) return `Atrasada ${Math.abs(days)}d`;
  if (days === 0) return "Vence hoje";
  if (days <= 3) return `Vence em ${days}d`;
  return shortDate(isoDate);
}
