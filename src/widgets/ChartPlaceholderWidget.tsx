import { SkeletonBlock } from "@/components/common/SkeletonBlock";

/**
 * Chart placeholder that reserves the exact layout the real chart will use,
 * preventing layout shift when data arrives.
 */
export function ChartPlaceholderWidget({ title, height = 148 }: { title: string; height?: number }) {
  return (
    <div className="surface-card animate-[rise_0.5s_var(--ease-premium)_both] p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <SkeletonBlock className="h-5 w-16 rounded-full" />
      </div>
      <div className="mt-4 flex items-end gap-2" style={{ height }}>
        {[38, 62, 45, 80, 55, 72, 48].map((h, i) => (
          <div key={i} className="flex-1" style={{ height: `${h}%` }}>
            <SkeletonBlock className="h-full w-full rounded-[var(--radius-sm)]" />
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between text-[0.65rem] text-muted-foreground">
        {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </div>
  );
}
