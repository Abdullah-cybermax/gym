import Link from "next/link";
import { ChevronRight, Dumbbell, Weight, Waypoints, Package, Wrench } from "lucide-react";
import type { EquipmentCategory, InventoryItem } from "@/lib/types";
import { ConditionBadge } from "@/components/ui/ConditionBadge";

export const CATEGORY_ICONS: Record<EquipmentCategory, typeof Dumbbell> = {
  Cardio: Waypoints,
  "Strength Machines": Dumbbell,
  "Free Weights": Weight,
  Accessories: Package,
  Other: Wrench,
};

export function EquipmentCard({ item }: { item: InventoryItem }) {
  const Icon = CATEGORY_ICONS[item.category];
  return (
    <Link
      href={`/inventory/${item.id}`}
      className="flex items-center gap-3 rounded-2xl border border-[var(--gym-border)] bg-[var(--gym-surface)] p-3.5 transition active:scale-[0.99] active:bg-[var(--gym-surface-2)]"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--gym-surface-2)] text-[var(--gym-text)]">
        <Icon size={19} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-bold text-[var(--gym-text)]">{item.name}</span>
        <span className="mt-0.5 block truncate text-xs text-[var(--gym-text-muted)]">
          {item.category}
          {item.location ? ` · ${item.location}` : ""}
        </span>
        <span className="mt-2 flex items-center justify-between gap-2">
          <ConditionBadge condition={item.condition} />
          <span className="text-xs font-semibold text-[var(--gym-text-muted)]">
            Qty: <span className="text-[var(--gym-text)]">{item.quantity}</span>
          </span>
        </span>
      </span>
      <ChevronRight size={18} className="shrink-0 text-[var(--gym-text-muted)]" />
    </Link>
  );
}
