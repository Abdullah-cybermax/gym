"use client";

import { AlertTriangle } from "lucide-react";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/70 px-4 pb-6 md:items-center md:pb-4" onClick={onCancel}>
      <div
        role="alertdialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-2xl border border-[var(--gym-border)] bg-[var(--gym-surface)] p-5 shadow-2xl animate-sheet-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center gap-3">
          {destructive && (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--gym-danger)]/15 text-[var(--gym-danger)]">
              <AlertTriangle size={20} />
            </span>
          )}
          <h2 className="text-lg font-bold text-[var(--gym-text)]">{title}</h2>
        </div>
        <p className="mb-5 text-sm leading-relaxed text-[var(--gym-text-muted)]">{description}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-[var(--gym-border)] bg-transparent py-3 text-sm font-semibold text-[var(--gym-text)] active:scale-[0.98] transition"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-xl py-3 text-sm font-bold active:scale-[0.98] transition ${
              destructive ? "bg-[var(--gym-danger)] text-white" : "bg-[var(--gym-accent)] text-black"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
