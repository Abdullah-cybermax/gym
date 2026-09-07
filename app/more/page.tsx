"use client";

import Link from "next/link";
import { BarChart3, Bell, Clock, Settings, ChevronRight, Dumbbell } from "lucide-react";
import { useGym } from "@/lib/store";

const ITEMS = [
  { href: "/expiring", label: "Expiring Soon", icon: Clock, tone: "warning" as const },
  { href: "/reports", label: "Reports", icon: BarChart3, tone: "accent" as const },
  { href: "/notifications", label: "Notifications", icon: Bell, tone: "success" as const },
  { href: "/settings", label: "Settings", icon: Settings, tone: "default" as const },
];

export default function MorePage() {
  const { state } = useGym();
  const unread = state.notifications.filter((n) => !n.read).length;

  return (
    <div className="px-4 pt-5 md:hidden">
      <h1 className="mb-1 text-2xl font-extrabold tracking-tight text-[var(--gym-text)]">More</h1>
      <p className="mb-6 text-sm text-[var(--gym-text-muted)]">Everything else you need to run the gym.</p>

      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[var(--gym-border)] bg-[var(--gym-surface)] p-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--gym-accent)] text-black">
          <Dumbbell size={20} strokeWidth={2.5} />
        </span>
        <div>
          <p className="font-bold text-[var(--gym-text)]">{state.settings.gymName}</p>
          <p className="text-xs text-[var(--gym-text-muted)]">{state.settings.ownerName} &middot; Gym Owner</p>
        </div>
      </div>

      <div className="divide-y divide-[var(--gym-border)] overflow-hidden rounded-2xl border border-[var(--gym-border)] bg-[var(--gym-surface)]">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const color =
            item.tone === "warning"
              ? "text-[var(--gym-warning)] bg-[var(--gym-warning)]/10"
              : item.tone === "accent"
                ? "text-[var(--gym-accent)] bg-[var(--gym-accent)]/10"
                : item.tone === "success"
                  ? "text-[var(--gym-success)] bg-[var(--gym-success)]/10"
                  : "text-[var(--gym-text)] bg-[var(--gym-surface-2)]";
          return (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-3.5">
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
                <Icon size={17} />
              </span>
              <span className="flex-1 text-sm font-semibold text-[var(--gym-text)]">{item.label}</span>
              {item.href === "/notifications" && unread > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--gym-danger)] px-1.5 text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
              <ChevronRight size={16} className="text-[var(--gym-text-muted)]" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
