import {
  LayoutDashboard,
  GraduationCap,
  Newspaper,
  PieChart,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export type AppRoutePath =
  | "/"
  | "/financas"
  | "/patrimonio"
  | "/patrimonio/cofre"
  | "/ia"
  | "/renda-passiva"
  | "/educacao"
  | "/noticias"
  | "/perfil";

export interface NavItem {
  id: string;
  label: string;
  path: AppRoutePath;
  icon: LucideIcon;
  /** Sub-routes that should keep this tab visually active. */
  matchPrefix?: string;
}

/** Bottom navigation — intentionally limited to five destinations. */
export const PRIMARY_NAV: NavItem[] = [
  { id: "home", label: "Início", path: "/", icon: LayoutDashboard },
  { id: "finances", label: "Finanças", path: "/financas", icon: PieChart, matchPrefix: "/financas" },
  {
    id: "wealth",
    label: "Patrimônio",
    path: "/patrimonio",
    icon: ShieldCheck,
    matchPrefix: "/patrimonio",
  },
  {
    id: "education",
    label: "Educação",
    path: "/educacao",
    icon: GraduationCap,
    matchPrefix: "/educacao",
  },
  { id: "news", label: "Notícias", path: "/noticias", icon: Newspaper, matchPrefix: "/noticias" },
  { id: "profile", label: "Perfil", path: "/perfil", icon: UserRound, matchPrefix: "/perfil" },
];

export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.matchPrefix) return pathname.startsWith(item.matchPrefix);
  return pathname === item.path;
}
