import type { ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { BottomSheet } from "@/components/common/BottomSheet";
import { PremiumButton } from "@/components/common/PremiumButton";

/** Shared shell for every create/edit form of the app. */
export function EditorSheet({
  open,
  onOpenChange,
  title,
  description,
  onSave,
  onDelete,
  saveLabel = "Salvar",
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onSave: () => void;
  onDelete?: () => void;
  saveLabel?: string;
  children: ReactNode;
}) {
  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      footer={
        <div className="flex gap-2 pb-2">
          {onDelete && (
            <PremiumButton
              variant="outline"
              size="icon"
              aria-label="Excluir"
              onClick={onDelete}
              className="shrink-0 text-destructive"
            >
              <Trash2 className="size-4" aria-hidden />
            </PremiumButton>
          )}
          <PremiumButton variant="outline" block onClick={() => onOpenChange(false)}>
            Cancelar
          </PremiumButton>
          <PremiumButton block onClick={onSave}>
            {saveLabel}
          </PremiumButton>
        </div>
      }
    >
      <div className="space-y-4 pb-2">{children}</div>
    </BottomSheet>
  );
}
