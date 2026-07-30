import { History, Paperclip, Send, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Section } from "@/components/common/Section";
import { EmptyState } from "@/components/common/EmptyState";
import { Input } from "@/components/ui/input";
import { stagger } from "@/animations/motion";

const QUICK_PROMPTS = [
  "Como estão meus gastos este mês?",
  "Onde posso economizar?",
  "Quanto já tenho de reserva?",
  "Resuma minhas assinaturas",
];

export function AiScreen() {
  return (
    <AppShell>
      <ScreenHeader
        eyebrow="Inteligência"
        title="Assistente"
        subtitle="Conversas sobre a sua vida financeira."
        actions={
          <button
            aria-label="Histórico de conversas"
            className="press flex size-10 items-center justify-center rounded-full border border-border bg-card shadow-xs"
          >
            <History className="size-4" aria-hidden strokeWidth={1.9} />
          </button>
        }
      />

      <div className="mt-5 space-y-6">
        <EmptyState
          icon={Sparkles}
          title="Estrutura de chat pronta"
          description="Mensagens, histórico, anexos e respostas ricas (métricas, gráficos e ações) já estão modelados. A inteligência será conectada na próxima etapa."
        />

        <Section title="Sugestões rápidas">
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={prompt}
                style={stagger(i, 45)}
                className="press animate-[fade_0.35s_var(--ease-premium)_both] rounded-full border border-border bg-card px-3 py-2 text-xs font-medium text-foreground shadow-xs hover:bg-accent"
              >
                {prompt}
              </button>
            ))}
          </div>
        </Section>

        <div className="surface-glass sticky bottom-[calc(var(--bottom-nav-height)+0.5rem)] flex items-center gap-2 rounded-[var(--radius-2xl)] border border-border p-2 shadow-elevated">
          <button
            aria-label="Anexar arquivo"
            className="press flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
          >
            <Paperclip className="size-4" aria-hidden strokeWidth={1.9} />
          </button>
          <Input
            placeholder="Pergunte algo sobre suas finanças"
            className="h-9 border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
          <button
            aria-label="Enviar mensagem"
            className="press bg-gradient-emerald shadow-brand-glow flex size-9 shrink-0 items-center justify-center rounded-full text-primary-foreground"
          >
            <Send className="size-4" aria-hidden strokeWidth={2} />
          </button>
        </div>
      </div>
    </AppShell>
  );
}
