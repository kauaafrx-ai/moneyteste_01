import { useMemo } from "react";
import { ArrowDownRight, ArrowUpRight, Sparkles, TriangleAlert } from "lucide-react";
import { useLedger } from "@/providers/LedgerProvider";
import { buildFeed } from "@/lib/finance-intelligence";
import { stagger } from "@/animations/motion";
import { cn } from "@/lib/utils";

const toneStyles = {
  positive: { chip: "bg-accent text-accent-foreground", icon: ArrowUpRight },
  neutral: { chip: "bg-muted text-muted-foreground", icon: Sparkles },
  alert: { chip: "bg-destructive/10 text-destructive", icon: TriangleAlert },
} as const;

/** Feed inteligente — insights no formato de rede social. */
export function SmartFeedWidget({ limit = 5 }: { limit?: number }) {
  const ledger = useLedger();
  const feed = useMemo(() => buildFeed(ledger).slice(0, limit), [ledger, limit]);

  return (
    <div className="space-y-3">
      {feed.map((item, i) => {
        const tone = toneStyles[item.tone];
        const Icon = tone.icon;
        return (
          <article
            key={item.id}
            style={stagger(i, 70)}
            className="surface-card card-interactive animate-[rise_0.5s_var(--ease-premium)_both] flex gap-3 p-4"
          >
            <span className={cn("grid size-9 shrink-0 place-items-center rounded-[var(--radius-lg)]", tone.chip)}>
              <Icon className="size-4" aria-hidden strokeWidth={2.1} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                {item.metric && (
                  <span
                    className={cn(
                      "numeric shrink-0 text-xs font-semibold",
                      item.tone === "positive"
                        ? "text-success"
                        : item.tone === "alert"
                          ? "text-destructive"
                          : "text-muted-foreground",
                    )}
                  >
                    {item.metric}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          </article>
        );
      })}
      {feed.length === 0 && (
        <p className="rounded-[var(--radius-xl)] border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
          <ArrowDownRight className="mx-auto mb-1 size-4" aria-hidden /> Registre movimentações para o feed
          começar a gerar insights.
        </p>
      )}
    </div>
  );
}
