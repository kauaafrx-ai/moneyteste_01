import { createFileRoute } from "@tanstack/react-router";
import { NewsScreen } from "@/screens/news/NewsScreen";
import { APP } from "@/constants/app";

const title = `Central de Notícias · ${APP.name}`;
const description =
  "Notícias financeiras do Brasil e do mundo — Ibovespa, cripto, FIIs, Selic, dólar. Resumos com fonte e explicação por IA.";

export const Route = createFileRoute("/noticias")({
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
  component: NewsScreen,
});
