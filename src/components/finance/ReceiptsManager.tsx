import { useMemo, useRef, useState } from "react";
import { Camera, FileText, FolderClosed, FolderPlus, Paperclip, Trash2 } from "lucide-react";
import { PremiumButton } from "@/components/common/PremiumButton";
import { EmptyState } from "@/components/common/EmptyState";
import { Field, MoneyInput, SelectInput, TextInput } from "@/components/common/FormControls";
import { EditorSheet } from "./EditorSheet";
import { useLedger, useCollection, uid, type ReceiptRecord } from "@/providers/LedgerProvider";
import { useMoneyFormatter } from "@/hooks/useMoneyFormatter";
import { toMoney } from "@/utils/format";
import { shortDate } from "@/utils/dates";
import { stagger } from "@/animations/motion";
import { cn } from "@/lib/utils";

const readFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

/** Receipts organised in folders, with photo or file attachment. */
export function ReceiptsManager({ query = "" }: { query?: string }) {
  const money = useMoneyFormatter();
  const ledger = useLedger();
  const { items, add, patch, remove } = useCollection("receipts");
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const [folder, setFolder] = useState<string>("Todas");
  const [draft, setDraft] = useState<ReceiptRecord | null>(null);
  const [open, setOpen] = useState(false);
  const [newFolder, setNewFolder] = useState("");
  const [folderOpen, setFolderOpen] = useState(false);
  const [preview, setPreview] = useState<ReceiptRecord | null>(null);

  const folders = ledger.folders;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((r) => (folder === "Todas" ? true : r.folder === folder))
      .filter((r) => (q ? r.title.toLowerCase().includes(q) || r.folder.toLowerCase().includes(q) : true))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [items, folder, query]);

  const onPick = async (file: File | undefined) => {
    if (!file) return;
    const dataUrl = await readFile(file);
    setDraft({
      id: uid(),
      title: file.name.replace(/\.[^.]+$/, ""),
      folder: folder === "Todas" ? folders[0] ?? "Comprovantes" : folder,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      dataUrl,
      createdAt: new Date().toISOString(),
      amount: 0,
    });
    setOpen(true);
  };

  const countOf = (name: string) => items.filter((r) => r.folder === name).length;

  return (
    <div className="space-y-4">
      <input
        ref={fileRef}
        type="file"
        accept="image/*,application/pdf"
        hidden
        onChange={(e) => {
          void onPick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => {
          void onPick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      <div className="flex gap-2">
        <PremiumButton block icon={<Camera className="size-4" />} onClick={() => cameraRef.current?.click()}>
          Tirar foto
        </PremiumButton>
        <PremiumButton
          block
          variant="outline"
          icon={<Paperclip className="size-4" />}
          onClick={() => fileRef.current?.click()}
        >
          Anexar arquivo
        </PremiumButton>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {["Todas", ...folders].map((name, i) => (
          <button
            key={name}
            style={stagger(i, 35)}
            onClick={() => setFolder(name)}
            className={cn(
              "press animate-[fade_0.35s_var(--ease-premium)_both] flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium shadow-xs",
              folder === name
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border bg-card text-foreground hover:bg-accent",
            )}
          >
            <FolderClosed className="size-3.5 text-primary" aria-hidden strokeWidth={2} />
            {name}
            {name !== "Todas" && (
              <span className="numeric text-[0.65rem] text-muted-foreground">{countOf(name)}</span>
            )}
          </button>
        ))}
        <button
          onClick={() => setFolderOpen(true)}
          className="press flex shrink-0 items-center gap-1.5 rounded-full border border-dashed border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground"
        >
          <FolderPlus className="size-3.5" aria-hidden /> Nova pasta
        </button>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nenhum comprovante nesta pasta"
          description="Tire uma foto ou anexe um arquivo — cada comprovante fica guardado na sua pasta."
        />
      ) : (
        <ul className="space-y-2">
          {visible.map((receipt, i) => (
            <li key={receipt.id} style={stagger(i, 40)} className="animate-[fade_0.35s_var(--ease-premium)_both]">
              <div className="surface-card flex items-center gap-3 p-3">
                <button
                  onClick={() => setPreview(receipt)}
                  className="press size-11 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-muted"
                  aria-label={`Abrir ${receipt.title}`}
                >
                  {receipt.mimeType.startsWith("image/") ? (
                    <img src={receipt.dataUrl} alt={receipt.title} className="size-full object-cover" />
                  ) : (
                    <span className="grid size-full place-items-center text-muted-foreground">
                      <FileText className="size-4" aria-hidden />
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    setDraft(receipt);
                    setOpen(true);
                  }}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="truncate text-sm font-medium text-foreground">{receipt.title}</p>
                  <p className="truncate text-[0.7rem] text-muted-foreground">
                    {receipt.folder} · {shortDate(receipt.createdAt.slice(0, 10))}
                    {receipt.amount ? ` · ${money(toMoney(receipt.amount))}` : ""}
                  </p>
                </button>
                <button
                  aria-label="Excluir comprovante"
                  onClick={() => remove(receipt.id)}
                  className="press grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted"
                >
                  <Trash2 className="size-3.5" aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Details editor */}
      <EditorSheet
        open={open && draft !== null}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setDraft(null);
        }}
        title="Comprovante"
        description="Nome, pasta e valor do documento."
        onSave={() => {
          if (!draft) return;
          const exists = items.some((r) => r.id === draft.id);
          if (exists) patch(draft.id, draft);
          else add(draft);
          setOpen(false);
          setDraft(null);
        }}
      >
        {draft && (
          <>
            {draft.mimeType.startsWith("image/") && (
              <img
                src={draft.dataUrl}
                alt={draft.title}
                className="max-h-48 w-full rounded-[var(--radius-xl)] object-cover"
              />
            )}
            <Field label="Título">
              <TextInput value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </Field>
            <Field label="Pasta">
              <SelectInput value={draft.folder} onChange={(e) => setDraft({ ...draft, folder: e.target.value })}>
                {folders.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Valor (opcional)">
              <MoneyInput cents={draft.amount ?? 0} onChangeCents={(amount) => setDraft({ ...draft, amount })} />
            </Field>
          </>
        )}
      </EditorSheet>

      {/* New folder */}
      <EditorSheet
        open={folderOpen}
        onOpenChange={setFolderOpen}
        title="Nova pasta"
        onSave={() => {
          const name = newFolder.trim();
          if (!name || folders.includes(name)) return setFolderOpen(false);
          ledger.set("folders", [...folders, name]);
          setNewFolder("");
          setFolder(name);
          setFolderOpen(false);
        }}
      >
        <Field label="Nome da pasta">
          <TextInput
            value={newFolder}
            placeholder="Ex.: Impostos 2026"
            onChange={(e) => setNewFolder(e.target.value)}
          />
        </Field>
      </EditorSheet>

      {/* Preview */}
      <EditorSheet
        open={preview !== null}
        onOpenChange={(o) => !o && setPreview(null)}
        title={preview?.title ?? ""}
        saveLabel="Fechar"
        onSave={() => setPreview(null)}
      >
        {preview &&
          (preview.mimeType.startsWith("image/") ? (
            <img src={preview.dataUrl} alt={preview.title} className="w-full rounded-[var(--radius-xl)]" />
          ) : (
            <a
              href={preview.dataUrl}
              download={preview.fileName}
              className="surface-card flex items-center gap-3 p-4 text-sm font-medium text-foreground"
            >
              <FileText className="size-5 text-primary" aria-hidden /> Baixar {preview.fileName}
            </a>
          ))}
      </EditorSheet>
    </div>
  );
}
