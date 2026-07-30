import { useEffect, useState } from "react";
import { EditorSheet } from "./EditorSheet";
import { Field, MoneyInput, SelectInput, TextInput } from "@/components/common/FormControls";
import { IconPicker } from "@/components/common/IconPicker";
import { uid, type ActivityRecord } from "@/providers/LedgerProvider";
import { cn } from "@/lib/utils";

const empty = (): ActivityRecord => ({
  id: uid(),
  title: "",
  category: "Outros",
  amount: 0,
  date: new Date().toISOString().slice(0, 10),
  icon: "receipt",
  kind: "expense",
});

const EXPENSE_PRESETS = [
  { title: "Mercado", category: "Alimentação", icon: "cart" },
  { title: "Restaurante", category: "Alimentação", icon: "utensils" },
  { title: "Café", category: "Alimentação", icon: "coffee" },
  { title: "Uber", category: "Transporte", icon: "car" },
  { title: "Combustível", category: "Transporte", icon: "bus" },
  { title: "Farmácia", category: "Saúde", icon: "health" },
  { title: "Academia", category: "Saúde", icon: "dumbbell" },
  { title: "Roupas", category: "Compras", icon: "shirt" },
  { title: "Streaming", category: "Lazer", icon: "tv" },
  { title: "Aluguel", category: "Moradia", icon: "home" },
  { title: "Energia", category: "Moradia", icon: "zap" },
  { title: "Internet", category: "Moradia", icon: "wifi" },
  { title: "Pet", category: "Pet", icon: "pet" },
  { title: "Presente", category: "Outros", icon: "gift" },
];

const INCOME_PRESETS = [
  { title: "Salário", category: "Receita fixa", icon: "bank" },
  { title: "Freela", category: "Receita variável", icon: "work" },
  { title: "Dividendos", category: "Investimentos", icon: "piggy" },
  { title: "Venda", category: "Receita variável", icon: "banknote" },
  { title: "Reembolso", category: "Outros", icon: "wallet" },
  { title: "Presente recebido", category: "Outros", icon: "gift" },
];

export function ActivityEditor({
  open,
  onOpenChange,
  initial,
  onSave,
  onDelete,
  categories = [],
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: ActivityRecord | null;
  onSave: (item: ActivityRecord) => void;
  onDelete?: (id: string) => void;
  categories?: string[];
}) {
  const [draft, setDraft] = useState<ActivityRecord>(initial ?? empty());

  useEffect(() => {
    if (open) setDraft(initial ? { ...initial } : empty());
  }, [open, initial]);

  const presets = draft.kind === "income" ? INCOME_PRESETS : EXPENSE_PRESETS;
  const options = Array.from(
    new Set([...categories, ...presets.map((p) => p.category), draft.category, "Outros"]),
  ).filter(Boolean);

  return (
    <EditorSheet
      open={open}
      onOpenChange={onOpenChange}
      title={initial ? "Editar lançamento" : "Novo lançamento"}
      description="Escolha um atalho ou personalize nome e valor."
      onSave={() => {
        if (!draft.title.trim()) return;
        const magnitude = Math.abs(draft.amount);
        onSave({ ...draft, amount: draft.kind === "income" ? magnitude : -magnitude });
        onOpenChange(false);
      }}
      onDelete={initial && onDelete ? () => { onDelete(initial.id); onOpenChange(false); } : undefined}
    >
      <div className="grid grid-cols-2 gap-2">
        {(["expense", "income"] as const).map((kind) => (
          <button
            key={kind}
            type="button"
            onClick={() => setDraft({ ...draft, kind })}
            className={cn(
              "press h-10 rounded-[var(--radius-lg)] border text-xs font-semibold transition-colors",
              draft.kind === kind
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            {kind === "expense" ? "Saída" : "Entrada"}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button
            key={p.title}
            type="button"
            onClick={() =>
              setDraft((d) => ({ ...d, title: p.title, category: p.category, icon: p.icon }))
            }
            className={cn(
              "press rounded-full border px-2.5 py-1 text-[0.7rem] font-medium transition-colors",
              draft.title === p.title
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-accent",
            )}
          >
            {p.title}
          </button>
        ))}
      </div>

      <Field label="Descrição" hint="Você pode escrever qualquer nome personalizado.">
        <TextInput
          value={draft.title}
          placeholder="Ex.: Mercado Aurora"
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
      </Field>

      <Field label="Valor">
        <MoneyInput
          cents={Math.abs(draft.amount)}
          onChangeCents={(amount) => setDraft({ ...draft, amount })}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Categoria">
          <SelectInput
            value={draft.category}
            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
          >
            {options.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Data">
          <TextInput
            type="date"
            value={draft.date}
            onChange={(e) => setDraft({ ...draft, date: e.target.value })}
          />
        </Field>
      </div>

      <Field label="Ícone">
        <IconPicker value={draft.icon} onChange={(icon) => setDraft({ ...draft, icon })} />
      </Field>
    </EditorSheet>
  );
}
