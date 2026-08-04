import {
  Bell,
  CircleHelp,
  Download,
  Fingerprint,
  Info,
  Moon,
  Palette,
  ShieldCheck,
  Upload,
  UserRound,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Section } from "@/components/common/Section";
import { ModuleCard } from "@/components/common/ModuleCard";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { usePreferences } from "@/providers/PreferencesProvider";
import { APP } from "@/constants/app";
import { initials } from "@/utils/format";
import { stagger } from "@/animations/motion";
import type { ThemeMode } from "@/theme/tokens";

export function ProfileScreen() {
  const { themeMode, setThemeMode } = usePreferences();

  return (
    <AppShell>
      <ScreenHeader eyebrow="Conta" title="Perfil" subtitle="Preferências, segurança e dados." />

      <div className="mt-5 space-y-6">
        <div className="surface-card animate-[rise_0.5s_var(--ease-premium)_both] flex items-center gap-3 p-4">
          <span className="bg-gradient-emerald flex size-12 items-center justify-center rounded-full text-base font-semibold text-primary-foreground">
            {initials("Aurum User")}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">Sua conta</p>
            <p className="truncate text-xs text-muted-foreground">
              Perfil, e-mail e moeda padrão ({APP.currency})
            </p>
          </div>
        </div>

        <Link
          to="/configuracoes"
          className="surface-card card-interactive press animate-[rise_0.45s_var(--ease-premium)_both] flex items-center gap-3 p-4"
        >
          <span className="bg-gradient-brand grid size-10 shrink-0 place-items-center rounded-[var(--radius-lg)] text-primary-foreground">
            <Settings className="size-[1.1rem]" aria-hidden strokeWidth={1.9} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-foreground">Configurações completas</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              Moeda, idioma, notificações, segurança, backup e dados.
            </span>
          </span>
        </Link>

        <Section title="Aparência" description="Tema aplicado a todo o design system">
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


        <Section title="Segurança">
          <div className="space-y-3">
            <ModuleCard icon={Fingerprint} tone="primary" title="Biometria e PIN" description="Bloqueio automático, desbloqueio por biometria e PIN de acesso." style={stagger(0)} />
            <ModuleCard icon={ShieldCheck} tone="petrol" title="Sessão e criptografia" description="Controle de sessão, expiração automática e criptografia de dados sensíveis." style={stagger(1)} />
          </div>
        </Section>

        <Section title="Dados">
          <div className="space-y-3">
            <ModuleCard icon={Download} title="Backup e exportação" description="Backup automático e exportação em JSON ou CSV." style={stagger(0)} />
            <ModuleCard icon={Upload} title="Importação" description="Importação de extratos e planilhas com mapeamento de categorias." style={stagger(1)} />
          </div>
        </Section>

        <Section title="Preferências">
          <div className="space-y-3">
            <ModuleCard icon={Bell} title="Notificações" description="Contas, metas, insights e alertas de segurança." style={stagger(0)} />
            <ModuleCard icon={Palette} title="Personalização" description="Widgets da home, categorias favoritas e ordem das seções." style={stagger(1)} />
            <ModuleCard icon={CircleHelp} title="Ajuda" description="Central de ajuda, tutoriais e contato com o suporte." style={stagger(2)} />
            <ModuleCard icon={Info} title={`Sobre o ${APP.name}`} description={APP.tagline} meta={`v${APP.version}`} style={stagger(3)} />
          </div>
        </Section>

        <p className="pb-2 text-center text-[0.7rem] text-muted-foreground">
          <Moon className="mr-1 inline size-3" aria-hidden />
          <UserRound className="mr-1 inline size-3" aria-hidden />
          {APP.name} · arquitetura fundacional
        </p>
      </div>
    </AppShell>
  );
}
