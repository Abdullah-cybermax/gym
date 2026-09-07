"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, Wrench } from "lucide-react";
import { useGym } from "@/lib/store";
import { formatCurrency, formatDate, EQUIPMENT_CATEGORIES } from "@/lib/utils";
import { ConditionBadge } from "@/components/ui/ConditionBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { LogMaintenanceSheet } from "@/components/LogMaintenanceSheet";
import { CATEGORY_ICONS } from "@/components/EquipmentCard";
import { useToast } from "@/components/ui/Toast";
import type { EquipmentCategory } from "@/lib/types";

export default function EquipmentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { state, deleteEquipment, updateEquipment } = useGym();
  const { showToast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);

  const item = state.inventory.find((i) => i.id === params.id);

  if (!item) {
    return (
      <div className="px-4 pt-10 text-center">
        <p className="text-[var(--gym-text-muted)]">Equipment not found.</p>
        <Link href="/inventory" className="mt-3 inline-block text-sm font-semibold text-[var(--gym-accent)]">
          Back to Inventory
        </Link>
      </div>
    );
  }

  const Icon = CATEGORY_ICONS[item.category];

  return (
    <div className="px-4 pb-10 pt-4 md:px-8 md:pt-6">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm font-semibold text-[var(--gym-text-muted)]">
          <ArrowLeft size={18} />
          Back
        </button>
        <button
          onClick={() => setEditOpen(true)}
          className="flex items-center gap-1.5 rounded-full border border-[var(--gym-border)] bg-[var(--gym-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--gym-text)]"
        >
          <Pencil size={13} />
          Edit
        </button>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[var(--gym-surface-2)] text-[var(--gym-text)]">
            <Icon size={26} />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-extrabold text-[var(--gym-text)]">{item.name}</h1>
            <p className="text-sm text-[var(--gym-text-muted)]">
              {item.category}
              {item.location ? ` · ${item.location}` : ""}
            </p>
          </div>
        </div>

        <section className="mt-5 rounded-2xl border border-[var(--gym-border)] bg-[var(--gym-surface)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--gym-text-muted)]">Details</h2>
            <ConditionBadge condition={item.condition} />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <InfoRow label="Quantity" value={String(item.quantity)} />
            <InfoRow label="Purchase Date" value={item.purchaseDate ? formatDate(item.purchaseDate) : "—"} />
            <InfoRow label="Last Service" value={item.lastServiceDate ? formatDate(item.lastServiceDate) : "Never serviced"} />
            <InfoRow label="Location" value={item.location ?? "—"} />
          </div>
        </section>

        {item.notes && (
          <section className="mt-4 rounded-2xl border border-[var(--gym-border)] bg-[var(--gym-surface)] p-4">
            <h2 className="mb-1.5 text-sm font-bold uppercase tracking-wide text-[var(--gym-text-muted)]">Notes</h2>
            <p className="text-sm text-[var(--gym-text)]">{item.notes}</p>
          </section>
        )}

        <section className="mt-4 rounded-2xl border border-[var(--gym-border)] bg-[var(--gym-surface)] p-4">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--gym-text-muted)]">Maintenance History</h2>
          {item.maintenanceHistory.length === 0 ? (
            <p className="text-sm text-[var(--gym-text-muted)]">No maintenance logged yet.</p>
          ) : (
            <div className="divide-y divide-[var(--gym-border)]">
              {item.maintenanceHistory.map((record) => (
                <div key={record.id} className="py-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-[var(--gym-text)]">{formatDate(record.date)}</span>
                    <ConditionBadge condition={record.condition} />
                  </div>
                  <p className="mt-1 text-sm text-[var(--gym-text-muted)]">{record.note}</p>
                  {record.cost !== undefined && (
                    <p className="mt-0.5 text-xs font-semibold text-[var(--gym-text)]">{formatCurrency(record.cost)}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => setLogOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-[var(--gym-accent)] py-3 text-sm font-bold text-black transition active:scale-[0.98]"
          >
            <Wrench size={16} />
            Log Maintenance
          </button>
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-[var(--gym-border)] bg-[var(--gym-surface-2)] py-3 text-sm font-bold text-[var(--gym-text)] transition active:scale-[0.98]"
          >
            <Pencil size={16} />
            Edit Equipment
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-[var(--gym-danger)]/40 bg-[var(--gym-danger)]/10 py-3 text-sm font-bold text-[var(--gym-danger)] transition active:scale-[0.98]"
          >
            <Trash2 size={16} />
            Delete Equipment
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title={`Delete ${item.name}?`}
        description="This will remove the equipment from your inventory records. This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          deleteEquipment(item.id);
          showToast(`${item.name} was removed.`);
          router.push("/inventory");
        }}
      />

      <EditEquipmentSheet
        open={editOpen}
        onClose={() => setEditOpen(false)}
        item={item}
        onSave={(updates) => {
          updateEquipment(item.id, updates);
          showToast("Equipment details updated.");
          setEditOpen(false);
        }}
      />

      <LogMaintenanceSheet key={item.id} item={item} open={logOpen} onClose={() => setLogOpen(false)} />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[var(--gym-text-muted)]">{label}</p>
      <p className="font-semibold text-[var(--gym-text)]">{value}</p>
    </div>
  );
}

function EditEquipmentSheet({
  open,
  onClose,
  item,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  item: { name: string; category: EquipmentCategory; quantity: number; location?: string; notes?: string };
  onSave: (updates: { name: string; category: EquipmentCategory; quantity: number; location?: string; notes?: string }) => void;
}) {
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState<EquipmentCategory>(item.category);
  const [quantity, setQuantity] = useState(item.quantity);
  const [location, setLocation] = useState(item.location ?? "");
  const [notes, setNotes] = useState(item.notes ?? "");

  if (!open) return null;

  return (
    <BottomSheet open={open} onClose={onClose} title="Edit Equipment">
      <div className="space-y-3.5">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-[var(--gym-text)]">Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className={editInputClass} />
        </label>
        <div>
          <span className="mb-1.5 block text-xs font-semibold text-[var(--gym-text)]">Category</span>
          <div className="grid grid-cols-2 gap-2">
            {EQUIPMENT_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-xl border py-2 text-xs font-semibold transition ${
                  category === c ? "border-[var(--gym-accent)] bg-[var(--gym-accent)]/10 text-[var(--gym-accent)]" : "border-[var(--gym-border)] text-[var(--gym-text-muted)]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-[var(--gym-text)]">Quantity</span>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
            className={editInputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-[var(--gym-text)]">Location</span>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className={editInputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-[var(--gym-text)]">Notes</span>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={`${editInputClass} resize-none`} />
        </label>
        <button
          onClick={() => onSave({ name, category, quantity, location: location || undefined, notes: notes || undefined })}
          className="w-full rounded-xl bg-[var(--gym-accent)] py-3 text-sm font-bold text-black transition active:scale-[0.98]"
        >
          Save Changes
        </button>
      </div>
    </BottomSheet>
  );
}

const editInputClass =
  "w-full rounded-xl border border-[var(--gym-border)] bg-[var(--gym-surface-2)] px-3.5 py-2.5 text-sm text-[var(--gym-text)] outline-none focus:border-[var(--gym-accent)]";
