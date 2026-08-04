import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ThemeMode } from "@/theme/tokens";

export type AppLanguage = "pt-BR" | "en-US" | "es-ES";
export type AppCurrency = "BRL" | "USD" | "EUR";

export interface AppSettings {
  currency: AppCurrency;
  language: AppLanguage;
  pushEnabled: boolean;
  notifyBills: boolean;
  notifyGoals: boolean;
  notifyInsights: boolean;
  notifySecurity: boolean;
  biometrics: boolean;
  pinLock: boolean;
  autoBackup: boolean;
  cloudSync: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  currency: "BRL",
  language: "pt-BR",
  pushEnabled: false,
  notifyBills: true,
  notifyGoals: true,
  notifyInsights: true,
  notifySecurity: true,
  biometrics: false,
  pinLock: false,
  autoBackup: true,
  cloudSync: false,
};

interface PreferencesValue {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  hideBalances: boolean;
  toggleBalances: () => void;
  settings: AppSettings;
  setSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  /** Requests browser permission and flips `pushEnabled` accordingly. */
  requestPushPermission: () => Promise<NotificationPermission | "unsupported">;
  pushPermission: NotificationPermission | "unsupported";
}

const PreferencesContext = createContext<PreferencesValue | null>(null);

const STORAGE_KEY = "aurum.preferences";

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("light");
  const [hideBalances, setHideBalances] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [pushPermission, setPushPermission] = useState<NotificationPermission | "unsupported">(
    "default",
  );

  // Read after mount only — avoids SSR/hydration mismatches.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PreferencesValue>;
        if (parsed.themeMode) setThemeModeState(parsed.themeMode);
        if (typeof parsed.hideBalances === "boolean") setHideBalances(parsed.hideBalances);
        if (parsed.settings) setSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
      }
    } catch {
      /* preferences are non-critical */
    }
    setPushPermission(
      typeof window !== "undefined" && "Notification" in window
        ? Notification.permission
        : "unsupported",
    );
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ themeMode, hideBalances, settings }),
      );
    } catch {
      /* ignore quota errors */
    }
    const prefersDark =
      themeMode === "dark" ||
      (themeMode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, [themeMode, hideBalances, settings]);

  const setThemeMode = useCallback((mode: ThemeMode) => setThemeModeState(mode), []);
  const toggleBalances = useCallback(() => setHideBalances((v) => !v), []);

  const setSetting = useCallback(
    <K extends keyof AppSettings>(key: K, value: AppSettings[K]) =>
      setSettings((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const requestPushPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPushPermission("unsupported");
      return "unsupported" as const;
    }
    const result = await Notification.requestPermission();
    setPushPermission(result);
    setSettings((prev) => ({ ...prev, pushEnabled: result === "granted" }));
    return result;
  }, []);

  const value = useMemo(
    () => ({
      themeMode,
      setThemeMode,
      hideBalances,
      toggleBalances,
      settings,
      setSetting,
      requestPushPermission,
      pushPermission,
    }),
    [
      themeMode,
      setThemeMode,
      hideBalances,
      toggleBalances,
      settings,
      setSetting,
      requestPushPermission,
      pushPermission,
    ],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences deve ser usado dentro de <PreferencesProvider />");
  return ctx;
}
