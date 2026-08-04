import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bell, CalendarDays, PiggyBank, Receipt, Sparkles, Target, Wallet } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Section } from "@/components/common/Section";
import { MetricTile } from "@/components/common/MetricTile";
import { BottomSheet } from "@/components/common/BottomSheet";
import { PremiumButton } from "@/components/common/PremiumButton";
import { Fab } from "@/components/common/Fab";
import { SkeletonBlock } from "@/components/common/SkeletonBlock";
import { HealthScoreWidget } from "@/widgets/HealthScoreWidget";
import { SmartFeedWidget } from "@/widgets/SmartFeedWidget";
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
import { LaunchChooser } from "@/components/finance/LaunchChooser";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { buildPendings } from "@/lib/pendings";
import { useCollection, useLedger, uid } from "@/providers/LedgerProvider";

function greeting(hour: number) {
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function HomeScreen() {
  const money = useMoneyFormatter();
  const ready = useDataReady();
  const navigate = useNavigate();
  const [sheet, setSheet] = useState<string | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [chooserOpen, setChooserOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [draftKind, setDraftKind] = useState<"income" | "expense">("expense");
  // Computed after mount only — local time differs from SSR time.
  const [hour, setHour] = useState(9);
  useEffect(() => setHour(new Date().getHours()), []);

  const ledger = useLedger();
  const { categories, subscriptions } = ledger;
  const activity = useCollection("activity");
  const subsTotal = subscriptions.reduce(
    (sum, s) => sum + (s.cycle === "anual" ? Math.round(s.amount / 12) : s.amount),
    0,
  );

  const pendings = buildPendings({
    bills: ledger.bills,
    commitments: ledger.commitments,
    subscriptions: ledger.subscriptions,
    installments: ledger.installments,
    goals: ledger.goals,
  });
  const urgentCount = pendings.filter((p) => p.severity === "late" || p.severity === "today").length;

  const handleBalanceAction = (id: string) => {
    if (id === "add") setChooserOpen(true);
    else if (id === "transfer") void navigate({ to: "/pix-pendentes" });
    else if (id === "pay") void navigate({ to: "/pagar" });
    else setSheet(id);
  };

  return (
    <AppShell>
      <ScreenHeader
        eyebrow="Visão geral"
        title={greeting(hour)}
        subtitle="Seu panorama financeiro em um só lugar."
        actions={
          <button
            aria-label={`Notificações${urgentCount ? ` (${urgentCount} urgentes)` : ""}`}
            onClick={() => setNotificationsOpen(true)}
            className="press relative grid size-10 place-items-center rounded-full border border-border bg-card shadow-xs transition-transform duration-200 hover:scale-105 hover:bg-accent"
          >
            <Bell className="size-4" aria-hidden strokeWidth={1.9} />
            {pendings.length > 0 && (
              <span
                className={`numeric absolute -right-1 -top-1 grid min-w-[1.15rem] place-items-center rounded-full px-1 text-[0.6rem] font-bold text-primary-foreground ${
                  urgentCount > 0 ? "animate-pulse bg-destructive" : "bg-gradient-emerald"
                }`}
              >
                {pendings.length}
              </span>
            )}
          </button>
        }
      />


      <div className="mt-5 space-y-6">
        {ready ? (
          <BalanceWidget onAction={handleBalanceAction} />
        ) : (
          <SkeletonBlock className="h-[19rem] rounded-[var(--radius-3xl)]" />
        )}


        <HealthScoreWidget />

        <Section title="Feed inteligente" description="Insights gerados a partir dos seus dados">
          <SmartFeedWidget limit={4} />
        </Section>

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
