import { createFileRoute } from "@tanstack/react-router";
import { VaultScreen } from "@/screens/vault/VaultScreen";
import { APP } from "@/constants/app";

const title = `Cofre Digital · ${APP.name}`;
const description =
  "Comprovantes, notas fiscais, garantias, extratos e documentos organizados por pastas, favoritos e filtros.";

export const Route = createFileRoute("/patrimonio/cofre")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: VaultScreen,
});
