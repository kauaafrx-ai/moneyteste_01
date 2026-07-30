import { useLocation } from "@tanstack/react-router";
import { PRIMARY_NAV, isNavItemActive, type NavItem } from "@/constants/navigation";

/** Resolves the active bottom-navigation destination for the current URL. */
export function useActiveNav(): NavItem | undefined {
  const pathname = useLocation({ select: (l) => l.pathname });
  return PRIMARY_NAV.find((item) => isNavItemActive(item, pathname));
}
