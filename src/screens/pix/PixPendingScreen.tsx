import { useMemo, useState } from "react";
import { CheckCircle2, Copy, Send, Smartphone } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Section } from "@/components/common/Section";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { PremiumButton } from "@/components/common/PremiumButton";
import { useCollection } from "@/providers/LedgerProvider";
import { useMoneyFormatter } from "@/hooks/useMoneyFormatter";
import { toMoney, amountTone } from "@/utils/format";
import { daysUntil, dueLabel } from "@/lib/pendings";
import { stagger } from "@/animations/motion";
import { cn } from "@/lib/utils";

type PixView = "payable" | "receivable";

/** Transferências → PIX pendentes (enviar e receber). */
export function PixPendingScreen() {
  const commitments = useCollection("commitments");
  const money = useMoneyFormatter();
  const [view, setView] = useState<PixView>("payable");
  const [copied, setCopied] = useState<string | null>(null);

  const items = useMemo(
    () =>
      commitments.items
        .filter(
          (c) => c.method === "pix" && c.status !== "paid" && c.status !== "canceled" && c.direction === view,
        )
        .sort((a, b) => daysUntil(a.dueDate) - daysUntil(b.dueDate)),
    [commitments.items, view],
  );

  const total = items.reduce((s, c) => s + c.amount, 0);

  const copyKey = async (id: string, key?: string) => {
    if (!key) return;
    try {
      await navigator.clipboard.writeText(key);
      setCopied(id);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <AppShell>
      <ScreenHeader
        eyebrow="Transferências"
        title="PIX pendentes"
        subtitle="Envios e recebimentos aguardando conclusão."
        backTo="/"
      />

      <div className="mt-5 space-y-6">
        <section className="surface-card animate-[rise_0.5s_var(--ease-premium)_both] flex items-center gap-3 p-4">
          <span className="bg-gradient-emerald grid size-11 shrink-0 place-items-center rounded-[var(--radius-lg)] text-primary-foreground">
            <Smartphone className="size-5" aria-hidden strokeWidth={1.9} />
          </span>
          <div className="min-w-0">
            <p className="text-eyebrow text-muted-foreground">
              {view === "payable" ? "Total a enviar" : "Total a receber"}
            </p>
            <p className={cn("numeric text-xl font-semibold", amountTone(view === "payable" ? -1 : 1))}>
              {money(toMoney(total))}
            </p>
          </div>
        </section>

        <SegmentedControl<PixView>
          value={view}
          onChange={setView}
          options={[
            { value: "payable", label: "Enviar" },
            { value: "receivable", label: "Receber" },
          ]}
        />

        <Section title="Pendentes">
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-[var(--radius-2xl)] border border-dashed border-border p-10 text-center">
              <CheckCircle2 className="size-7 text-success" aria-hidden />
              <p className="text-sm font-semibold text-foreground">Nenhum PIX pendente</p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {items.map((c, i) => (
                <li
                  key={c.id}
                  style={stagger(i, 50)}
                  className="surface-card card-interactive animate-[rise_0.4s_var(--ease-premium)_both] p-3.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-lg)] border border-border bg-surface text-muted-foreground transition-transform duration-200 hover:scale-110">
                      <Send className="size-4" aria-hidden strokeWidth={1.9} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-foreground">
                        {c.counterparty}
                      </span>
                      <span className="block text-[0.7rem] text-muted-foreground">
                        {dueLabel(daysUntil(c.dueDate))} · {c.category}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "numeric text-sm font-semibold",
                        amountTone(view === "payable" ? -1 : 1),
                      )}
                    >
                      {money(toMoney(c.amount))}
                    </span>
                  </div>

                  {c.pixKey && (
                    <button
                      onClick={() => void copyKey(c.id, c.pixKey)}
                      className="press mt-3 flex w-full items-center gap-2 rounded-[var(--radius-lg)] border border-dashed border-border px-3 py-2 text-left text-[0.7rem] text-muted-foreground hover:bg-accent"
                    >
                      <Copy className="size-3.5 shrink-0" aria-hidden />
                      <span className="min-w-0 flex-1 truncate">{c.pixKey}</span>
                      <span className="shrink-0 font-semibold">
                        {copied === c.id ? "Copiado" : "Copiar"}
                      </span>
                    </button>
                  )}

                  <PremiumButton
                    variant="soft"
                    size="sm"
                    block
                    className="mt-2.5"
                    onClick={() =>
                      commitments.patch(c.id, {
                        status: "paid",
                        paidAt: new Date().toISOString().slice(0, 10),
                      })
                    }
                  >
                    {view === "payable" ? "Marcar como enviado" : "Marcar como recebido"}
                  </PremiumButton>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </AppShell>
  );
}
