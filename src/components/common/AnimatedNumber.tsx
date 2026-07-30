import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedNumberProps {
  /** Raw numeric value (cents, units, whatever `format` expects). */
  value: number;
  format: (value: number) => string;
  duration?: number;
  className?: string;
  /** Skip the animation (e.g. when balances are hidden). */
  frozen?: boolean;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Counts up to the target value — used for every headline financial figure. */
export function AnimatedNumber({
  value,
  format,
  duration = 900,
  className,
  frozen = false,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(frozen ? value : 0);
  const fromRef = useRef(0);

  useEffect(() => {
    if (frozen) {
      setDisplay(value);
      return;
    }
    const from = fromRef.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const next = from + (value - from) * easeOut(progress);
      setDisplay(next);
      if (progress < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, frozen]);

  return <span className={cn("numeric tabular-nums", className)}>{format(display)}</span>;
}
