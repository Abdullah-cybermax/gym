import type { ActivityEntry, GymSettings, Member, NotificationEntry, PaymentRecord, Plan, PaymentMethod } from "./types";
import { addDays, addMonths, PLAN_FEES, PLAN_MONTHS, daysUntil, formatCurrency, getMembershipStatus, uid } from "./utils";

interface Seed {
  name: string;
  phone: string;
  gender: Member["gender"];
  plan: Plan;
  expiryOffsetDays: number;
  method: PaymentMethod;
  paymentStatus: Member["paymentStatus"];
  memberSinceMonthsAgo: number;
  notes?: string;
  dob?: string;
  address?: string;
}

const SEEDS: Seed[] = [
  { name: "Ahmed Khan", phone: "+92 300 1234567", gender: "Male", plan: "Monthly", expiryOffsetDays: 2, method: "Cash", paymentStatus: "Paid", memberSinceMonthsAgo: 8, notes: "Prefers evening workouts" },
  { name: "Bilal Ahmed", phone: "+92 301 2345678", gender: "Male", plan: "Monthly", expiryOffsetDays: 15, method: "Bank Transfer", paymentStatus: "Paid", memberSinceMonthsAgo: 5 },
  { name: "Usman Ali", phone: "+92 302 3456789", gender: "Male", plan: "3 Months", expiryOffsetDays: 45, method: "Cash", paymentStatus: "Paid", memberSinceMonthsAgo: 11 },
  { name: "Hamza Malik", phone: "+92 303 4567890", gender: "Male", plan: "Monthly", expiryOffsetDays: -3, method: "Cash", paymentStatus: "Pending", memberSinceMonthsAgo: 3, notes: "Wants a payment reminder call" },
  { name: "Hassan Raza", phone: "+92 304 5678901", gender: "Male", plan: "Yearly", expiryOffsetDays: 200, method: "Bank Transfer", paymentStatus: "Paid", memberSinceMonthsAgo: 14 },
  { name: "Muhammad Abdullah", phone: "+92 305 6789012", gender: "Male", plan: "Monthly", expiryOffsetDays: 0, method: "Cash", paymentStatus: "Pending", memberSinceMonthsAgo: 2 },
  { name: "Ali Hassan", phone: "+92 306 7890123", gender: "Male", plan: "6 Months", expiryOffsetDays: 120, method: "Cash", paymentStatus: "Paid", memberSinceMonthsAgo: 7 },
  { name: "Saad Ahmed", phone: "+92 307 8901234", gender: "Male", plan: "Monthly", expiryOffsetDays: 6, method: "Cash", paymentStatus: "Partial", memberSinceMonthsAgo: 4 },
  { name: "Zain Khan", phone: "+92 308 9012345", gender: "Male", plan: "Monthly", expiryOffsetDays: -10, method: "Cash", paymentStatus: "Pending", memberSinceMonthsAgo: 6 },
  { name: "Talha Mahmood", phone: "+92 309 0123456", gender: "Male", plan: "3 Months", expiryOffsetDays: 60, method: "Bank Transfer", paymentStatus: "Paid", memberSinceMonthsAgo: 9 },
  { name: "Omer Farooq", phone: "+92 321 1234567", gender: "Male", plan: "Monthly", expiryOffsetDays: 1, method: "Cash", paymentStatus: "Paid", memberSinceMonthsAgo: 3 },
  { name: "Ahsan Sheikh", phone: "+92 322 2345678", gender: "Male", plan: "Yearly", expiryOffsetDays: 300, method: "Bank Transfer", paymentStatus: "Paid", memberSinceMonthsAgo: 1 },
  { name: "Abdullah Shah", phone: "+92 323 3456789", gender: "Male", plan: "Monthly", expiryOffsetDays: -1, method: "Cash", paymentStatus: "Pending", memberSinceMonthsAgo: 5 },
  { name: "Danish Iqbal", phone: "+92 331 4567890", gender: "Male", plan: "6 Months", expiryOffsetDays: 90, method: "Cash", paymentStatus: "Paid", memberSinceMonthsAgo: 13 },
  { name: "Fahad Khan", phone: "+92 332 5678901", gender: "Male", plan: "Monthly", expiryOffsetDays: 4, method: "Cash", paymentStatus: "Paid", memberSinceMonthsAgo: 2 },
  { name: "Kamran Yousaf", phone: "+92 333 6789012", gender: "Male", plan: "3 Months", expiryOffsetDays: -5, method: "Cash", paymentStatus: "Pending", memberSinceMonthsAgo: 10 },
  { name: "Waqas Anwar", phone: "+92 340 7890123", gender: "Male", plan: "Monthly", expiryOffsetDays: 3, method: "Bank Transfer", paymentStatus: "Paid", memberSinceMonthsAgo: 6 },
  { name: "Imran Sultan", phone: "+92 341 8901234", gender: "Male", plan: "Yearly", expiryOffsetDays: 250, method: "Cash", paymentStatus: "Paid", memberSinceMonthsAgo: 16 },
  { name: "Noman Aziz", phone: "+92 342 9012345", gender: "Male", plan: "Monthly", expiryOffsetDays: 7, method: "Cash", paymentStatus: "Partial", memberSinceMonthsAgo: 4 },
  { name: "Sana Malik", phone: "+92 345 0123456", gender: "Female", plan: "3 Months", expiryOffsetDays: 70, method: "Bank Transfer", paymentStatus: "Paid", memberSinceMonthsAgo: 3, notes: "Attends morning classes" },
];

function buildMember(seed: Seed, index: number, today: Date): { member: Member; payments: PaymentRecord[] } {
  const expiryDate = addDays(today, seed.expiryOffsetDays);
  const months = PLAN_MONTHS[seed.plan];
  const startDate = addMonths(expiryDate, -months);
  const memberSince = addMonths(today, -seed.memberSinceMonthsAgo);
  const fee = PLAN_FEES[seed.plan];
  const memberId = uid(`mem${index}`);

  const payments: PaymentRecord[] = [];
  const cyclesAvailable = Math.max(1, Math.floor(seed.memberSinceMonthsAgo / months));
  const historyCount = Math.min(4, Math.max(1, cyclesAvailable));
  for (let i = historyCount - 1; i >= 0; i--) {
    const paymentDate = addMonths(startDate, -i * months);
    payments.push({
      id: uid("pay"),
      memberId,
      memberName: seed.name,
      amount: fee,
      method: i === historyCount - 1 ? seed.method : Math.random() > 0.7 ? "Bank Transfer" : "Cash",
      date: paymentDate.toISOString(),
      type: i === 0 ? "Renewal" : "Renewal",
    });
  }
  if (payments.length > 0) {
    if (seed.paymentStatus === "Pending") {
      // Nothing has been collected for the current cycle yet — drop it so
      // payment history only reflects money actually received.
      payments.pop();
    } else {
      payments[payments.length - 1] = {
        ...payments[payments.length - 1],
        date: startDate.toISOString(),
        amount: seed.paymentStatus === "Partial" ? Math.round(fee * 0.5) : fee,
        method: seed.method,
      };
    }
  }

  const amountPaid = seed.paymentStatus === "Paid" ? fee : seed.paymentStatus === "Partial" ? Math.round(fee * 0.5) : 0;
  const lastPayment = payments[payments.length - 1];

  const member: Member = {
    id: memberId,
    name: seed.name,
    phone: seed.phone,
    gender: seed.gender,
    dob: seed.dob,
    address: seed.address,
    notes: seed.notes,
    memberSince: memberSince.toISOString(),
    plan: seed.plan,
    startDate: startDate.toISOString(),
    expiryDate: expiryDate.toISOString(),
    fee,
    amountPaid,
    paymentStatus: seed.paymentStatus,
    lastPaymentAmount: lastPayment ? lastPayment.amount : 0,
    lastPaymentDate: lastPayment ? lastPayment.date : startDate.toISOString(),
    lastPaymentMethod: seed.method,
    paymentHistory: payments,
  };

  return { member, payments };
}

export function generateSeedData(): {
  members: Member[];
  payments: PaymentRecord[];
  activity: ActivityEntry[];
  notifications: NotificationEntry[];
  settings: GymSettings;
} {
  const today = new Date();
  const members: Member[] = [];
  const payments: PaymentRecord[] = [];

  SEEDS.forEach((seed, index) => {
    const { member, payments: memberPayments } = buildMember(seed, index, today);
    members.push(member);
    payments.push(...memberPayments);
  });

  // A few payments dated earlier today so Today's Collections is never empty.
  const todaysPayers = members.slice(0, 3);
  const hoursAgo = [0.5, 2, 4];
  todaysPayers.forEach((m, i) => {
    const record: PaymentRecord = {
      id: uid("pay"),
      memberId: m.id,
      memberName: m.name,
      amount: i === 1 ? Math.round(m.fee / 2) : m.fee,
      method: i === 2 ? "Bank Transfer" : "Cash",
      date: new Date(today.getTime() - hoursAgo[i] * 60 * 60000).toISOString(),
      type: "Renewal",
    };
    payments.push(record);
  });
  payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const activity: ActivityEntry[] = [
    { id: uid("act"), text: "Ahmed Khan renewed membership", timestamp: addDays(today, 0).toISOString(), kind: "renewal" },
    { id: uid("act"), text: "Bilal Ahmed paid Rs. 5,000", timestamp: new Date(Date.now() - 60 * 60000).toISOString(), kind: "payment" },
    { id: uid("act"), text: "Hamza Malik's membership expired", timestamp: new Date(Date.now() - 3 * 60 * 60000).toISOString(), kind: "expired" },
    { id: uid("act"), text: "Usman Khan joined the gym", timestamp: addDays(today, -1).toISOString(), kind: "joined" },
    { id: uid("act"), text: "Sana Malik paid Rs. 12,000", timestamp: addDays(today, -1).toISOString(), kind: "payment" },
    { id: uid("act"), text: "Zain Khan's membership expired", timestamp: addDays(today, -2).toISOString(), kind: "expired" },
  ];

  const expiringCount = members.filter((m) => getMembershipStatus(m.expiryDate, today).status === "expiring").length;
  const expiringTomorrow = members.filter((m) => daysUntil(m.expiryDate, today) === 1).length;
  const expiredCount = members.filter((m) => getMembershipStatus(m.expiryDate, today).status === "expired").length;
  const pendingAmount = members.reduce((sum, m) => sum + Math.max(0, m.fee - m.amountPaid), 0);
  const expiringTodayMember = members.find((m) => daysUntil(m.expiryDate, today) === 0);

  const notifications: NotificationEntry[] = [
    { id: uid("ntf"), text: `${expiringCount} memberships expire this week.`, timestamp: new Date(Date.now() - 30 * 60000).toISOString(), read: false, kind: "expiring" },
    { id: uid("ntf"), text: `${expiringTomorrow} membership${expiringTomorrow === 1 ? "" : "s"} expire tomorrow.`, timestamp: new Date(Date.now() - 90 * 60000).toISOString(), read: false, kind: "expiring" },
    { id: uid("ntf"), text: `${expiredCount} memberships have expired.`, timestamp: addDays(today, -1).toISOString(), read: false, kind: "expired" },
    { id: uid("ntf"), text: `${formatCurrency(pendingAmount)} in pending payments.`, timestamp: addDays(today, -1).toISOString(), read: true, kind: "payment" },
    ...(expiringTodayMember
      ? [{ id: uid("ntf"), text: `${expiringTodayMember.name}'s membership expires today.`, timestamp: new Date(Date.now() - 4 * 60 * 60000).toISOString(), read: false, kind: "expiring" as const }]
      : []),
  ];

  const settings: GymSettings = {
    gymName: "Iron Peak Fitness",
    ownerName: "Admin",
    phone: "+92 300 0000000",
    currency: "PKR",
    reminderMessage: "Hi {name}, your gym membership expires on {date}. Please renew your membership to continue your workouts. Thank you!",
    notifyExpiring: true,
    notifyPayments: true,
  };

  return { members, payments, activity, notifications, settings };
}
