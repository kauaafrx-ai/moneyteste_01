/**
 * Design tokens mirrored from `src/styles.css` for programmatic use
 * (charts, canvas, animation). CSS remains the source of truth —
 * these read live values so themes stay in sync.
 */
export const cssVar = (name: string) => `var(--${name})`;

export const themeTokens = {
  color: {
    background: cssVar("background"),
    foreground: cssVar("foreground"),
    primary: cssVar("primary"),
    primaryGlow: cssVar("primary-glow"),
    petrol: cssVar("petrol"),
    success: cssVar("success"),
    warning: cssVar("warning"),
    destructive: cssVar("destructive"),
    muted: cssVar("muted-foreground"),
    border: cssVar("border"),
  },
  chart: [cssVar("chart-1"), cssVar("chart-2"), cssVar("chart-3"), cssVar("chart-4"), cssVar("chart-5")],
  radius: {
    sm: cssVar("radius-sm"),
    md: cssVar("radius-md"),
    lg: cssVar("radius-lg"),
    xl: cssVar("radius-xl"),
    xxl: cssVar("radius-2xl"),
  },
  elevation: {
    xs: cssVar("shadow-xs"),
    sm: cssVar("shadow-sm"),
    md: cssVar("shadow-md"),
    lg: cssVar("shadow-lg"),
    float: cssVar("shadow-float"),
  },
  space: (step: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12) => cssVar(`space-${step}`),
} as const;

export type ThemeMode = "light" | "dark" | "system";
