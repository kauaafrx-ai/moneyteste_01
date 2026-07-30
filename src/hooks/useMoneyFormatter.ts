import { formatMoney } from "@/utils/format";
import { usePreferences } from "@/providers/PreferencesProvider";
import type { Money } from "@/types/common";

/** Money formatting that respects the user's privacy preference. */
export function useMoneyFormatter() {
  const { hideBalances } = usePreferences();
  return (value: Money, options?: { compact?: boolean; signed?: boolean }) =>
    formatMoney(value, { ...options, hidden: hideBalances });
}
