import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight, Coins, GraduationCap, LineChart, Lock, Pencil, PiggyBank, Plus, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Section } from "@/components/common/Section";
import { MetricTile } from "@/components/common/MetricTile";
import { ModuleCard } from "@/components/common/ModuleCard";
import { ProgressBar } from "@/components/common/Progress";
import { EditorSheet } from "@/components/finance/EditorSheet";
import { Field, MoneyInput, TextInput } from "@/components/common/FormControls";
import { IconPicker, IconTile } from "@/components/common/IconPicker";
import { GoalsWidget } from "@/widgets/GoalsWidget";
import { useMoneyFormatter } from "@/hooks/useMoneyFormatter";
import { toMoney } from "@/utils/format";
import { stagger } from "@/animations/motion";
import { useCollection, useLedger, uid, type AssetRecord } from "@/providers/LedgerProvider";

export function WealthScreen() {
  const navigate = useNavigate();
  const money = useMoneyFormatter();
  const ledger = useLedger();
  const assets = useCollection("assets");

  const [assetDraft, setAssetDraft] = useState<AssetRecord | null>(null);
  const [assetOpen, setAssetOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [reserve, setReserve] = useState(ledger.reserve);

  const total = assets.items.reduce((s, a) => s + a.amount, 0);
  const reserveTarget = Math.max(ledger.reserve.monthlyCost * ledger.reserve.months, 1);
  const reservePct = Math.min(100, Math.round((ledger.reserve.current / reserveTarget) * 100));

  const openAsset = (asset: AssetRecord | null) => {
    setAssetDraft(
      asset ?? { id: uid(), label: "", amount: 0, icon: "bank", colorVar: "var(--chart-2)" },
    );
    setAssetOpen(true);
  };

  return (
    <AppShell>
      <ScreenHeader eyebrow="Longo prazo" title="Patrimônio" subtitle="Reserva, investimentos e objetivos." />

      <div className="mt-5 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <MetricTile label="Patrimônio" value={money(toMoney(total), { compact: true })} icon={TrendingUp} style={stagger(0)} />
          <MetricTile
            label="Reserva"
            value={`${reservePct}%`}
            icon={PiggyBank}
            tone="primary"
            style={stagger(1)}
          />
        </div>

        <Section
          title="Reserva de emergência"
          description={`${ledger.reserve.months} meses de custo de vida`}
          action={
            <button
              aria-label="Editar reserva"
              onClick={() => {
                setReserve(ledger.reserve);
                setReserveOpen(true);
              }}
              className="press grid size-8 place-items-center rounded-full bg-accent text-accent-foreground"
            >
              <Pencil className="size-3.5" aria-hidden />
            </button>
          }
        >
          <div className="surface-card p-4">
            <ProgressBar
              value={reservePct}
              label="Cobertura atual"
              hint={`${money(toMoney(ledger.reserve.current), { compact: true })} / ${money(toMoney(reserveTarget), { compact: true })}`}
            />
          </div>
        </Section>

        <Section
          title="Investimentos"
          description="Alocação por classe de ativo — toque para editar."
          action={
            <button
              aria-label="Nova classe de ativo"
              onClick={() => openAsset(null)}
              className="press grid size-8 place-items-center rounded-full bg-accent text-accent-foreground"
            >
              <Plus className="size-4" aria-hidden strokeWidth={2.4} />
            </button>
          }
        >
          <div className="space-y-2">
            {assets.items.map((asset, i) => (
              <button
                key={asset.id}
                style={stagger(i, 40)}
                onClick={() => openAsset(asset)}
                className="surface-card press animate-[fade_0.35s_var(--ease-premium)_both] flex w-full items-center gap-3 p-3.5 text-left"
              >
                <IconTile icon={asset.icon} tone="accent" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">{asset.label}</span>
                  <span className="block text-[0.7rem] text-muted-foreground">
                    {total ? Math.round((asset.amount / total) * 100) : 0}% da carteira
                  </span>
                </span>
                <span className="numeric text-sm font-semibold text-foreground">
                  {money(toMoney(asset.amount), { compact: true })}
                </span>
                <Pencil className="size-3.5 text-muted-foreground" aria-hidden />
              </button>
            ))}
          </div>
        </Section>

        <Section title="Objetivos financeiros" description="Metas com progresso e prazo">
          <GoalsWidget limit={6} />
        </Section>

        <Section title="Investir+" description="Renda passiva, simuladores e educação">
          <div className="space-y-3">
            <ModuleCard
              icon={Coins}
              tone="primary"
              title="Renda Passiva"
              description="Dashboard, projeções e simuladores de juros compostos, dividendos e FIRE."
              onClick={() => navigate({ to: "/renda-passiva" })}
              style={stagger(0)}
            />
            <ModuleCard
              icon={GraduationCap}
              tone="petrol"
              title="Universidade Financeira"
              description="Trilhas, glossário, quiz e a filosofia dos maiores investidores."
              onClick={() => navigate({ to: "/educacao" })}
              style={stagger(1)}
            />
            <ModuleCard
              icon={LineChart}
              title="Central de notícias"
              description="Ibovespa, cripto, FIIs e Selic com resumo por IA."
              onClick={() => navigate({ to: "/noticias" })}
              style={stagger(2)}
            />
          </div>
        </Section>

        <Section title="Cofre Digital" description="Um dos pilares do produto">
          <button
            onClick={() => navigate({ to: "/patrimonio/cofre" })}
            className="bg-gradient-brand shadow-elevated press animate-[rise_0.5s_var(--ease-premium)_both] relative w-full overflow-hidden rounded-[var(--radius-2xl)] p-5 text-left text-primary-foreground"
          >
            <div aria-hidden className="absolute -right-12 -top-16 size-48 rounded-full bg-primary-glow/30 blur-3xl" />
            <div className="relative flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-[var(--radius-lg)] bg-primary-foreground/15">
                <Lock className="size-5" aria-hidden strokeWidth={1.9} />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold">Cofre Digital</p>
                <p className="mt-1 text-xs opacity-85">
                  Comprovantes, notas fiscais, garantias e documentos com foto ou arquivo.
                </p>
              </div>
              <ChevronRight className="size-4 opacity-80" aria-hidden />
            </div>
          </button>
        </Section>
      </div>

      {/* Asset editor */}
      <EditorSheet
        open={assetOpen && assetDraft !== null}
        onOpenChange={(o) => {
          setAssetOpen(o);
          if (!o) setAssetDraft(null);
        }}
        title="Classe de ativo"
        description="Nome, valor investido e ícone."
        onSave={() => {
          if (!assetDraft?.label.trim()) return;
          const exists = assets.items.some((a) => a.id === assetDraft.id);
          if (exists) assets.patch(assetDraft.id, assetDraft);
          else assets.add(assetDraft);
          setAssetOpen(false);
          setAssetDraft(null);
        }}
        onDelete={
          assetDraft && assets.items.some((a) => a.id === assetDraft.id)
            ? () => {
                assets.remove(assetDraft.id);
                setAssetOpen(false);
                setAssetDraft(null);
              }
            : undefined
        }
      >
        {assetDraft && (
          <>
            <Field label="Nome">
              <TextInput
                value={assetDraft.label}
                placeholder="Ex.: Renda fixa"
                onChange={(e) => setAssetDraft({ ...assetDraft, label: e.target.value })}
              />
            </Field>
            <Field label="Valor investido">
              <MoneyInput
                cents={assetDraft.amount}
                onChangeCents={(amount) => setAssetDraft({ ...assetDraft, amount })}
              />
            </Field>
            <Field label="Ícone">
              <IconPicker value={assetDraft.icon} onChange={(icon) => setAssetDraft({ ...assetDraft, icon })} />
            </Field>
          </>
        )}
      </EditorSheet>

      {/* Reserve editor */}
      <EditorSheet
        open={reserveOpen}
        onOpenChange={setReserveOpen}
        title="Reserva de emergência"
        description="Valor guardado, custo mensal e meses de cobertura."
        onSave={() => {
          ledger.set("reserve", reserve);
          setReserveOpen(false);
        }}
      >
        <Field label="Valor guardado">
          <MoneyInput cents={reserve.current} onChangeCents={(current) => setReserve({ ...reserve, current })} />
        </Field>
        <Field label="Custo de vida mensal">
          <MoneyInput
            cents={reserve.monthlyCost}
            onChangeCents={(monthlyCost) => setReserve({ ...reserve, monthlyCost })}
          />
        </Field>
        <Field label="Meses de cobertura">
          <TextInput
            type="number"
            min={1}
            max={36}
            value={reserve.months}
            onChange={(e) => setReserve({ ...reserve, months: Number(e.target.value) || 1 })}
          />
        </Field>
      </EditorSheet>
    </AppShell>
  );
}
