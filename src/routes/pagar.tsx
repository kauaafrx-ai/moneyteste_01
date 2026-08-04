import { createFileRoute } from "@tanstack/react-router";
import { PayScreen } from "@/screens/pay/PayScreen";
import { APP } from "@/constants/app";

const title = `Pagar · ${APP.name}`;
const description =
  "Todas as contas, PIX, dívidas, parcelas e assinaturas que precisam ser pagas em uma única tela.";

export const Route = createFileRoute("/pagar")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PayScreen,
});
