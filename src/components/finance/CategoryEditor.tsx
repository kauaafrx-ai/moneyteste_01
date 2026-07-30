import { useEffect, useState } from "react";
import { EditorSheet } from "./EditorSheet";
import { Field, MoneyInput, SelectInput, TextInput } from "@/components/common/FormControls";
import { IconPicker } from "@/components/common/IconPicker";
import { BrandTile } from "@/components/common/BrandTile";
import { BRANDS, findBrand } from "@/data/icon-registry";
import { uid, type CategoryRecord, type SubscriptionRecord } from "@/providers/LedgerProvider";
import { cn } from "@/lib/utils";

/* -- Category ------------------------------------------------------------- */

const emptyCategory = (): CategoryRecord => ({
  id: uid(),
  label: "",
  amount: 0,
  icon: "bag",
  colorVar: "var(--chart-1)",
});

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export function CategoryEditor({
  open,
  onOpenChange,
  initial,
  onSave,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: CategoryRecord | null;
  onSave: (item: CategoryRecord) => void;
  onDelete?: (id: string) => void;
}) {
  const [draft, setDraft] = useState<CategoryRecord>(initial ?? emptyCategory());

  useEffect(() => {
    if (open) setDraft(initial ? { ...initial } : emptyCategory());
  }, [open, initial]);

  return (
    <EditorSheet
      open={open}
      onOpenChange={onOpenChange}
      title={initial ? "Editar categoria" : "Nova categoria"}
      description="Nome, orçamento do mês, cor e ícone."
      onSave={() => {
        if (!draft.label.trim()) return;
        onSave(draft);
        onOpenChange(false);
      }}
      onDelete={initial && onDelete ? () => { onDelete(initial.id); onOpenChange(false); } : undefined}
    >
      <Field label="Nome">
        <TextInput
          value={draft.label}
          placeholder="Ex.: Alimentação"
          onChange={(e) => setDraft({ ...draft, label: e.target.value })}
        />
      </Field>

      <Field label="Valor do mês">
        <MoneyInput cents={draft.amount} onChangeCents={(amount) => setDraft({ ...draft, amount })} />
      </Field>

      <Field label="Cor">
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Cor ${c}`}
              onClick={() => setDraft({ ...draft, colorVar: c })}
              className={cn(
                "size-8 rounded-full border-2 transition-transform",
                draft.colorVar === c ? "border-foreground scale-110" : "border-transparent",
              )}
              style={{ background: c }}
            />
          ))}
        </div>
      </Field>

      <Field label="Ícone">
        <IconPicker value={draft.icon} onChange={(icon) => setDraft({ ...draft, icon })} />
      </Field>
    </EditorSheet>
  );
}

/* -- Subscription ---------------------------------------------------------- */

const emptySubscription = (): SubscriptionRecord => ({
  id: uid(),
  name: "",
  brand: "custom",
  amount: 0,
  dueDay: 1,
  cycle: "mensal",
});

export function SubscriptionEditor({
  open,
  onOpenChange,
  initial,
  onSave,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: SubscriptionRecord | null;
  onSave: (item: SubscriptionRecord) => void;
  onDelete?: (id: string) => void;
}) {
  const [draft, setDraft] = useState<SubscriptionRecord>(initial ?? emptySubscription());

  useEffect(() => {
    if (open) setDraft(initial ? { ...initial } : emptySubscription());
  }, [open, initial]);

  return (
    <EditorSheet
      open={open}
      onOpenChange={onOpenChange}
      title={initial ? "Editar assinatura" : "Nova assinatura"}
      description="Escolha o serviço ou crie um personalizado com o +."
      onSave={() => {
        if (!draft.name.trim()) return;
        onSave(draft);
        onOpenChange(false);
      }}
      onDelete={initial && onDelete ? () => { onDelete(initial.id); onOpenChange(false); } : undefined}
    >
      <Field label="Serviço">
        <div className="grid grid-cols-5 gap-2">
          {BRANDS.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() =>
                setDraft((d) => ({
                  ...d,
                  brand: b.id,
                  name: b.id === "custom" ? d.name : b.name,
                }))
              }
              className={cn(
                "press flex flex-col items-center gap-1 rounded-[var(--radius-lg)] border p-1.5 transition-colors",
                draft.brand === b.id ? "border-primary bg-accent" : "border-border bg-card",
              )}
            >
              <BrandTile brand={b} size="sm" />
              <span className="w-full truncate text-center text-[0.55rem] text-muted-foreground">
                {b.name}
              </span>
            </button>
          ))}
        </div>
      </Field>

      <Field label="Nome exibido">
        <TextInput
          value={draft.name}
          placeholder={findBrand(draft.brand).name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        />
      </Field>

      <Field label="Valor">
        <MoneyInput cents={draft.amount} onChangeCents={(amount) => setDraft({ ...draft, amount })} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Dia da cobrança">
          <TextInput
            type="number"
            min={1}
            max={31}
            value={draft.dueDay}
            onChange={(e) => setDraft({ ...draft, dueDay: Number(e.target.value) || 1 })}
          />
        </Field>
        <Field label="Ciclo">
          <SelectInput
            value={draft.cycle}
            onChange={(e) => setDraft({ ...draft, cycle: e.target.value as SubscriptionRecord["cycle"] })}
          >
            <option value="mensal">Mensal</option>
            <option value="anual">Anual</option>
          </SelectInput>
        </Field>
      </div>
    </EditorSheet>
  );
}
