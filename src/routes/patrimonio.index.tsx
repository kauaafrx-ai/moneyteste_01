import { createFileRoute } from "@tanstack/react-router";
import { WealthScreen } from "@/screens/wealth/WealthScreen";
import { APP } from "@/constants/app";

const title = `Patrimônio · ${APP.name}`;
const description =
  "Reserva de emergência, investimentos, rentabilidade, objetivos financeiros e o Cofre Digital.";

export const Route = createFileRoute("/patrimonio/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: WealthScreen,
});
