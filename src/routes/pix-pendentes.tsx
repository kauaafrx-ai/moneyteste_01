import { createFileRoute } from "@tanstack/react-router";
import { PixPendingScreen } from "@/screens/pix/PixPendingScreen";
import { APP } from "@/constants/app";

const title = `PIX pendentes · ${APP.name}`;
const description = "Transferências PIX a enviar e a receber, com chave, prazo e baixa imediata.";

export const Route = createFileRoute("/pix-pendentes")({
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
  component: PixPendingScreen,
});
