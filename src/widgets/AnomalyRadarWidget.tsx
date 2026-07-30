import { useMemo } from "react";
import { CopyCheck, Radar, Repeat2, ShieldAlert, TrendingUp, Zap } from "lucide-react";
import { useLedger } from "@/providers/LedgerProvider";
import { detectAnomalies, type Anomaly } from "@/lib/finance-intelligence";
import { stagger } from "@/animations/motion";
import { cn } from "@/lib/utils";

const kindIcon = {
  categoria: TrendingUp,
  recorrencia: Repeat2,
  duplicidade: CopyCheck,
  impulso: Zap,
  assinatura: ShieldAlert,
} as const;

const severityStyle: Record<Anomaly["severity"], string> = {
  alta: "bg-destructive/10 text-destructive ring-destructive/20",
  media: "bg-warning/15 text-warning-foreground ring-warning/25",
  baixa: "bg-muted text-muted-foreground ring-border",
};

/** Radar de gastos anormais — análise contínua do comportamento. */
export function AnomalyRadarWidget({ limit = 4 }: { limit?: number }) {
  const ledger = useLedger();
  const anomalies = useMemo(() => detectAnomalies(ledger).slice(0, limit), [ledger, limit]);

  if (anomalies.length === 0) {
    return (
      <div className="surface-card flex items-center gap-3 p-4">
        <span className="grid size-9 place-items-center rounded-[var(--radius-lg)] bg-accent text-accent-foreground">
          <Radar className="size-4" aria-hidden strokeWidth={2} />
        </span>
        <p className="text-xs text-muted-foreground">
          Nenhum comportamento fora do padrão detectado neste período.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {anomalies.map((a, i) => {
        const Icon = kindIcon[a.kind];
        return (
          <div
            key={a.id}
            style={stagger(i, 65)}
            className="surface-card card-interactive animate-[rise_0.5s_var(--ease-premium)_both] flex gap-3 p-3.5"
          >
            <span
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-[var(--radius-lg)] ring-1",
                severityStyle[a.severity],
              )}
            >
              <Icon className="size-4" aria-hidden strokeWidth={2.1} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{a.title}</p>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider ring-1",
                    severityStyle[a.severity],
                  )}
                >
                  {a.severity}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{a.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
