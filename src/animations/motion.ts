/**
 * Motion language. Every animated surface pulls from here so timing and
 * easing stay identical across the product.
 */
export const easing = {
  premium: "cubic-bezier(0.22, 1, 0.36, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  exit: "cubic-bezier(0.4, 0, 1, 1)",
} as const;

export const duration = {
  instant: 120,
  fast: 180,
  base: 260,
  slow: 420,
  ambient: 700,
} as const;

/** Staggered entrance for lists and dashboards. */
export const stagger = (index: number, step = 55) => ({
  animationDelay: `${index * step}ms`,
});

export const motionClass = {
  rise: "animate-[rise_0.5s_var(--ease-premium)_both]",
  fade: "animate-[fade_0.35s_var(--ease-premium)_both]",
  pop: "animate-[pop_0.28s_var(--ease-spring)_both]",
} as const;
