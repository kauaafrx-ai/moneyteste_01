import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `Você é o assistente financeiro do Aurum, um app premium em português brasileiro.

Regras obrigatórias:
- Responda SEMPRE em português brasileiro, de forma educativa, clara e amigável.
- NUNCA recomende comprar ou vender ativos específicos.
- NUNCA prometa ou garanta retornos.
- Explique termos técnicos (CDI, Selic, IPCA, Dividend Yield, P/L, P/VP, ROE, FIIs, ETFs etc.) com exemplos práticos.
- Ao explicar notícias: resuma em linguagem simples, esclareça termos, destaque impactos econômicos e por que é relevante.
- Deixe claro quando algo não é consultoria financeira.
- Seja conciso: prefira listas curtas e parágrafos breves.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: unknown };
        if (!Array.isArray(body.messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3.6-flash");
        const result = streamText({
          model,
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(body.messages as UIMessage[]),
        });
        return result.toUIMessageStreamResponse({
          originalMessages: body.messages as UIMessage[],
        });
      },
    },
  },
});
