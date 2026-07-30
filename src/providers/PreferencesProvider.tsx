import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ThemeMode } from "@/theme/tokens";

interface PreferencesValue {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  hideBalances: boolean;
  toggleBalances: () => void;
}

const PreferencesContext = createContext<PreferencesValue | null>(null);

const STORAGE_KEY = "aurum.preferences";

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("light");
  const [hideBalances, setHideBalances] = useState(false);

  // Read after mount only — avoids SSR/hydration mismatches.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<PreferencesValue>;
      if (parsed.themeMode) setThemeModeState(parsed.themeMode);
      if (typeof parsed.hideBalances === "boolean") setHideBalances(parsed.hideBalances);
    } catch {
      /* preferences are non-critical */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ themeMode, hideBalances }));
    } catch {
      /* ignore quota errors */
    }
    const prefersDark =
      themeMode === "dark" ||
      (themeMode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, [themeMode, hideBalances]);

  const setThemeMode = useCallback((mode: ThemeMode) => setThemeModeState(mode), []);
  const toggleBalances = useCallback(() => setHideBalances((v) => !v), []);

  const value = useMemo(
    () => ({ themeMode, setThemeMode, hideBalances, toggleBalances }),
    [themeMode, setThemeMode, hideBalances, toggleBalances],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences deve ser usado dentro de <PreferencesProvider />");
  return ctx;
}
