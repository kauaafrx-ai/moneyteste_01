import { createFileRoute } from "@tanstack/react-router";
import { HomeScreen } from "@/screens/home/HomeScreen";
import { APP } from "@/constants/app";

const title = `${APP.name} · Visão geral das suas finanças`;
const description = APP.description;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: HomeScreen,
});
