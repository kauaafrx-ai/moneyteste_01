import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BellRing,
  CircleHelp,
  CloudUpload,
  CreditCard,
  Download,
  Fingerprint,
  Globe,
  Landmark,
  Languages,
  Palette,
  RefreshCw,
  ShieldCheck,
  Tags,
  Trash2,
  Upload,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Section } from "@/components/common/Section";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { PremiumButton } from "@/components/common/PremiumButton";
import { usePreferences, type AppCurrency, type AppLanguage } from "@/providers/PreferencesProvider";
import { useLedger } from "@/providers/LedgerProvider";
import { APP } from "@/constants/app";
import { stagger } from "@/animations/motion";
import { cn } from "@/lib/utils";
import type { ThemeMode } from "@/theme/tokens";

function Row({
  icon: Icon,
  title,
  description,
  children,
  index = 0,
}: {
  icon: typeof BellRing;
  title: string;
  description?: string;
  children?: React.ReactNode;
  index?: number;
}) {
  return (
    <div
      style={stagger(index, 45)}
      className="surface-card animate-[rise_0.4s_var(--ease-premium)_both] flex items-center gap-3 p-3.5"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-lg)] border border-border bg-surface text-muted-foreground transition-transform duration-200 hover:scale-110">
        <Icon className="size-4" aria-hidden strokeWidth={1.9} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">{title}</span>
        {description && (
          <span className="mt-0.5 block text-[0.7rem] leading-relaxed text-muted-foreground">
            {description}
          </span>
        )}
      </span>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "press relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300",
        checked ? "bg-gradient-emerald" : "bg-border-strong",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 size-5 rounded-full bg-card shadow-sm transition-all duration-300 ease-[var(--ease-premium)]",
          checked ? "left-[1.375rem]" : "left-0.5",
        )}
      />
    </button>
  );
}

/** Full settings screen reachable from Finanças and Perfil. */
export function SettingsScreen() {
  const {
    themeMode,
    setThemeMode,
    settings,
    setSetting,
    requestPushPermission,
    pushPermission,
  } = usePreferences();
  const ledger = useLedger();
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);

  const exportData = () => {
    const payload = {
      categories: ledger.categories,
      subscriptions: ledger.subscriptions,
      bills: ledger.bills,
      activity: ledger.activity,
      goals: ledger.goals,
      installments: ledger.installments,
      assets: ledger.assets,
      commitments: ledger.commitments,
      reserve: ledger.reserve,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aurum-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Backup exportado com sucesso.");
  };

  const importData = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text());
      ledger.update(parsed);
      setStatus("Dados importados com sucesso.");
    } catch {
      setStatus("Arquivo inválido. Use um backup exportado pelo app.");
    }
  };

  const clearDemo = () => {
    ledger.update({
      categories: [],
      subscriptions: [],
      bills: [],
      activity: [],
      goals: [],
      installments: [],
      receipts: [],
      assets: [],
      commitments: [],
      reserve: { current: 0, monthlyCost: 0, months: 6 },
    });
    setStatus("Dados de demonstração removidos. Comece do zero.");
  };

  return (
    <AppShell>
      <ScreenHeader
        eyebrow="Preferências"
        title="Configurações"
        subtitle="Moeda, idioma, tema, segurança e dados."
        backTo="/financas"
      />

      <div className="mt-5 space-y-6">
        {status && (
          <p className="animate-[fade_0.3s_var(--ease-premium)_both] rounded-[var(--radius-xl)] border border-primary/30 bg-accent p-3 text-xs font-medium text-accent-foreground">
            {status}
          </p>
        )}

        <Section title="Moeda e idioma">
          <div className="space-y-3">
            <Row icon={Globe} title="Moeda" description="Usada em todos os valores do app.">
              <select
                value={settings.currency}
                onChange={(e) => setSetting("currency", e.target.value as AppCurrency)}
                className="h-9 rounded-[var(--radius-lg)] border border-border bg-card px-2 text-xs font-semibold text-foreground"
              >
                <option value="BRL">BRL</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </Row>
            <Row icon={Languages} title="Idioma" description="Idioma da interface." index={1}>
              <select
                value={settings.language}
                onChange={(e) => setSetting("language", e.target.value as AppLanguage)}
                className="h-9 rounded-[var(--radius-lg)] border border-border bg-card px-2 text-xs font-semibold text-foreground"
              >
                <option value="pt-BR">Português</option>
                <option value="en-US">English</option>
                <option value="es-ES">Español</option>
              </select>
            </Row>
          </div>
        </Section>

        <Section title="Tema" description="Aplicado a todo o design system">
          <SegmentedControl<ThemeMode>
            value={themeMode}
            onChange={setThemeMode}
            options={[
              { value: "light", label: "Claro" },
              { value: "dark", label: "Escuro" },
              { value: "system", label: "Sistema" },
            ]}
          />
        </Section>

        <Section title="Notificações" description="Alertas no app e no celular">
          <div className="space-y-3">
            <Row
              icon={BellRing}
              title="Notificações no celular"
              description={
                pushPermission === "unsupported"
                  ? "Este dispositivo não suporta notificações push."
                  : pushPermission === "denied"
                    ? "Permissão bloqueada — libere nas configurações do navegador."
                    : "Receba alertas de vencimentos mesmo com o app fechado."
              }
            >
              <Toggle
                checked={settings.pushEnabled}
                onChange={(v) => {
                  if (v) void requestPushPermission();
                  else setSetting("pushEnabled", false);
                }}
              />
            </Row>
            {(
              [
                ["notifyBills", "Contas e vencimentos"],
                ["notifyGoals", "Objetivos e metas"],
                ["notifyInsights", "Insights da IA"],
                ["notifySecurity", "Alertas de segurança"],
              ] as const
            ).map(([key, label], i) => (
              <Row key={key} icon={BellRing} title={label} index={i + 1}>
                <Toggle checked={settings[key]} onChange={(v) => setSetting(key, v)} />
              </Row>
            ))}
          </div>
        </Section>

        <Section title="Segurança">
          <div className="space-y-3">
            <Row icon={Fingerprint} title="Biometria" description="Desbloqueio por digital ou rosto.">
              <Toggle checked={settings.biometrics} onChange={(v) => setSetting("biometrics", v)} />
            </Row>
            <Row icon={ShieldCheck} title="PIN de acesso" description="Bloqueio automático do app." index={1}>
              <Toggle checked={settings.pinLock} onChange={(v) => setSetting("pinLock", v)} />
            </Row>
          </div>
        </Section>

        <Section title="Dados">
          <div className="space-y-3">
            <Row icon={CloudUpload} title="Backup automático" description="Cópia local diária dos seus dados.">
              <Toggle checked={settings.autoBackup} onChange={(v) => setSetting("autoBackup", v)} />
            </Row>
            <Row icon={RefreshCw} title="Sincronização" description="Manter dados entre dispositivos." index={1}>
              <Toggle checked={settings.cloudSync} onChange={(v) => setSetting("cloudSync", v)} />
            </Row>
            <div className="grid grid-cols-2 gap-3">
              <PremiumButton variant="outline" block onClick={exportData}>
                <Download className="size-4" aria-hidden /> Exportar
              </PremiumButton>
              <PremiumButton variant="outline" block onClick={() => fileRef.current?.click()}>
                <Upload className="size-4" aria-hidden /> Importar
              </PremiumButton>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void importData(file);
                e.target.value = "";
              }}
            />
            <PremiumButton variant="danger" block onClick={clearDemo}>
              <Trash2 className="size-4" aria-hidden /> Limpar dados de demonstração
            </PremiumButton>
          </div>
        </Section>

        <Section title="Organização">
          <div className="space-y-3">
            <Link to="/financas">
              <Row icon={Tags} title="Categorias" description="Editar nomes, cores e ícones." />
            </Link>
            <Link to="/patrimonio">
              <Row icon={Landmark} title="Contas" description="Bancos, saldos e previsões." index={1} />
            </Link>
            <Link to="/financas">
              <Row icon={CreditCard} title="Cartões" description="Cartões, faturas e parcelas." index={2} />
            </Link>
            <Link to="/educacao">
              <Row icon={CircleHelp} title="Central de ajuda" description="Tutoriais e suporte." index={3} />
            </Link>
            <Row
              icon={Palette}
              title={`Sobre o ${APP.name}`}
              description={`${APP.tagline} · v${APP.version}`}
              index={4}
            />
          </div>
        </Section>
      </div>
    </AppShell>
  );
}
