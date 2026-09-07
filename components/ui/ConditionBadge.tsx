import type { EquipmentCondition } from "@/lib/types";

const STYLES: Record<EquipmentCondition, string> = {
  Good: "bg-[var(--gym-success)]/12 text-[var(--gym-success)] border-[var(--gym-success)]/30",
  "Needs Repair": "bg-[var(--gym-warning)]/14 text-[var(--gym-warning)] border-[var(--gym-warning)]/35",
  "Out of Service": "bg-[var(--gym-danger)]/14 text-[var(--gym-danger)] border-[var(--gym-danger)]/35",
};

const DOT: Record<EquipmentCondition, string> = {
  Good: "bg-[var(--gym-success)]",
  "Needs Repair": "bg-[var(--gym-warning)]",
  "Out of Service": "bg-[var(--gym-danger)]",
};

export function ConditionBadge({ condition, className = "" }: { condition: EquipmentCondition; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${STYLES[condition]} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[condition]}`} />
      {condition}
    </span>
  );
}
