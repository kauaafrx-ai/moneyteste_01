import type { LucideIcon } from "lucide-react";
import { SkeletonBlock } from "@/components/common/SkeletonBlock";

interface ListPlaceholderWidgetProps {
  title: string;
  hint: string;
  icon: LucideIcon;
  rows?: number;
}

/** Reserved space for list-based modules (bills, activity, documents). */
export function ListPlaceholderWidget({ title, hint, icon: Icon, rows = 3 }: ListPlaceholderWidgetProps) {
  return (
    <div className="surface-card animate-[rise_0.5s_var(--ease-premium)_both] overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Icon className="size-4 text-primary" aria-hidden strokeWidth={2} />
        <p className="text-sm font-semibold text-foreground">{title}</p>
      </div>
      <ul className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i} className="flex items-center gap-3 px-4 py-3">
            <SkeletonBlock className="size-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-3 w-1/2" />
              <SkeletonBlock className="h-2.5 w-1/3" />
            </div>
            <SkeletonBlock className="h-3 w-14" />
          </li>
        ))}
      </ul>
      <p className="px-4 py-3 text-[0.7rem] text-muted-foreground">{hint}</p>
    </div>
  );
}
