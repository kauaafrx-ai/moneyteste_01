import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlarmClock,
  BellRing,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  Handshake,
  Repeat,
  Smartphone,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { BottomSheet } from "@/components/common/BottomSheet";
import { PremiumButton } from "@/components/common/PremiumButton";
import { useLedger } from "@/providers/LedgerProvider";
import { usePreferences } from "@/providers/PreferencesProvider";
import { useMoneyFormatter } from "@/hooks/useMoneyFormatter";
import { toMoney, amountTone } from "@/utils/format";
import { buildPendings, dueLabel, PENDING_GROUPS, type PendingKind } from "@/lib/pendings";
import { stagger } from "@/animations/motion";
import { cn } from "@/lib/utils";

const ICONS: Record<PendingKind, LucideIcon> = {
  bill: Zap,
  payable: Handshake,
  receivable: Handshake,
  pix: Smartphone,
  installment: CreditCard,
  subscription: Repeat,
  goal: Target,
};

const SEVERITY_RING: Record<string, string> = {
  late: "border-destructive/40 bg-destructive/10 text-destructive",
  today: "border-warning/40 bg-warning/10 text-foreground",
  soon: "border-border bg-accent text-accent-foreground",
  info: "border-border bg-surface text-muted-foreground",
};

/** Intelligent pendency center behind the header bell. */
export function NotificationCenter({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { bills, commitments, subscriptions, installments, goals } = useLedger();
  const { settings, pushPermission, requestPushPermission } = usePreferences();
  const money = useMoneyFormatter();
  const [group, setGroup] = useState<PendingKind | "all">("all");

  const pendings = useMemo(
    () => buildPendings({ bills, commitments, subscriptions, installments, goals }),
    [bills, commitments, subscriptions, installments, goals],
  );

  const filtered = group === "all" ? pendings : pendings.filter((p) => p.kind === group);
  const lateCount = pendings.filter((p) => p.severity === "late").length;
  const totalDue = pendings
    .filter((p) => p.signedAmount < 0 && p.daysLeft <= 30)
    .reduce((s, p) => s + p.amount, 0);

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Central de pendências"
      description={
        lateCount > 0
          ? `${lateCount} item(ns) em atraso · ${money(toMoney(totalDue))} nos próximos 30 dias`
          : `Tudo em dia · ${money(toMoney(totalDue))} nos próximos 30 dias`
      }
      footer={
        <div className="flex gap-2 pb-2">
          <PremiumButton variant="outline" block onClick={() => onOpenChange(false)}>
            Fechar
          </PremiumButton>
          <Link to="/pagar" className="flex-1" onClick={() => onOpenChange(false)}>
            <PremiumButton block>Ver tudo a pagar</PremiumButton>
          </Link>
        </div>
      }
    >
      <div className="space-y-4 pb-2">
        {!settings.pushEnabled && pushPermission !== "unsupported" && (
          <button
            onClick={() => void requestPushPermission()}
            className="press animate-[rise_0.4s_var(--ease-premium)_both] flex w-full items-center gap-3 rounded-[var(--radius-xl)] border border-primary/30 bg-accent p-3 text-left"
          >
            <span className="bg-gradient-emerald grid size-9 shrink-0 place-items-center rounded-full text-primary-foreground">
              <BellRing className="size-4" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-foreground">
                Ativar notificações no celular
              </span>
              <span className="block text-[0.7rem] text-muted-foreground">
                Receba alertas de vencimentos mesmo com o app fechado.
              </span>
            </span>
          </button>
        )}

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {PENDING_GROUPS.map((g, i) => {
            const count = g.id === "all" ? pendings.length : pendings.filter((p) => p.kind === g.id).length;
            return (
              <button
                key={g.id}
                style={stagger(i, 30)}
                onClick={() => setGroup(g.id)}
                className={cn(
                  "press animate-[fade_0.3s_var(--ease-premium)_both] flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.7rem] font-semibold transition-colors",
                  group === g.id
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border bg-card text-muted-foreground",
                )}
              >
                {g.label}
                <span className="numeric opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-[var(--radius-2xl)] border border-dashed border-border p-8 text-center">
            <CheckCircle2 className="size-6 text-success" aria-hidden />
            <p className="text-sm font-semibold text-foreground">Nenhuma pendência aqui</p>
            <p className="text-xs text-muted-foreground">Você está em dia nesta categoria.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {filtered.map((item, i) => {
              const Icon = ICONS[item.kind];
              return (
                <li
                  key={item.id}
                  style={stagger(i, 45)}
                  className="surface-card card-interactive animate-[rise_0.4s_var(--ease-premium)_both] flex items-center gap-3 p-3.5"
                >
                  <span
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-[var(--radius-lg)] border transition-transform hover:scale-105",
                      SEVERITY_RING[item.severity],
                    )}
                  >
                    <Icon className="size-4" aria-hidden strokeWidth={1.9} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-foreground">
                      {item.title}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-[0.7rem] text-muted-foreground">
                      {item.dueDate ? (
                        <>
                          {item.severity === "late" ? (
                            <AlarmClock className="size-3 text-destructive" aria-hidden />
                          ) : (
                            <CalendarClock className="size-3" aria-hidden />
                          )}
                          {dueLabel(item.daysLeft)} · {item.detail}
                        </>
                      ) : (
                        item.detail
                      )}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "numeric shrink-0 text-sm font-semibold",
                      amountTone(item.signedAmount),
                    )}
                  >
                    {money(toMoney(item.amount))}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        <Link
          to="/configuracoes"
          onClick={() => onOpenChange(false)}
          className="press flex w-full items-center justify-center gap-2 rounded-[var(--radius-xl)] border border-dashed border-border p-3 text-xs font-semibold text-muted-foreground hover:bg-accent"
        >
          <BellRing className="size-3.5" aria-hidden /> Gerenciar notificações
        </Link>
      </div>
    </BottomSheet>
  );
}
