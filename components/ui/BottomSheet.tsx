"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[105] flex items-end justify-center bg-black/70 md:items-center" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-2xl border border-[var(--gym-border)] bg-[var(--gym-surface)] p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl animate-sheet-in md:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="mx-auto h-1 w-10 rounded-full bg-[var(--gym-border)] md:hidden" />
        </div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--gym-text)]">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--gym-surface-2)] text-[var(--gym-text-muted)]"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
