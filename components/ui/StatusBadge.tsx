import type { MembershipStatus } from "@/lib/types";
import { statusLabel } from "@/lib/utils";

const STYLES: Record<MembershipStatus, string> = {
  active: "bg-[var(--gym-success)]/12 text-[var(--gym-success)] border-[var(--gym-success)]/30",
  expiring: "bg-[var(--gym-warning)]/14 text-[var(--gym-warning)] border-[var(--gym-warning)]/35",
  expired: "bg-[var(--gym-danger)]/14 text-[var(--gym-danger)] border-[var(--gym-danger)]/35",
};

const DOT: Record<MembershipStatus, string> = {
  active: "bg-[var(--gym-success)]",
  expiring: "bg-[var(--gym-warning)]",
  expired: "bg-[var(--gym-danger)]",
};

const LABEL: Record<MembershipStatus, string> = {
  active: "Active",
  expiring: "Expiring Soon",
  expired: "Expired",
};

export function StatusBadge({ status, className = "" }: { status: MembershipStatus; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${STYLES[status]} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[status]}`} />
      {LABEL[status]}
    </span>
  );
}

export function ExpiryText({ status, daysRemaining, className = "" }: { status: MembershipStatus; daysRemaining: number; className?: string }) {
  const color =
    status === "active" ? "text-[var(--gym-success)]" : status === "expiring" ? "text-[var(--gym-warning)]" : "text-[var(--gym-danger)]";
  return <span className={`text-sm font-semibold ${color} ${className}`}>{statusLabel(status, daysRemaining)}</span>;
}
