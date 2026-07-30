import { createFileRoute } from "@tanstack/react-router";
import { FinancesScreen } from "@/screens/finances/FinancesScreen";
import { APP } from "@/constants/app";

const title = `Finanças · ${APP.name}`;
const description =
  "Entradas, saídas, categorias, assinaturas e parcelas em uma central de fluxo de caixa elegante.";

export const Route = createFileRoute("/financas")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: FinancesScreen,
});
