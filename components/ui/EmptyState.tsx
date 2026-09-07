import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--gym-border)] bg-[var(--gym-surface)]/50 px-6 py-10 text-center">
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gym-accent)]/10 text-[var(--gym-accent)]">
        <Icon size={22} />
      </span>
      <p className="text-base font-bold text-[var(--gym-text)]">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-[var(--gym-text-muted)]">{description}</p>
    </div>
  );
}
