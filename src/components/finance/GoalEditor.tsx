import { useEffect, useState } from "react";
import { EditorSheet } from "./EditorSheet";
import { Field, MoneyInput, TextInput } from "@/components/common/FormControls";
import { IconPicker } from "@/components/common/IconPicker";
import { uid, type GoalRecord } from "@/providers/LedgerProvider";

const empty = (): GoalRecord => ({
  id: uid(),
  title: "",
  current: 0,
  target: 0,
  icon: "piggy",
  deadline: "",
});

export function GoalEditor({
  open,
  onOpenChange,
  initial,
  onSave,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: GoalRecord | null;
  onSave: (goal: GoalRecord) => void;
  onDelete?: (id: string) => void;
}) {
  const [draft, setDraft] = useState<GoalRecord>(initial ?? empty());

  useEffect(() => {
    if (open) setDraft(initial ? { ...initial } : empty());
  }, [open, initial]);

  return (
    <EditorSheet
      open={open}
      onOpenChange={onOpenChange}
      title={initial ? "Editar meta" : "Nova meta"}
      description="Ajuste o valor guardado, o objetivo e o prazo."
      onSave={() => {
        if (!draft.title.trim()) return;
        onSave({ ...draft, target: Math.max(draft.target, 1) });
        onOpenChange(false);
      }}
      onDelete={initial && onDelete ? () => { onDelete(initial.id); onOpenChange(false); } : undefined}
    >
      <Field label="Nome da meta">
        <TextInput
          value={draft.title}
          placeholder="Ex.: Viagem para Portugal"
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Já guardado">
          <MoneyInput cents={draft.current} onChangeCents={(current) => setDraft({ ...draft, current })} />
        </Field>
        <Field label="Objetivo">
          <MoneyInput cents={draft.target} onChangeCents={(target) => setDraft({ ...draft, target })} />
        </Field>
      </div>

      <Field label="Prazo" hint="Texto livre, ex.: Dez 2026">
        <TextInput
          value={draft.deadline}
          placeholder="Dez 2026"
          onChange={(e) => setDraft({ ...draft, deadline: e.target.value })}
        />
      </Field>

      <Field label="Ícone">
        <IconPicker value={draft.icon} onChange={(icon) => setDraft({ ...draft, icon })} />
      </Field>
    </EditorSheet>
  );
}
