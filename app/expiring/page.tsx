"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PartyPopper } from "lucide-react";
import { useGym } from "@/lib/store";
import { daysUntil, formatCurrency } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";
import { ReminderSheet } from "@/components/ReminderSheet";
import type { Member } from "@/lib/types";

const TABS = [
  { key: "today", label: "Today", max: 0 },
  { key: "3", label: "3 Days", max: 3 },
  { key: "7", label: "7 Days", max: 7 },
  { key: "30", label: "30 Days", max: 30 },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function groupLabel(days: number): string {
  if (days === 0) return "Expires Today";
  if (days === 1) return "Expires in 1 Day";
  return `Expires in ${days} Days`;
}

export default function ExpiringSoonPage() {
  const { state } = useGym();
  const [tab, setTab] = useState<TabKey>("7");
  const [reminderMember, setReminderMember] = useState<Member | null>(null);

  const maxDays = TABS.find((t) => t.key === tab)!.max;

  const grouped = useMemo(() => {
    const withDays = state.members
      .map((m) => ({ member: m, days: daysUntil(m.expiryDate) }))
      .filter((x) => x.days >= 0 && x.days <= maxDays)
      .sort((a, b) => a.days - b.days);

    const map = new Map<number, Member[]>();
    for (const item of withDays) {
      const list = map.get(item.days) ?? [];
      list.push(item.member);
      map.set(item.days, list);
    }
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [state.members, maxDays]);

  return (
    <div className="px-4 pt-5 md:px-8 md:pt-6">
      <h1 className="mb-4 text-2xl font-extrabold tracking-tight text-[var(--gym-text)]">Expiring Soon</h1>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              tab === t.key
                ? "border-[var(--gym-warning)] bg-[var(--gym-warning)] text-black"
                : "border-[var(--gym-border)] bg-[var(--gym-surface)] text-[var(--gym-text-muted)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {grouped.length === 0 ? (
        <EmptyState icon={PartyPopper} title="You're all caught up." description="No memberships are expiring in this window." />
      ) : (
        <div className="space-y-6">
          {grouped.map(([days, members]) => (
            <div key={days}>
              <h2 className={`mb-2.5 text-sm font-bold uppercase tracking-wide ${days === 0 ? "text-[var(--gym-danger)]" : "text-[var(--gym-warning)]"}`}>
                {groupLabel(days)}
              </h2>
              <div className="space-y-2.5 md:grid md:grid-cols-2 md:gap-3 md:space-y-0 xl:grid-cols-3">
                {members.map((member) => (
                  <div key={member.id} className="rounded-2xl border border-[var(--gym-border)] bg-[var(--gym-surface)] p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-[15px] font-bold text-[var(--gym-text)]">{member.name}</p>
                      <span className="text-sm font-bold text-[var(--gym-text)]">{formatCurrency(member.fee)}</span>
                    </div>
                    <p className={`mt-0.5 text-xs font-semibold ${days === 0 ? "text-[var(--gym-danger)]" : "text-[var(--gym-warning)]"}`}>
                      {days === 0 ? "Expires today" : `${days} day${days === 1 ? "" : "s"} remaining`}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => setReminderMember(member)}
                        className="flex-1 rounded-xl border border-[var(--gym-border)] bg-[var(--gym-surface-2)] py-2 text-xs font-semibold text-[var(--gym-text)] transition active:scale-[0.98]"
                      >
                        Remind
                      </button>
                      <Link
                        href={`/members/${member.id}/renew`}
                        className="flex-1 rounded-xl bg-[var(--gym-accent)] py-2 text-center text-xs font-bold text-black transition active:scale-[0.98]"
                      >
                        Renew
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <ReminderSheet key={reminderMember?.id ?? "none"} member={reminderMember} open={!!reminderMember} onClose={() => setReminderMember(null)} />
    </div>
  );
}
