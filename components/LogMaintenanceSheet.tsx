"use client";

import { useState } from "react";
import { Wrench } from "lucide-react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useToast } from "@/components/ui/Toast";
import { useGym } from "@/lib/store";
import { EQUIPMENT_CONDITIONS } from "@/lib/utils";
import type { EquipmentCondition, InventoryItem } from "@/lib/types";

export function LogMaintenanceSheet({
  item,
  open,
  onClose,
}: {
  item: InventoryItem | null;
  open: boolean;
  onClose: () => void;
}) {
  const { logMaintenance } = useGym();
  const { showToast } = useToast();
  const [condition, setCondition] = useState<EquipmentCondition>(item?.condition ?? "Good");
  const [note, setNote] = useState("");
  const [cost, setCost] = useState("");

  if (!item) return null;

  const submit = () => {
    logMaintenance(item.id, note.trim() || "Routine inspection and servicing", condition, cost ? Number(cost) : undefined);
    showToast(`Maintenance logged for ${item.name}.`);
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={onClose} title={`Log Maintenance — ${item.name}`}>
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--gym-text-muted)]">
            Condition after service
          </label>
          <div className="flex gap-2">
            {EQUIPMENT_CONDITIONS.map((c) => (
              <button
                key={c}
                onClick={() => setCondition(c)}
                className={`flex-1 rounded-xl border py-2.5 text-xs font-semibold transition ${
                  condition === c ? "border-[var(--gym-accent)] bg-[var(--gym-accent)]/10 text-[var(--gym-accent)]" : "border-[var(--gym-border)] text-[var(--gym-text-muted)]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--gym-text-muted)]">
            Notes
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Replaced worn belt, tightened bolts"
            rows={3}
            className="w-full resize-none rounded-xl border border-[var(--gym-border)] bg-[var(--gym-surface-2)] p-3 text-sm text-[var(--gym-text)] outline-none focus:border-[var(--gym-accent)]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--gym-text-muted)]">
            Cost (optional)
          </label>
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="0"
            className="w-full rounded-xl border border-[var(--gym-border)] bg-[var(--gym-surface-2)] px-3.5 py-2.5 text-sm text-[var(--gym-text)] outline-none focus:border-[var(--gym-accent)]"
          />
        </div>
        <button
          onClick={submit}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--gym-accent)] py-3 text-sm font-bold text-black transition active:scale-[0.98]"
        >
          <Wrench size={16} />
          Save Maintenance Log
        </button>
      </div>
    </BottomSheet>
  );
}
