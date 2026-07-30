import { findBrand, findCard, type CardBrand } from "@/data/icon-registry";
import { cn } from "@/lib/utils";

/** Square brand mark (streaming services, card networks, banks). */
export function BrandTile({
  brand,
  size = "md",
  className,
}: {
  brand: { mark: string; color: string };
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-[var(--radius-md)] font-bold leading-none text-white",
        size === "sm" ? "size-7 text-[0.6rem]" : "size-9 text-[0.7rem]",
        className,
      )}
      style={{ backgroundColor: brand.color }}
      aria-hidden
    >
      {brand.mark}
    </span>
  );
}

export function SubscriptionTile({ brand, size }: { brand: string; size?: "sm" | "md" }) {
  return <BrandTile brand={findBrand(brand)} size={size} />;
}

export function CardTile({ list, id, size }: { list: CardBrand[]; id: string; size?: "sm" | "md" }) {
  return <BrandTile brand={findCard(list, id)} size={size} />;
}
