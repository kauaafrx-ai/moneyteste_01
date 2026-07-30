import { useEffect, useState } from "react";

/**
 * Small delay used to show skeleton loading on first paint, so data-heavy
 * surfaces animate in instead of popping. Purely presentational.
 */
export function useDataReady(delay = 620) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), delay);
    return () => window.clearTimeout(id);
  }, [delay]);
  return ready;
}
