import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { BottomSheet } from "@/components/common/BottomSheet";
import { stagger } from "@/animations/motion";

/** Step shown before the transaction form: entrada or saída. */
export function LaunchChooser({
  open,
  onOpenChange,
  onChoose,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChoose: (kind: "income" | "expense") => void;
}) {
  const options = [
    {
      kind: "income" as const,
      label: "Nova receita",
      hint: "Salário, freela, dividendos, reembolsos",
      icon: ArrowDownLeft,
      classes: "border-success/40 bg-success/10 text-success",
    },
    {
      kind: "expense" as const,
      label: "Nova despesa",
      hint: "Compras, contas, transporte, lazer",
      icon: ArrowUpRight,
      classes: "border-destructive/40 bg-destructive/10 text-destructive",
    },
  ];

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Lançar"
      description="O que você quer registrar agora?"
    >
      <div className="space-y-3 pb-3">
        {options.map((option, i) => (
          <button
            key={option.kind}
            style={stagger(i, 70)}
            onClick={() => {
              onChoose(option.kind);
              onOpenChange(false);
            }}
            className="surface-card card-interactive press animate-[rise_0.4s_var(--ease-premium)_both] flex w-full items-center gap-3 p-4 text-left"
          >
            <span
              className={`grid size-11 shrink-0 place-items-center rounded-[var(--radius-lg)] border transition-transform duration-200 hover:scale-110 ${option.classes}`}
            >
              <option.icon className="size-5" aria-hidden strokeWidth={2} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-foreground">{option.label}</span>
              <span className="mt-0.5 block text-[0.72rem] text-muted-foreground">{option.hint}</span>
            </span>
          </button>
        ))}
      </div>
    </BottomSheet>
  );
}
