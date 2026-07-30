import { useMemo, useState } from "react";
import { Activity, ChevronRight, Info, Sparkles } from "lucide-react";
import { ProgressBar, ProgressRing } from "@/components/common/Progress";
import { BottomSheet } from "@/components/common/BottomSheet";
import { AnimatedNumber } from "@/components/common/AnimatedNumber";
import { useLedger } from "@/providers/LedgerProvider";
import { BAND_META, computeHealthScore } from "@/lib/finance-intelligence";
import { stagger } from "@/animations/motion";
import { cn } from "@/lib/utils";

const toneRing: Record<string, string> = {
  success: "text-success",
  primary: "text-primary",
  warning: "text-warning",
  destructive: "text-destructive",
};

/** Indicador principal da tela inicial: Saúde Financeira 0–100. */
export function HealthScoreWidget() {
  const ledger = useLedger();
  const [open, setOpen] = useState(false);
  const health = useMemo(() => computeHealthScore(ledger), [ledger]);
  const meta = BAND_META[health.band];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="surface-card card-interactive press animate-[rise_0.5s_var(--ease-premium)_both] w-full overflow-hidden p-5 text-left"
      >
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <ProgressRing value={health.score} size={96} stroke={9}>
              <div className="text-center">
                <AnimatedNumber
                  value={health.score}
                  format={(v) => String(Math.round(v))}
                  className={cn("block text-2xl font-semibold leading-none", toneRing[meta.tone])}
                />
                <span className="mt-0.5 block text-[0.6rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  / 100
                </span>
              </div>
            </ProgressRing>
            <span className="animate-ring absolute inset-0 rounded-full" aria-hidden />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <Activity className="size-3.5" aria-hidden strokeWidth={2.2} />
              Saúde financeira
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-lg font-semibold text-foreground">
              <span aria-hidden>{meta.emoji}</span> {meta.label}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{health.headline}</p>
          </div>

          <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        </div>

        {health.highlights.length > 0 && (
          <div className="mt-4 space-y-2 border-t border-border pt-3">
            {health.highlights.slice(0, 2).map((h, i) => (
              <p
                key={h}
                style={stagger(i, 80)}
                className="animate-[fade_0.4s_var(--ease-premium)_both] flex items-start gap-2 text-xs text-foreground"
              >
                <Sparkles className="mt-0.5 size-3 shrink-0 text-primary" aria-hidden strokeWidth={2.2} />
                {h}
              </p>
            ))}
          </div>
        )}
      </button>

      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title={`Saúde financeira: ${health.score}/100`}
        description="Como cada fator influencia sua pontuação e o que fazer para melhorar."
      >
        <div className="space-y-3 pb-4">
          {health.factors.map((f, i) => (
            <div
              key={f.id}
              style={stagger(i, 55)}
              className="animate-[rise_0.45s_var(--ease-premium)_both] rounded-[var(--radius-xl)] border border-border bg-surface p-3.5"
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{f.label}</p>
                <span className="numeric text-sm font-semibold text-foreground">{Math.round(f.score)}</span>
              </div>
              <ProgressBar
                className="mt-2"
                value={f.score}
                tone={f.score >= 70 ? "success" : f.score >= 45 ? "primary" : "warning"}
                hint={`peso ${Math.round(f.weight * 100)}%`}
              />
              <p className="mt-2 text-xs text-muted-foreground">{f.detail}</p>
              <p className="mt-1.5 flex items-start gap-1.5 text-xs text-foreground">
                <Info className="mt-0.5 size-3 shrink-0 text-primary" aria-hidden strokeWidth={2.2} />
                {f.advice}
              </p>
            </div>
          ))}
          <p className="pt-1 text-[0.7rem] leading-relaxed text-muted-foreground">
            Conteúdo educativo gerado a partir dos seus próprios dados. Não constitui recomendação de
            investimento.
          </p>
        </div>
      </BottomSheet>
    </>
  );
}
