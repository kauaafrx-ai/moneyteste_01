import { useEffect, useState } from "react";
import { EditorSheet } from "./EditorSheet";
import { Field, MoneyInput, SelectInput, TextInput } from "@/components/common/FormControls";
import { BrandTile } from "@/components/common/BrandTile";
import { BANKS, CARD_NETWORKS } from "@/data/icon-registry";
import { uid, type InstallmentRecord } from "@/providers/LedgerProvider";
import { cn } from "@/lib/utils";

const empty = (): InstallmentRecord => ({
  id: uid(),
  title: "",
  bank: "nubank",
  network: "mastercard",
  total: 0,
  count: 12,
  paid: 0,
  dueDay: 10,
  firstDue: new Date().toISOString().slice(0, 10),
});

export function InstallmentEditor({
  open,
  onOpenChange,
  initial,
  onSave,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: InstallmentRecord | null;
  onSave: (item: InstallmentRecord) => void;
  onDelete?: (id: string) => void;
}) {
  const [draft, setDraft] = useState<InstallmentRecord>(initial ?? empty());

  useEffect(() => {
    if (open) setDraft(initial ? { ...initial } : empty());
  }, [open, initial]);

  return (
    <EditorSheet
      open={open}
      onOpenChange={onOpenChange}
      title={initial ? "Editar parcelamento" : "Nova compra parcelada"}
      description="Cartão, banco, número de parcelas e vencimento."
      onSave={() => {
        if (!draft.title.trim()) return;
        onSave({ ...draft, count: Math.max(1, draft.count), paid: Math.min(draft.paid, draft.count) });
        onOpenChange(false);
      }}
      onDelete={initial && onDelete ? () => { onDelete(initial.id); onOpenChange(false); } : undefined}
    >
      <Field label="Descrição">
        <TextInput
          value={draft.title}
          placeholder="Ex.: Notebook"
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
      </Field>

      <Field label="Bandeira do cartão">
        <div className="flex flex-wrap gap-2">
          {CARD_NETWORKS.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => setDraft({ ...draft, network: n.id })}
              className={cn(
                "press flex items-center gap-1.5 rounded-full border px-2 py-1 text-[0.7rem] font-medium",
                draft.network === n.id ? "border-primary bg-accent" : "border-border bg-card text-muted-foreground",
              )}
            >
              <BrandTile brand={n} size="sm" />
              {n.name}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Banco / emissor">
        <div className="flex flex-wrap gap-2">
          {BANKS.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setDraft({ ...draft, bank: b.id })}
              className={cn(
                "press flex items-center gap-1.5 rounded-full border px-2 py-1 text-[0.7rem] font-medium",
                draft.bank === b.id ? "border-primary bg-accent" : "border-border bg-card text-muted-foreground",
              )}
            >
              <BrandTile brand={b} size="sm" />
              {b.name}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Valor total da compra">
        <MoneyInput cents={draft.total} onChangeCents={(total) => setDraft({ ...draft, total })} />
      </Field>

      <div className="grid grid-cols-3 gap-3">
        <Field label="Parcelas">
          <TextInput
            type="number"
            min={1}
            max={72}
            value={draft.count}
            onChange={(e) => setDraft({ ...draft, count: Number(e.target.value) || 1 })}
          />
        </Field>
        <Field label="Pagas">
          <TextInput
            type="number"
            min={0}
            max={draft.count}
            value={draft.paid}
            onChange={(e) => setDraft({ ...draft, paid: Number(e.target.value) || 0 })}
          />
        </Field>
        <Field label="Dia">
          <TextInput
            type="number"
            min={1}
            max={31}
            value={draft.dueDay}
            onChange={(e) => setDraft({ ...draft, dueDay: Number(e.target.value) || 1 })}
          />
        </Field>
      </div>

      <Field label="Primeira parcela">
        <TextInput
          type="date"
          value={draft.firstDue}
          onChange={(e) => setDraft({ ...draft, firstDue: e.target.value })}
        />
      </Field>

      <div className="rounded-[var(--radius-lg)] bg-muted p-3 text-xs text-muted-foreground">
        O vínculo automático com bancos chega na próxima fase. Por enquanto o registro é manual.
      </div>
    </EditorSheet>
  );
}
