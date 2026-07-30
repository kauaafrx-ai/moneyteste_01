import { createFileRoute } from "@tanstack/react-router";
import { AiScreen } from "@/screens/ai/AiScreen";
import { APP } from "@/constants/app";

const title = `Assistente de IA · ${APP.name}`;
const description =
  "Chat financeiro com histórico, sugestões rápidas, anexos e respostas ricas em métricas e gráficos.";

export const Route = createFileRoute("/ia")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: AiScreen,
});
