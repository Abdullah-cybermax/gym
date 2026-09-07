import type { Plan, Member, MembershipStatus, EquipmentCategory, EquipmentCondition } from "./types";

export const PLAN_MONTHS: Record<Plan, number> = {
  Monthly: 1,
  "3 Months": 3,
  "6 Months": 6,
  Yearly: 12,
};

export const PLAN_FEES: Record<Plan, number> = {
  Monthly: 5000,
  "3 Months": 12000,
  "6 Months": 20000,
  Yearly: 45000,
};

export const PLANS: Plan[] = ["Monthly", "3 Months", "6 Months", "Yearly"];

export const EQUIPMENT_CATEGORIES: EquipmentCategory[] = ["Cardio", "Strength Machines", "Free Weights", "Accessories", "Other"];

export const EQUIPMENT_CONDITIONS: EquipmentCondition[] = ["Good", "Needs Repair", "Out of Service"];

export function addDays(date: Date | string, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function addMonths(date: Date | string, months: number): Date {
  const d = new Date(date);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + months);
  const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, daysInMonth));
  return d;
}

function stripTime(date: Date | string): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function daysUntil(expiry: Date | string, today: Date = new Date()): number {
  const diff = stripTime(expiry) - stripTime(today);
  return Math.round(diff / 86400000);
}

export function getMembershipStatus(
  expiry: Date | string,
  today: Date = new Date()
): { status: MembershipStatus; daysRemaining: number } {
  const daysRemaining = daysUntil(expiry, today);
  if (daysRemaining < 0) return { status: "expired", daysRemaining };
  if (daysRemaining <= 7) return { status: "expiring", daysRemaining };
  return { status: "active", daysRemaining };
}

export function statusLabel(status: MembershipStatus, daysRemaining: number): string {
  if (status === "expired") {
    const overdue = Math.abs(daysRemaining);
    return overdue === 0 ? "Expired today" : `Expired ${overdue} day${overdue === 1 ? "" : "s"} ago`;
  }
  if (daysRemaining === 0) return "Expires today";
  if (daysRemaining === 1) return "Expires in 1 day";
  return `Expires in ${daysRemaining} days`;
}

export function formatCurrency(amount: number): string {
  return `Rs. ${Math.round(amount).toLocaleString("en-US")}`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateInput(date: Date | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function timeAgo(timestamp: string, now: Date = new Date()): string {
  const then = new Date(timestamp).getTime();
  const diffMs = now.getTime() - then;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(timestamp);
}

export function computeMembershipDuration(member: Member): { totalDays: number; elapsedDays: number; progress: number } {
  const totalDays = Math.max(1, daysUntil(member.expiryDate, new Date(member.startDate)));
  const elapsedDays = Math.max(0, daysUntil(new Date(), new Date(member.startDate)));
  const progress = Math.min(1, Math.max(0, elapsedDays / totalDays));
  return { totalDays, elapsedDays, progress };
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function formatPhoneDisplay(phone: string): string {
  return phone;
}

export function reminderTemplate(name: string, expiry: Date | string): string {
  const firstName = name.split(" ")[0];
  return `Hi ${firstName}, your gym membership expires on ${formatDate(expiry)}. Please renew your membership to continue your workouts. Thank you!`;
}
