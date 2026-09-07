import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Member } from "@/lib/types";
import { formatCurrency, formatDate, getMembershipStatus, initials } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function MemberCard({ member }: { member: Member }) {
  const { status } = getMembershipStatus(member.expiryDate);
  return (
    <Link
      href={`/members/${member.id}`}
      className="flex items-center gap-3 rounded-2xl border border-[var(--gym-border)] bg-[var(--gym-surface)] p-3.5 transition active:scale-[0.99] active:bg-[var(--gym-surface-2)]"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--gym-surface-2)] text-sm font-bold text-[var(--gym-text)]">
        {initials(member.name)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-[15px] font-bold text-[var(--gym-text)]">{member.name}</span>
        </span>
        <span className="mt-0.5 block truncate text-xs text-[var(--gym-text-muted)]">{member.phone}</span>
        <span className="mt-2 flex items-center justify-between gap-2">
          <StatusBadge status={status} />
          <span className="text-right">
            <span className="block text-xs text-[var(--gym-text-muted)]">{member.plan} &middot; {formatDate(member.expiryDate)}</span>
            <span className="block text-sm font-bold text-[var(--gym-text)]">{formatCurrency(member.fee)}</span>
          </span>
        </span>
      </span>
      <ChevronRight size={18} className="shrink-0 text-[var(--gym-text-muted)]" />
    </Link>
  );
}
