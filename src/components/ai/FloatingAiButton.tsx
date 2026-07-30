import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Loader2, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { subscribeAiChat } from "./floatingAiBus";

const GREETING: UIMessage = {
  id: "greeting",
  role: "assistant",
  parts: [
    {
      type: "text",
      text:
        "Olá! Sou o assistente do Aurum. Posso explicar notícias, termos financeiros, indicadores e conceitos de investimento. **Não faço recomendações de compra ou venda.**\n\nComo posso ajudar?",
    },
  ],
};

export function FloatingAiButton() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    messages: [GREETING],
  });

  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    return subscribeAiChat(({ userText, systemContext }) => {
      setOpen(true);
      if (userText) {
        const text = systemContext
          ? `${userText}\n\n<contexto>${systemContext}</contexto>`
          : userText;
        sendMessage({ text });
      }
    });
  }, [sendMessage]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [open, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const handleSubmit = () => {
    const text = input.trim();
    if (!text || isBusy) return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <>
      <button
        type="button"
        aria-label="Abrir assistente de IA"
        onClick={() => setOpen(true)}
        className={cn(
          "press fixed z-40 flex size-14 items-center justify-center rounded-full shadow-floating",
          "bg-gradient-to-br from-primary to-primary/70 text-primary-foreground",
          "right-4 bottom-[calc(var(--bottom-nav-height)+1.25rem+env(safe-area-inset-bottom))]",
          open && "hidden",
        )}
      >
        <Sparkles className="size-6" aria-hidden />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background/60 backdrop-blur-sm" role="dialog" aria-modal="true">
          <button
            aria-label="Fechar"
            onClick={() => setOpen(false)}
            className="flex-1"
          />
          <div className="mx-auto flex h-[85vh] w-full max-w-[var(--app-max-width)] flex-col overflow-hidden rounded-t-[var(--radius-3xl)] border border-border bg-card shadow-floating">
            <header className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                  <Sparkles className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Assistente Aurum</p>
                  <p className="text-[0.7rem] text-muted-foreground">Educativo · Não é consultoria financeira</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setMessages([GREETING])}
                  className="rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  Novo
                </button>
                <button
                  type="button"
                  aria-label="Fechar"
                  onClick={() => setOpen(false)}
                  className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              {status === "submitted" && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" aria-hidden /> Pensando…
                </div>
              )}
              {error && (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                  Erro: {error.message}
                </p>
              )}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
              className="border-t border-border bg-card px-3 py-3 pb-[max(env(safe-area-inset-bottom),0.75rem)]"
            >
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  rows={1}
                  placeholder="Pergunte sobre finanças, notícias, termos…"
                  className="flex-1 resize-none rounded-2xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus-visible:border-primary"
                  style={{ maxHeight: 120 }}
                />
                <Button type="submit" size="icon" disabled={!input.trim() || isBusy} aria-label="Enviar">
                  {isBusy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function MessageBubble({ message }: { message: UIMessage }) {
  const raw = message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");
  // Hide silent <contexto>...</contexto> block from user bubble display.
  const text = raw.replace(/\n?<contexto>[\s\S]*?<\/contexto>\s*$/i, "").trim();
  const isUser = message.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] text-sm leading-relaxed",
          isUser
            ? "whitespace-pre-wrap rounded-2xl bg-primary px-3.5 py-2.5 text-primary-foreground"
            : "prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary",
        )}
      >
        {isUser ? (text || "") : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text || "…"}</ReactMarkdown>
        )}
      </div>
    </div>
  );
}
