import { createFileRoute } from "@tanstack/react-router";
import { EducationScreen } from "@/screens/education/EducationScreen";
import { APP } from "@/constants/app";

const title = `Universidade Financeira · ${APP.name}`;
const description =
  "Trilhas de aprendizado, glossário pesquisável, quiz e a filosofia dos maiores investidores — educação financeira do básico ao avançado.";

export const Route = createFileRoute("/educacao")({
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
  component: EducationScreen,
});
