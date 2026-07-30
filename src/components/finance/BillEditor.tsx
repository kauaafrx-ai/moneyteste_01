import { useEffect, useState } from "react";
import { EditorSheet } from "./EditorSheet";
import { Field, MoneyInput, SelectInput, TextInput } from "@/components/common/FormControls";
import { IconPicker } from "@/components/common/IconPicker";
import { uid, type BillRecord } from "@/providers/LedgerProvider";

const empty = (): BillRecord => ({
  id: uid(),
  title: "",
  amount: 0,
  dueDate: new Date().toISOString().slice(0, 10),
  icon: "receipt",
  status: "pending",
});

const PRESETS = [
  { title: "Aluguel", icon: "building" },
  { title: "Condomínio", icon: "home" },
  { title: "Energia elétrica", icon: "zap" },
  { title: "Água", icon: "plug" },
  { title: "Internet", icon: "wifi" },
  { title: "Celular", icon: "phone" },
  { title: "Cartão de crédito", icon: "card" },
  { title: "Seguro do carro", icon: "car" },
  { title: "Escola", icon: "graduation" },
  { title: "Plano de saúde", icon: "health" },
];

export function BillEditor({
  open,
  onOpenChange,
  initial,
  onSave,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: BillRecord | null;
  onSave: (bill: BillRecord) => void;
  onDelete?: (id: string) => void;
}) {
  const [draft, setDraft] = useState<BillRecord>(initial ?? empty());

  useEffect(() => {
    if (open) setDraft(initial ? { ...initial } : empty());
  }, [open, initial]);

  return (
    <EditorSheet
      open={open}
      onOpenChange={onOpenChange}
      title={initial ? "Editar conta" : "Nova conta"}
      description="Defina nome, valor e vencimento."
      onSave={() => {
        if (!draft.title.trim()) return;
        onSave(draft);
        onOpenChange(false);
      }}
      onDelete={initial && onDelete ? () => { onDelete(initial.id); onOpenChange(false); } : undefined}
    >
      {!initial && (
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.title}
              type="button"
              onClick={() => setDraft((d) => ({ ...d, title: p.title, icon: p.icon }))}
              className="press rounded-full border border-border bg-card px-2.5 py-1 text-[0.7rem] font-medium text-muted-foreground hover:bg-accent"
            >
              {p.title}
            </button>
          ))}
        </div>
      )}

      <Field label="Nome da conta">
        <TextInput
          value={draft.title}
          placeholder="Ex.: Aluguel"
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
      </Field>

      <Field label="Valor">
        <MoneyInput cents={draft.amount} onChangeCents={(amount) => setDraft({ ...draft, amount })} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Vencimento">
          <TextInput
            type="date"
            value={draft.dueDate}
            onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
          />
        </Field>
        <Field label="Situação">
          <SelectInput
            value={draft.status}
            onChange={(e) => setDraft({ ...draft, status: e.target.value as BillRecord["status"] })}
          >
            <option value="pending">Em aberto</option>
            <option value="due">Vence em breve</option>
            <option value="late">Atrasada</option>
            <option value="paid">Paga</option>
          </SelectInput>
        </Field>
      </div>

      <Field label="Ícone">
        <IconPicker value={draft.icon} onChange={(icon) => setDraft({ ...draft, icon })} />
      </Field>
    </EditorSheet>
  );
}
