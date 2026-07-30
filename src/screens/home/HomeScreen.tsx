import { useState } from "react";
import { Bell, CalendarDays, PiggyBank, Receipt, Sparkles, Target, Wallet } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Section } from "@/components/common/Section";
import { MetricTile } from "@/components/common/MetricTile";
import { BottomSheet } from "@/components/common/BottomSheet";
import { PremiumButton } from "@/components/common/PremiumButton";
import { Fab } from "@/components/common/Fab";
import { SkeletonBlock } from "@/components/common/SkeletonBlock";
import { BalanceWidget } from "@/widgets/BalanceWidget";
import { FlowChartWidget } from "@/widgets/FlowChartWidget";
import { BreakdownWidget } from "@/widgets/BreakdownWidget";
import { UpcomingBillsWidget } from "@/widgets/UpcomingBillsWidget";
import { ActivityWidget } from "@/widgets/ActivityWidget";
import { WeeklySummaryWidget } from "@/widgets/WeeklySummaryWidget";
import { GoalsWidget } from "@/widgets/GoalsWidget";
import { useMoneyFormatter } from "@/hooks/useMoneyFormatter";
import { useDataReady } from "@/hooks/useDataReady";
import { toMoney } from "@/utils/format";
import { stagger } from "@/animations/motion";
import { OVERVIEW } from "@/data/demo";
import { ActivityEditor } from "@/components/finance/ActivityEditor";
import { useCollection, useLedger } from "@/providers/LedgerProvider";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function HomeScreen() {
  const money = useMoneyFormatter();
  const ready = useDataReady();
  const [sheet, setSheet] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const { categories, subscriptions } = useLedger();
  const activity = useCollection("activity");
  const subsTotal = subscriptions.reduce(
    (sum, s) => sum + (s.cycle === "anual" ? Math.round(s.amount / 12) : s.amount),
    0,
  );

  return (
    <AppShell>
      <ScreenHeader
        eyebrow="Visão geral"
        title={greeting()}
        subtitle="Seu panorama financeiro em um só lugar."
        actions={
          <button
            aria-label="Notificações"
            onClick={() => setSheet("notifications")}
            className="press relative grid size-10 place-items-center rounded-full border border-border bg-card shadow-xs hover:bg-accent"
          >
            <Bell className="size-4" aria-hidden strokeWidth={1.9} />
            <span className="absolute right-2.5 top-2.5 size-1.5 animate-pulse rounded-full bg-primary" />
          </button>
        }
      />

      <div className="mt-5 space-y-6">
        {ready ? (
          <BalanceWidget onAction={(id) => setSheet(id)} />
        ) : (
          <SkeletonBlock className="h-[19rem] rounded-[var(--radius-3xl)]" />
        )}

        <Section title="Resumo do mês" description="Indicadores principais">
          <div className="grid grid-cols-2 gap-3">
            <MetricTile label="Patrimônio" value={money(toMoney(OVERVIEW.netWorth), { compact: true })} icon={Wallet} style={stagger(0)} />
            <MetricTile label="Reserva" value={money(toMoney(OVERVIEW.reserve), { compact: true })} icon={PiggyBank} style={stagger(1)} />
            <MetricTile
              label="Economia"
              value={`${Math.round(OVERVIEW.savingsRatio * 100)}%`}
              icon={Target}
              tone="success"
              trend={{ value: "acima da sua média", direction: "up" }}
              style={stagger(2)}
            />
            <MetricTile
              label="Assinaturas"
              value={money(toMoney(subsTotal))}
              icon={Receipt}
              trend={{ value: `${subscriptions.length} ativas`, direction: "flat" }}
              style={stagger(3)}
            />
          </div>
        </Section>

        <Section title="Fluxo">
          {ready ? <FlowChartWidget /> : <SkeletonBlock className="h-64 rounded-[var(--radius-2xl)]" />}
        </Section>

        <Section title="Resumo semanal">
          <WeeklySummaryWidget />
        </Section>

        <Section title="Próximas contas" action={<CalendarDays className="size-4 text-muted-foreground" aria-hidden />}>
          <UpcomingBillsWidget />
        </Section>

        <Section title="Para onde vai seu dinheiro">
          {ready ? <BreakdownWidget /> : <SkeletonBlock className="h-48 rounded-[var(--radius-2xl)]" />}
        </Section>

        <Section title="Movimentações recentes">
          <ActivityWidget onSeeAll={() => setSheet("activity")} />
        </Section>

        <Section title="Metas" description="Objetivos em andamento">
          <GoalsWidget limit={2} />
        </Section>

        <button
          onClick={() => setSheet("insight")}
          className="surface-card card-interactive animate-[rise_0.5s_var(--ease-premium)_both] flex w-full items-center gap-3 p-4 text-left"
        >
          <span className="bg-gradient-emerald grid size-10 shrink-0 place-items-center rounded-[var(--radius-lg)] text-primary-foreground">
            <Sparkles className="size-[1.1rem]" aria-hidden strokeWidth={1.9} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-foreground">Insight da semana</span>
            <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
              Suas saídas com alimentação caíram 12%. Toque para ver a análise completa.
            </span>
          </span>
        </button>
      </div>

      <Fab label="Novo lançamento" onClick={() => setAddOpen(true)} />

      <ActivityEditor
        open={addOpen}
        onOpenChange={setAddOpen}
        categories={categories.map((c) => c.label)}
        onSave={(item) => activity.add(item)}
      />

      <BottomSheet
        open={sheet !== null && sheet !== "add"}
        onOpenChange={(open) => !open && setSheet(null)}
        title={sheet === "notifications" ? "Notificações" : "Novo lançamento"}
        description={
          sheet === "notifications"
            ? "Alertas de contas, metas e segurança."
            : "Registre uma entrada ou saída em poucos toques."
        }
        footer={
          <div className="flex gap-2 pb-2">
            <PremiumButton variant="outline" block onClick={() => setSheet(null)}>
              Cancelar
            </PremiumButton>
            <PremiumButton block onClick={() => setSheet(null)}>
              Confirmar
            </PremiumButton>
          </div>
        }
      >
        <div className="space-y-3 pb-2">
          {[
            "Aluguel vence em 2 dias",
            "Meta de viagem atingiu 65%",
            "Nova assinatura detectada: streaming",
          ].map((text, i) => (
            <div
              key={text}
              style={stagger(i, 60)}
              className="animate-[fade_0.35s_var(--ease-premium)_both] flex items-center gap-3 rounded-[var(--radius-xl)] border border-border bg-surface p-3"
            >
              <span className="size-2 shrink-0 rounded-full bg-primary" aria-hidden />
              <p className="text-sm text-foreground">{text}</p>
            </div>
          ))}
        </div>
      </BottomSheet>
    </AppShell>
  );
}
