import { createFileRoute } from "@tanstack/react-router";
import { SettingsScreen } from "@/screens/settings/SettingsScreen";
import { APP } from "@/constants/app";

const title = `Configurações · ${APP.name}`;
const description =
  "Moeda, idioma, tema, notificações, backup, exportação, segurança e sincronização em um só lugar.";

export const Route = createFileRoute("/configuracoes")({
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
  component: SettingsScreen,
});
