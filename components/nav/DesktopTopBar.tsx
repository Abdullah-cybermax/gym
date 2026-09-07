"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Bell, Search } from "lucide-react";
import { useGym } from "@/lib/store";

export function DesktopTopBar() {
  const { state } = useGym();
  const unread = state.notifications.filter((n) => !n.read).length;
  const router = useRouter();
  const [q, setQ] = useState("");

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    router.push(`/members?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-30 hidden items-center justify-between gap-4 border-b border-[var(--gym-border)] bg-[var(--gym-bg)]/95 px-8 py-4 backdrop-blur md:flex">
      <form onSubmit={onSearch} className="relative w-full max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--gym-text-muted)]" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, phone number..."
          className="w-full rounded-xl border border-[var(--gym-border)] bg-[var(--gym-surface)] py-2.5 pl-9 pr-3 text-sm text-[var(--gym-text)] outline-none focus:border-[var(--gym-accent)]"
        />
      </form>
      <Link
        href="/notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gym-surface)] text-[var(--gym-text-muted)] transition hover:text-[var(--gym-text)]"
      >
        <Bell size={18} />
        {unread > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--gym-danger)]" />}
      </Link>
    </header>
  );
}
