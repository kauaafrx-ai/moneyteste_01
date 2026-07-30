import { useMemo, useState } from "react";
import { CircleCheck, CircleSlash, ShieldQuestion, TriangleAlert } from "lucide-react";
import { BottomSheet } from "@/components/common/BottomSheet";
import { PremiumButton } from "@/components/common/PremiumButton";
import { Field, MoneyInput, SelectInput, TextInput } from "@/components/common/FormControls";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { useLedger } from "@/providers/LedgerProvider";
import { simulatePurchase, type PurchaseSimulation } from "@/lib/finance-intelligence";
import { useMoneyFormatter } from "@/hooks/useMoneyFormatter";
import { toMoney } from "@/utils/format";
import { stagger } from "@/animations/motion";
import { cn } from "@/lib/utils";

const VERDICT = {
  safe: { label: "Pode comprar", icon: CircleCheck, box: "border-success/40 bg-success/10 text-success" },
  caution: { label: "Compre com cautela", icon: TriangleAlert, box: "border-warning/40 bg-warning/10 text-warning-foreground" },
  risky: { label: "Melhor adiar", icon: CircleSlash, box: "border-destructive/40 bg-destructive/10 text-destructive" },
} as const;

/** Simulador "Posso comprar isso?" com projeção de impacto real. */
export function CanIBuySheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const ledger = useLedger();
  const money = useMoneyFormatter();
  const [label, setLabel] = useState("");
  const [price, setPrice] = useState(0);
  const [method, setMethod] = useState<"avista" | "parcelado">("avista");
  const [installments, setInstallments] = useState(12);
  const [result, setResult] = useState<PurchaseSimulation | null>(null);

  const preview = useMemo(
    () => (price > 0 ? simulatePurchase({ label, price, installments, method }, ledger) : null),
    [label, price, installments, method, ledger],
  );

  const shown = result ?? null;
  const verdict = shown ? VERDICT[shown.verdict] : null;
  const VIcon = verdict?.icon ?? ShieldQuestion;

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Posso comprar isso?"
      description="A IA cruza renda, reserva, metas e compromissos antes de responder."
      footer={
        <div className="flex gap-2 pb-2">
          <PremiumButton variant="outline" block onClick={() => onOpenChange(false)}>
            Fechar
          </PremiumButton>
          <PremiumButton block disabled={!preview} onClick={() => setResult(preview)}>
            Simular impacto
          </PremiumButton>
        </div>
      }
    >
      <div className="space-y-4 pb-2">
        <Field label="O que você quer comprar?">
          <TextInput
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Ex.: notebook novo"
          />
        </Field>

        <Field label="Valor total">
          <MoneyInput cents={price} onChangeCents={setPrice} />
        </Field>

        <SegmentedControl
          value={method}
          onChange={(v) => setMethod(v)}
          options={[
            { value: "avista", label: "À vista" },
            { value: "parcelado", label: "Parcelado" },
          ]}
        />

        {method === "parcelado" && (
          <Field label="Número de parcelas" className="animate-[rise_0.35s_var(--ease-premium)_both]">
            <SelectInput
              value={String(installments)}
              onChange={(e) => setInstallments(Number(e.target.value))}
            >
              {[2, 3, 4, 6, 10, 12, 18, 24, 36, 48].map((n) => (
                <option key={n} value={n}>
                  {n}x de {money(toMoney(Math.round(price / n)))}
                </option>
              ))}
            </SelectInput>
          </Field>
        )}

        {shown && verdict && (
          <div className="animate-[rise_0.45s_var(--ease-premium)_both] space-y-3">
            <div className={cn("flex items-center gap-3 rounded-[var(--radius-2xl)] border p-4", verdict.box)}>
              <VIcon className="size-6 shrink-0" aria-hidden strokeWidth={2.1} />
              <div>
                <p className="text-sm font-semibold">{verdict.label}</p>
                <p className="text-xs opacity-90">{shown.title}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { k: "Parcela mensal", v: money(toMoney(shown.monthly)) },
                { k: "Da sua renda", v: `${(shown.budgetImpact * 100).toFixed(1)}%` },
                { k: "Da reserva", v: `${(shown.reserveImpact * 100).toFixed(1)}%` },
                { k: "Do patrimônio", v: `${(shown.wealthImpact * 100).toFixed(1)}%` },
              ].map((m, i) => (
                <div
                  key={m.k}
                  style={stagger(i, 50)}
                  className="surface-card animate-[fade_0.4s_var(--ease-premium)_both] p-3"
                >
                  <p className="text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">{m.k}</p>
                  <p className="numeric mt-1 text-base font-semibold text-foreground">{m.v}</p>
                </div>
              ))}
            </div>

            <div className="surface-card space-y-2 p-3.5">
              {shown.notes.map((n) => (
                <p key={n} className="text-xs leading-relaxed text-muted-foreground">
                  • {n}
                </p>
              ))}
              <p className="pt-1 text-xs font-medium text-foreground">{shown.goalsImpact}</p>
            </div>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
