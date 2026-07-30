import { createFileRoute } from "@tanstack/react-router";
import { ProfileScreen } from "@/screens/profile/ProfileScreen";
import { APP } from "@/constants/app";

const title = `Perfil · ${APP.name}`;
const description = "Conta, tema, notificações, segurança, backup, exportação e importação de dados.";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ProfileScreen,
});
