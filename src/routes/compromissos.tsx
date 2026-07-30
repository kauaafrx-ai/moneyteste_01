import { createFileRoute } from "@tanstack/react-router";
import { CommitmentsScreen } from "@/screens/commitments/CommitmentsScreen";
import { APP } from "@/constants/app";

const title = `Compromissos · ${APP.name}`;
const description =
  "Central de compromissos financeiros: o que você tem que pagar, o que tem a receber e o status de cada acordo.";

export const Route = createFileRoute("/compromissos")({
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
  component: CommitmentsScreen,
});
