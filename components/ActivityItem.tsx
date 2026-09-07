import { CalendarPlus, CreditCard, RefreshCcw, UserPlus, XCircle, MessageCircle } from "lucide-react";
import type { ActivityEntry } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

const ICONS: Record<ActivityEntry["kind"], typeof CreditCard> = {
  renewal: RefreshCcw,
  payment: CreditCard,
  expired: XCircle,
  joined: UserPlus,
  reminder: MessageCircle,
};

const COLORS: Record<ActivityEntry["kind"], string> = {
  renewal: "text-[var(--gym-accent)] bg-[var(--gym-accent)]/10",
  payment: "text-[var(--gym-success)] bg-[var(--gym-success)]/10",
  expired: "text-[var(--gym-danger)] bg-[var(--gym-danger)]/10",
  joined: "text-[var(--gym-warning)] bg-[var(--gym-warning)]/10",
  reminder: "text-[var(--gym-text)] bg-[var(--gym-surface-2)]",
};

export function ActivityItem({ activity }: { activity: ActivityEntry }) {
  const Icon = ICONS[activity.kind] ?? CalendarPlus;
  return (
    <div className="flex items-start gap-3 py-2.5">
      <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${COLORS[activity.kind]}`}>
        <Icon size={15} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-[var(--gym-text)]">{activity.text}</p>
        <p className="mt-0.5 text-xs text-[var(--gym-text-muted)]">{timeAgo(activity.timestamp)}</p>
      </div>
    </div>
  );
}
