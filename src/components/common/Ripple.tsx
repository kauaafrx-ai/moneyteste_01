import { useCallback, useRef, useState } from "react";

interface RippleItem {
  id: number;
  x: number;
  y: number;
  size: number;
}

/**
 * Material-3 style ripple, tuned down for a premium (subtle) feel.
 * Attach `onPointerDown` to a `ripple-host` element and render `ripples`.
 */
export function useRipple() {
  const [ripples, setRipples] = useState<RippleItem[]>([]);
  const seq = useRef(0);

  const onPointerDown = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const id = ++seq.current;
    setRipples((prev) => [
      ...prev,
      { id, x: event.clientX - rect.left - size / 2, y: event.clientY - rect.top - size / 2, size },
    ]);
    window.setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 620);
  }, []);

  return { ripples, onPointerDown };
}

export function RippleLayer({ ripples }: { ripples: RippleItem[] }) {
  return (
    <>
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden
          className="ripple-dot"
          style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
        />
      ))}
    </>
  );
}
