import { useMemo, useState } from "react";
import {
  Calculator,
  Coins,
  Flame,
  Gauge,
  LineChart,
  PiggyBank,
  Target,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Section } from "@/components/common/Section";
import { MetricTile } from "@/components/common/MetricTile";
import { ProgressBar } from "@/components/common/Progress";
import { AnimatedNumber } from "@/components/common/AnimatedNumber";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { DeltaBadge } from "@/components/common/DeltaBadge";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { formatMoney, formatPercent, toMoney } from "@/utils/format";
import { stagger } from "@/animations/motion";
import {
  ASSET_CLASSES,
  HORIZONS,
  MARKET_INDICATORS,
  blend,
  capitalForIncome,
  futureValue,
  yearsToTarget,
} from "@/data/passive-income";

const brl = (reais: number, compact = false) =>
  formatMoney(toMoney(Math.round(reais * 100)), { compact });

type SimTab = "compound" | "income" | "fire";

export function PassiveIncomeScreen() {
  const [monthly, setMonthly] = useState(500);
  const [selected, setSelected] = useState<string[]>(["fiis", "acoes", "tesouro"]);
  const [horizon, setHorizon] = useState<number>(10);
  const [tab, setTab] = useState<SimTab>("compound");
  const [desiredIncome, setDesiredIncome] = useState(5000);
  const [costOfLiving, setCostOfLiving] = useState(6000);

  const mix = useMemo(() => blend(selected), [selected]);
  const invested = 24_500;
  const passiveMonthly = (invested * mix.annualYield) / 12;
  const goal = 5000;

  const projections = useMemo(
    () =>
      [5, 10, 20].map((years) => {
        const value = futureValue(invested, monthly, mix.annualReturn, years);
        return { years, value, income: (value * mix.annualYield) / 12 };
      }),
    [monthly, mix, invested],
  );

  const horizonValue = futureValue(invested, monthly, mix.annualReturn, horizon);
  const capitalNeeded = capitalForIncome(desiredIncome, mix.annualYield);
  const yearsNeeded = yearsToTarget(invested, monthly, mix.annualReturn, capitalNeeded);
  const fireNumber = costOfLiving * 12 * 25;
  const fireYears = yearsToTarget(invested, monthly, mix.annualReturn, fireNumber);

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <AppShell>
      <ScreenHeader
        eyebrow="Investir+"
        title="Renda Passiva"
        subtitle="Como o seu dinheiro pode trabalhar por você."
        backTo="/patrimonio"
      />

      <div className="mt-5 space-y-7">
        {/* Dashboard ------------------------------------------------------ */}
        <div className="bg-gradient-brand shadow-elevated animate-[rise_0.5s_var(--ease-premium)_both] relative overflow-hidden rounded-[var(--radius-2xl)] p-5 text-primary-foreground">
          <div aria-hidden className="absolute -right-16 -top-20 size-56 rounded-full bg-primary-glow/30 blur-3xl" />
          <div className="relative">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] opacity-80">
              Renda passiva mensal
            </p>
            <AnimatedNumber
              value={passiveMonthly}
              format={(v) => brl(v)}
              className="mt-1 block text-3xl font-semibold"
            />
            <div className="mt-4">
              <ProgressBar
                value={(passiveMonthly / goal) * 100}
                tone="success"
                label={`Meta ${brl(goal)}/mês`}
                hint={formatPercent(passiveMonthly / goal)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <MetricTile label="Patrimônio investido" value={brl(invested, true)} icon={PiggyBank} style={stagger(0)} />
          <MetricTile
            label="Yield da carteira"
            value={formatPercent(mix.annualYield)}
            icon={Coins}
            tone="primary"
            style={stagger(1)}
          />
        </div>

        <Section title="Se continuar investindo" description={`Aportando ${brl(monthly)} por mês`}>
          <div className="space-y-3">
            {projections.map((p, i) => (
              <div key={p.years} className="surface-card animate-[rise_0.5s_var(--ease-premium)_both] flex items-center justify-between p-4" style={stagger(i)}>
                <div>
                  <p className="text-sm font-semibold text-foreground">Em {p.years} anos</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Renda estimada de {brl(p.income)}/mês
                  </p>
                </div>
                <p className="numeric text-lg font-semibold text-primary">{brl(p.value, true)}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Simulador ------------------------------------------------------ */}
        <Section title="Simulador inteligente" description="Ajuste aporte, ativos e prazo">
          <div className="surface-card space-y-5 p-4">
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium text-foreground">Aporte mensal</span>
                <span className="numeric text-sm font-semibold text-primary">{brl(monthly)}</span>
              </div>
              <Slider
                className="mt-3"
                value={[monthly]}
                min={50}
                max={10000}
                step={50}
                onValueChange={([v]) => setMonthly(v)}
                aria-label="Aporte mensal"
              />
            </div>

            <div>
              <p className="text-xs font-medium text-foreground">Ativos</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {ASSET_CLASSES.map((asset) => {
                  const active = selected.includes(asset.id);
                  return (
                    <button
                      key={asset.id}
                      onClick={() => toggle(asset.id)}
                      aria-pressed={active}
                      className={cn(
                        "press rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-300",
                        active
                          ? "border-primary bg-accent text-accent-foreground"
                          : "border-border bg-card text-muted-foreground",
                      )}
                    >
                      {asset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-foreground">Prazo</p>
              <div className="flex flex-wrap gap-2">
                {HORIZONS.map((y) => (
                  <button
                    key={y}
                    onClick={() => setHorizon(y)}
                    aria-pressed={horizon === y}
                    className={cn(
                      "press rounded-[var(--radius-lg)] border px-3 py-1.5 text-xs font-semibold transition-colors duration-300",
                      horizon === y
                        ? "border-primary bg-accent text-accent-foreground"
                        : "border-border bg-card text-muted-foreground",
                    )}
                  >
                    {y} {y === 1 ? "ano" : "anos"}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[var(--radius-xl)] bg-muted p-4">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Patrimônio em {horizon} {horizon === 1 ? "ano" : "anos"}
              </p>
              <AnimatedNumber
                value={horizonValue}
                format={(v) => brl(v)}
                className="mt-1 block text-2xl font-semibold text-foreground"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Retorno médio estimado de {formatPercent(mix.annualReturn)} ao ano · renda de{" "}
                {brl((horizonValue * mix.annualYield) / 12)}/mês
              </p>
            </div>
          </div>
        </Section>

        {/* Calculadoras --------------------------------------------------- */}
        <Section title="Calculadoras">
          <SegmentedControl
            options={[
              { value: "compound", label: "Juros" },
              { value: "income", label: "Renda" },
              { value: "fire", label: "FIRE" },
            ]}
            value={tab}
            onChange={setTab}
          />

          <div className="surface-card mt-3 space-y-4 p-4">
            {tab === "compound" && (
              <>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calculator className="size-4" aria-hidden />
                  <span className="text-xs font-medium">Juros compostos sobre os aportes atuais</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <MetricTile label="Total aportado" value={brl(invested + monthly * horizon * 12, true)} />
                  <MetricTile
                    label="Juros acumulados"
                    value={brl(Math.max(0, horizonValue - invested - monthly * horizon * 12), true)}
                    tone="primary"
                  />
                </div>
              </>
            )}

            {tab === "income" && (
              <>
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-medium text-foreground">Renda desejada por mês</span>
                    <span className="numeric text-sm font-semibold text-primary">{brl(desiredIncome)}</span>
                  </div>
                  <Slider
                    className="mt-3"
                    value={[desiredIncome]}
                    min={500}
                    max={30000}
                    step={500}
                    onValueChange={([v]) => setDesiredIncome(v)}
                    aria-label="Renda desejada"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <MetricTile label="Capital necessário" value={brl(capitalNeeded, true)} icon={Target} />
                  <MetricTile
                    label="Tempo estimado"
                    value={`${yearsNeeded.toFixed(1)} anos`}
                    icon={Gauge}
                    tone="primary"
                  />
                </div>
              </>
            )}

            {tab === "fire" && (
              <>
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-medium text-foreground">Custo de vida mensal</span>
                    <span className="numeric text-sm font-semibold text-primary">{brl(costOfLiving)}</span>
                  </div>
                  <Slider
                    className="mt-3"
                    value={[costOfLiving]}
                    min={1000}
                    max={40000}
                    step={500}
                    onValueChange={([v]) => setCostOfLiving(v)}
                    aria-label="Custo de vida mensal"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <MetricTile label="Número FIRE" value={brl(fireNumber, true)} icon={Flame} />
                  <MetricTile
                    label="Independência em"
                    value={`${fireYears.toFixed(1)} anos`}
                    icon={TrendingUp}
                    tone="primary"
                  />
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Baseado na regra dos 4%: patrimônio equivalente a 25 anos do seu custo de vida.
                </p>
              </>
            )}
          </div>
        </Section>

        {/* Mercado -------------------------------------------------------- */}
        <Section title="Mercado" description="Valores ilustrativos até a conexão com a API de mercado">
          <div className="grid grid-cols-2 gap-3">
            {MARKET_INDICATORS.map((indicator, i) => (
              <div key={indicator.id} className="surface-card animate-[rise_0.5s_var(--ease-premium)_both] p-4" style={stagger(i, 40)}>
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  {indicator.label}
                </p>
                <p className="numeric mt-1.5 text-base font-semibold text-foreground">{indicator.value}</p>
                <div className="mt-2 flex items-center gap-2">
                  <DeltaBadge ratio={indicator.day} />
                  <span className="text-[0.65rem] text-muted-foreground">
                    mês {formatPercent(indicator.month)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Classes de ativo">
          <div className="space-y-2">
            {ASSET_CLASSES.map((asset, i) => (
              <div key={asset.id} className="surface-card animate-[rise_0.5s_var(--ease-premium)_both] flex items-center justify-between p-3.5" style={stagger(i, 35)}>
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-[var(--radius-lg)] bg-muted text-muted-foreground">
                    <LineChart className="size-4" aria-hidden strokeWidth={1.9} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{asset.label}</p>
                    <p className="text-xs text-muted-foreground">Risco {asset.risk.toLowerCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="numeric text-sm font-semibold text-foreground">
                    {formatPercent(asset.annualReturn)}
                  </p>
                  <p className="text-[0.65rem] text-muted-foreground">
                    yield {formatPercent(asset.annualYield)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <p className="pb-2 text-center text-[0.7rem] leading-relaxed text-muted-foreground">
          Conteúdo educacional e informativo. As simulações usam premissas médias e não representam
          recomendação de compra ou venda, nem garantia de rentabilidade.
        </p>
      </div>
    </AppShell>
  );
}
