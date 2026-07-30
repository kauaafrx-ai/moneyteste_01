import { useEffect, useState } from "react";
import { EditorSheet } from "./EditorSheet";
import { Field, MoneyInput, SelectInput, TextInput } from "@/components/common/FormControls";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { uid, type CommitmentRecord } from "@/providers/LedgerProvider";

const empty = (): CommitmentRecord => ({
  id: uid(),
  direction: "payable",
  counterparty: "",
  amount: 0,
  category: "Geral",
  dueDate: new Date().toISOString().slice(0, 10),
  priority: "media",
  method: "pix",
  status: "pending",
  recurrence: "none",
});

/** Cadastro completo de um compromisso a pagar ou a receber. */
export function CommitmentEditor({
  open,
  onOpenChange,
  initial,
  defaultDirection = "payable",
  onSave,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: CommitmentRecord | null;
  defaultDirection?: CommitmentRecord["direction"];
  onSave: (record: CommitmentRecord) => void;
  onDelete?: (id: string) => void;
}) {
  const [draft, setDraft] = useState<CommitmentRecord>(initial ?? empty());

  useEffect(() => {
    if (open) setDraft(initial ? { ...initial } : { ...empty(), direction: defaultDirection });
  }, [open, initial, defaultDirection]);

  const set = <K extends keyof CommitmentRecord>(key: K, value: CommitmentRecord[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const payable = draft.direction === "payable";

  return (
    <EditorSheet
      open={open}
      onOpenChange={onOpenChange}
      title={initial ? "Editar compromisso" : payable ? "Novo pagamento" : "Novo recebimento"}
      description="Quem, quanto, quando e como — tudo em um único cadastro."
      onSave={() => {
        if (!draft.counterparty.trim() || draft.amount <= 0) return;
        onSave(draft);
        onOpenChange(false);
      }}
      onDelete={
        initial && onDelete
          ? () => {
              onDelete(initial.id);
              onOpenChange(false);
            }
          : undefined
      }
    >
      <SegmentedControl
        value={draft.direction}
        onChange={(v) => set("direction", v)}
        options={[
          { value: "payable", label: "Tenho que pagar" },
          { value: "receivable", label: "Tenho que receber" },
        ]}
      />

      <Field label={payable ? "Para quem" : "De quem"}>
        <TextInput
          value={draft.counterparty}
          onChange={(e) => set("counterparty", e.target.value)}
          placeholder={payable ? "Ex.: Banco Alfa" : "Ex.: Cliente Beta"}
        />
      </Field>

      <Field label="Valor">
        <MoneyInput cents={draft.amount} onChangeCents={(c) => set("amount", c)} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Vencimento">
          <TextInput type="date" value={draft.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
        </Field>
        <Field label="Categoria">
          <SelectInput value={draft.category} onChange={(e) => set("category", e.target.value)}>
            {["Geral", "Empréstimo", "Moradia", "Educação", "Saúde", "Serviços", "Trabalho", "Família", "Impostos"].map(
              (c) => (
                <option key={c}>{c}</option>
              ),
            )}
          </SelectInput>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Prioridade">
          <SelectInput
            value={draft.priority}
            onChange={(e) => set("priority", e.target.value as CommitmentRecord["priority"])}
          >
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </SelectInput>
        </Field>
        <Field label="Forma de pagamento">
          <SelectInput
            value={draft.method}
            onChange={(e) => set("method", e.target.value as CommitmentRecord["method"])}
          >
            <option value="pix">Pix</option>
            <option value="boleto">Boleto</option>
            <option value="cartao">Cartão</option>
            <option value="transferencia">Transferência</option>
            <option value="dinheiro">Dinheiro</option>
          </SelectInput>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Status">
          <SelectInput
            value={draft.status}
            onChange={(e) => set("status", e.target.value as CommitmentRecord["status"])}
          >
            <option value="pending">Pendente</option>
            <option value="scheduled">Agendado</option>
            <option value="awaiting">Aguardando</option>
            <option value="paid">{payable ? "Pago" : "Recebido"}</option>
            <option value="canceled">Cancelado</option>
          </SelectInput>
        </Field>
        <Field label="Recorrência">
          <SelectInput
            value={draft.recurrence}
            onChange={(e) => set("recurrence", e.target.value as CommitmentRecord["recurrence"])}
          >
            <option value="none">Não repete</option>
            <option value="weekly">Semanal</option>
            <option value="biweekly">Quinzenal</option>
            <option value="monthly">Mensal</option>
            <option value="yearly">Anual</option>
          </SelectInput>
        </Field>
      </div>

      <Field label="Banco / chave Pix" hint="Opcional — facilita o pagamento na hora certa.">
        <TextInput
          value={draft.pixKey ?? ""}
          onChange={(e) => set("pixKey", e.target.value)}
          placeholder="Ex.: financeiro@empresa.com"
        />
      </Field>

      <Field label="Observações">
        <TextInput
          value={draft.notes ?? ""}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Detalhes, acordo, contato…"
        />
      </Field>
    </EditorSheet>
  );
}
