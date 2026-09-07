import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function KpiCard({
  icon: Icon,
  label,
  value,
  tone = "default",
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: "default" | "success" | "warning" | "danger" | "accent";
  href?: string;
}) {
  const toneColor =
    tone === "success"
      ? "text-[var(--gym-success)] bg-[var(--gym-success)]/10"
      : tone === "warning"
        ? "text-[var(--gym-warning)] bg-[var(--gym-warning)]/10"
        : tone === "danger"
          ? "text-[var(--gym-danger)] bg-[var(--gym-danger)]/10"
          : tone === "accent"
            ? "text-[var(--gym-accent)] bg-[var(--gym-accent)]/10"
            : "text-[var(--gym-text)] bg-[var(--gym-surface-2)]";

  const content = (
    <div className="rounded-2xl border border-[var(--gym-border)] bg-[var(--gym-surface)] p-4 transition active:scale-[0.98]">
      <span className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${toneColor}`}>
        <Icon size={18} />
      </span>
      <p className="text-2xl font-extrabold leading-none tracking-tight text-[var(--gym-text)]">{value}</p>
      <p className="mt-1.5 text-xs font-medium text-[var(--gym-text-muted)]">{label}</p>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
