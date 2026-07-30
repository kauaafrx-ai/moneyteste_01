import { createFileRoute } from "@tanstack/react-router";
import { PassiveIncomeScreen } from "@/screens/passive-income/PassiveIncomeScreen";
import { APP } from "@/constants/app";

const title = `Renda Passiva e Simuladores · ${APP.name}`;
const description =
  "Dashboard de renda passiva, projeções de patrimônio e simuladores de juros compostos, dividendos e FIRE — conteúdo educacional.";

export const Route = createFileRoute("/renda-passiva")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PassiveIncomeScreen,
});
