import { useState } from "react";
import { FileText, Grid2x2, List, ScanLine, Search, Star } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Section } from "@/components/common/Section";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { ModuleCard } from "@/components/common/ModuleCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Input } from "@/components/ui/input";
import { ReceiptsManager } from "@/components/finance/ReceiptsManager";
import { useLedger } from "@/providers/LedgerProvider";
import { stagger } from "@/animations/motion";

type VaultView = "list" | "grid";
type VaultScope = "all" | "images" | "files";

export function VaultScreen() {
  const [view, setView] = useState<VaultView>("list");
  const [scope, setScope] = useState<VaultScope>("all");
  const [query, setQuery] = useState("");
  const { receipts } = useLedger();

  const gallery = receipts.filter((r) =>
    scope === "images" ? r.mimeType.startsWith("image/") : !r.mimeType.startsWith("image/"),
  );

  return (
    <AppShell>
      <ScreenHeader
        backTo="/patrimonio"
        eyebrow="Patrimônio"
        title="Cofre Digital"
        subtitle="Todos os seus documentos financeiros, organizados."
        actions={
          <button
            aria-label={view === "list" ? "Visualização em grade" : "Visualização em lista"}
            onClick={() => setView(view === "list" ? "grid" : "list")}
            className="press flex size-10 items-center justify-center rounded-full border border-border bg-card shadow-xs"
          >
            {view === "list" ? <Grid2x2 className="size-4" aria-hidden /> : <List className="size-4" aria-hidden />}
          </button>
        }
      />

      <div className="mt-5 space-y-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar por título ou pasta"
            className="h-11 rounded-[var(--radius-xl)] border-border bg-card pl-9 shadow-xs"
          />
        </div>

        <SegmentedControl
          value={scope}
          onChange={setScope}
          options={[
            { value: "all", label: "Tudo" },
            { value: "images", label: "Imagens" },
            { value: "files", label: "Arquivos" },
          ]}
        />

        {scope === "all" ? (
          <Section title="Documentos" description="Cada comprovante na sua pasta.">
            <ReceiptsManager query={query} />
          </Section>
        ) : (
          <Section title={scope === "images" ? "Imagens" : "Arquivos"}>
            {gallery.length === 0 ? (
              <EmptyState
                icon={scope === "images" ? Star : FileText}
                title="Nada por aqui ainda"
                description="Adicione comprovantes na aba “Tudo” — fotos e arquivos aparecem separados aqui."
              />
            ) : view === "grid" ? (
              <div className="grid grid-cols-2 gap-3">
                {gallery.map((r, i) => (
                  <div
                    key={r.id}
                    style={stagger(i)}
                    className="surface-card animate-[pop_0.28s_var(--ease-spring)_both] overflow-hidden"
                  >
                    {r.mimeType.startsWith("image/") ? (
                      <img src={r.dataUrl} alt={r.title} className="aspect-[3/4] w-full object-cover" />
                    ) : (
                      <div className="grid aspect-[3/4] place-items-center text-muted-foreground">
                        <FileText className="size-6" aria-hidden />
                      </div>
                    )}
                    <p className="truncate p-2 text-[0.7rem] text-foreground">{r.title}</p>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-2">
                {gallery.map((r) => (
                  <li key={r.id} className="surface-card flex items-center gap-3 p-3">
                    <FileText className="size-4 text-primary" aria-hidden />
                    <span className="min-w-0 flex-1 truncate text-sm text-foreground">{r.title}</span>
                    <span className="text-[0.7rem] text-muted-foreground">{r.folder}</span>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        )}

        <Section title="Preparado para o futuro">
          <ModuleCard
            icon={ScanLine}
            tone="primary"
            title="OCR de documentos"
            description="Pipeline assíncrono definido no domínio: extração de estabelecimento, valor, data e número do documento, com vínculo automático ao lançamento."
            meta="Fase 2"
          />
        </Section>
      </div>
    </AppShell>
  );
}
