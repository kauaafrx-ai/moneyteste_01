import { useMemo, useState } from "react";
import {
  CalendarDays,
  CreditCard,
  FileText,
  Pencil,
  Plus,
  Repeat,
  Search,
  SlidersHorizontal,
  Tags,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Section } from "@/components/common/Section";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { Input } from "@/components/ui/input";
import { ActivityWidget } from "@/widgets/ActivityWidget";
import { BreakdownWidget } from "@/widgets/BreakdownWidget";
import { UpcomingBillsWidget } from "@/widgets/UpcomingBillsWidget";
import { ReceiptsManager } from "@/components/finance/ReceiptsManager";
import { SubscriptionEditor } from "@/components/finance/CategoryEditor";
import { InstallmentEditor } from "@/components/finance/InstallmentEditor";
import { BrandTile } from "@/components/common/BrandTile";
import { findBrand, findCard, BANKS, CARD_NETWORKS } from "@/data/icon-registry";
import { useCollection, type InstallmentRecord, type SubscriptionRecord } from "@/providers/LedgerProvider";
import { useMoneyFormatter } from "@/hooks/useMoneyFormatter";
import { toMoney } from "@/utils/format";
import { shortDate } from "@/utils/dates";
import { stagger } from "@/animations/motion";

type FinanceView = "all" | "income" | "expense";
type Panel = "lancamentos" | "categorias" | "assinaturas" | "parcelas" | "comprovantes";

export function FinancesScreen() {
  const money = useMoneyFormatter();
  const [view, setView] = useState<FinanceView>("all");
  const [panel, setPanel] = useState<Panel>("lancamentos");
  const [query, setQuery] = useState("");

  const subs = useCollection("subscriptions");
  const parcels = useCollection("installments");

  const [subEditing, setSubEditing] = useState<SubscriptionRecord | null>(null);
  const [subOpen, setSubOpen] = useState(false);
  const [parcelEditing, setParcelEditing] = useState<InstallmentRecord | null>(null);
  const [parcelOpen, setParcelOpen] = useState(false);

  const subsTotal = useMemo(
    () => subs.items.reduce((s, i) => s + (i.cycle === "anual" ? Math.round(i.amount / 12) : i.amount), 0),
    [subs.items],
  );

  return (
    <AppShell>
      <ScreenHeader
        eyebrow="Fluxo de caixa"
        title="Finanças"
        subtitle="Entradas, saídas e compromissos organizados."
        actions={
          <button
            aria-label="Filtros"
            className="press flex size-10 items-center justify-center rounded-full border border-border bg-card shadow-xs"
          >
            <SlidersHorizontal className="size-4" aria-hidden strokeWidth={1.9} />
          </button>
        }
      />

      <div className="mt-5 space-y-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar lançamentos"
            className="h-11 rounded-[var(--radius-xl)] border-border bg-card pl-9 shadow-xs"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {(
            [
              { id: "lancamentos", label: "Lançamentos", icon: CalendarDays },
              { id: "categorias", label: "Categorias", icon: Tags },
              { id: "assinaturas", label: "Assinaturas", icon: Repeat },
              { id: "parcelas", label: "Parcelas", icon: CreditCard },
              { id: "comprovantes", label: "Comprovantes", icon: FileText },
            ] as const
          ).map((tab, i) => (
            <button
              key={tab.id}
              style={stagger(i, 35)}
              onClick={() => setPanel(tab.id)}
              className={`press animate-[fade_0.35s_var(--ease-premium)_both] flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold shadow-xs ${
                panel === tab.id
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              <tab.icon className="size-3.5" aria-hidden strokeWidth={2} />
              {tab.label}
            </button>
          ))}
        </div>

        {panel === "lancamentos" && (
          <>
            <SegmentedControl
              value={view}
              onChange={setView}
              options={[
                { value: "all", label: "Tudo" },
                { value: "income", label: "Entradas" },
                { value: "expense", label: "Saídas" },
              ]}
            />
            <Section title="Lançamentos">
              <ActivityWidget
                title={view === "income" ? "Entradas" : view === "expense" ? "Saídas" : "Movimentações"}
                limit={30}
                filter={(item) =>
                  (view === "all" || item.kind === view) &&
                  (query.trim()
                    ? `${item.title} ${item.category}`.toLowerCase().includes(query.trim().toLowerCase())
                    : true)
                }
              />
            </Section>
            <Section title="Próximas contas">
              <UpcomingBillsWidget limit={10} />
            </Section>
          </>
        )}

        {panel === "categorias" && (
          <Section title="Categorias" description="Toque numa categoria para editar valor, cor e ícone.">
            <BreakdownWidget title="Orçamento por categoria" />
          </Section>
        )}

        {panel === "assinaturas" && (
          <Section
            title="Assinaturas"
            description={`${subs.items.length} ativas · ${money(toMoney(subsTotal))}/mês`}
            action={
              <button
                aria-label="Nova assinatura"
                onClick={() => {
                  setSubEditing(null);
                  setSubOpen(true);
                }}
                className="press grid size-8 place-items-center rounded-full bg-accent text-accent-foreground"
              >
                <Plus className="size-4" aria-hidden strokeWidth={2.4} />
              </button>
            }
          >
            <div className="space-y-2">
              {subs.items.map((sub, i) => (
                <button
                  key={sub.id}
                  style={stagger(i, 40)}
                  onClick={() => {
                    setSubEditing(sub);
                    setSubOpen(true);
                  }}
                  className="surface-card press animate-[fade_0.35s_var(--ease-premium)_both] flex w-full items-center gap-3 p-3.5 text-left"
                >
                  <BrandTile brand={findBrand(sub.brand)} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-foreground">{sub.name}</span>
                    <span className="block text-[0.7rem] text-muted-foreground">
                      {sub.cycle === "anual" ? "Anual" : "Mensal"} · dia {sub.dueDay}
                    </span>
                  </span>
                  <span className="numeric text-sm font-semibold text-foreground">
                    {money(toMoney(sub.amount))}
                  </span>
                  <Pencil className="size-3.5 text-muted-foreground" aria-hidden />
                </button>
              ))}
              <button
                onClick={() => {
                  setSubEditing(null);
                  setSubOpen(true);
                }}
                className="press flex w-full items-center justify-center gap-2 rounded-[var(--radius-2xl)] border border-dashed border-border bg-card p-3 text-xs font-semibold text-muted-foreground hover:bg-accent"
              >
                <Plus className="size-4" aria-hidden strokeWidth={2.2} /> Adicionar assinatura
              </button>
            </div>
          </Section>
        )}

        {panel === "parcelas" && (
          <Section
            title="Compras parceladas"
            description="Cartão, banco, parcelas e vencimento — por enquanto manual."
            action={
              <button
                aria-label="Nova compra parcelada"
                onClick={() => {
                  setParcelEditing(null);
                  setParcelOpen(true);
                }}
                className="press grid size-8 place-items-center rounded-full bg-accent text-accent-foreground"
              >
                <Plus className="size-4" aria-hidden strokeWidth={2.4} />
              </button>
            }
          >
            <div className="space-y-2">
              {parcels.items.map((p, i) => {
                const perMonth = Math.round(p.total / Math.max(p.count, 1));
                const next = new Date(`${p.firstDue}T00:00:00`);
                next.setMonth(next.getMonth() + p.paid);
                return (
                  <button
                    key={p.id}
                    style={stagger(i, 40)}
                    onClick={() => {
                      setParcelEditing(p);
                      setParcelOpen(true);
                    }}
                    className="surface-card press animate-[fade_0.35s_var(--ease-premium)_both] w-full p-3.5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <BrandTile brand={findCard(CARD_NETWORKS, p.network)} />
                      <BrandTile brand={findCard(BANKS, p.bank)} size="sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-foreground">{p.title}</span>
                        <span className="block text-[0.7rem] text-muted-foreground">
                          {p.paid}/{p.count} parcelas · vence {shortDate(next.toISOString().slice(0, 10))}
                        </span>
                      </span>
                      <span className="numeric text-sm font-semibold text-foreground">
                        {money(toMoney(perMonth))}
                      </span>
                      <Pencil className="size-3.5 text-muted-foreground" aria-hidden />
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="bg-gradient-emerald h-full rounded-full transition-[width] duration-700"
                        style={{ width: `${Math.round((p.paid / Math.max(p.count, 1)) * 100)}%` }}
                      />
                    </div>
                  </button>
                );
              })}
              <button
                onClick={() => {
                  setParcelEditing(null);
                  setParcelOpen(true);
                }}
                className="press flex w-full items-center justify-center gap-2 rounded-[var(--radius-2xl)] border border-dashed border-border bg-card p-3 text-xs font-semibold text-muted-foreground hover:bg-accent"
              >
                <Plus className="size-4" aria-hidden strokeWidth={2.2} /> Adicionar parcelamento
              </button>
            </div>
          </Section>
        )}

        {panel === "comprovantes" && (
          <Section title="Comprovantes" description="Foto ou arquivo, cada um na sua pasta.">
            <ReceiptsManager query={query} />
          </Section>
        )}
      </div>

      <SubscriptionEditor
        open={subOpen}
        onOpenChange={setSubOpen}
        initial={subEditing}
        onSave={(item) => (subEditing ? subs.patch(item.id, item) : subs.add(item))}
        onDelete={subs.remove}
      />
      <InstallmentEditor
        open={parcelOpen}
        onOpenChange={setParcelOpen}
        initial={parcelEditing}
        onSave={(item) => (parcelEditing ? parcels.patch(item.id, item) : parcels.add(item))}
        onDelete={parcels.remove}
      />
    </AppShell>
  );
}
