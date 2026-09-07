import type {
  ActivityEntry,
  EquipmentCategory,
  EquipmentCondition,
  GymSettings,
  InventoryItem,
  Member,
  NotificationEntry,
  PaymentRecord,
  Plan,
  PaymentMethod,
} from "./types";
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

interface EquipmentSeed {
  name: string;
  category: EquipmentCategory;
  quantity: number;
  condition: EquipmentCondition;
  location: string;
  purchasedMonthsAgo: number;
  lastServiceMonthsAgo?: number;
  notes?: string;
}

const EQUIPMENT_SEEDS: EquipmentSeed[] = [
  { name: "Treadmill", category: "Cardio", quantity: 4, condition: "Good", location: "Cardio Zone", purchasedMonthsAgo: 14, lastServiceMonthsAgo: 1 },
  { name: "Elliptical Trainer", category: "Cardio", quantity: 3, condition: "Good", location: "Cardio Zone", purchasedMonthsAgo: 14, lastServiceMonthsAgo: 2 },
  { name: "Stationary Bike", category: "Cardio", quantity: 5, condition: "Needs Repair", location: "Cardio Zone", purchasedMonthsAgo: 20, lastServiceMonthsAgo: 5, notes: "Unit #3 seat post is loose" },
  { name: "Rowing Machine", category: "Cardio", quantity: 2, condition: "Good", location: "Cardio Zone", purchasedMonthsAgo: 9, lastServiceMonthsAgo: 1 },
  { name: "Smith Machine", category: "Strength Machines", quantity: 1, condition: "Good", location: "Strength Floor", purchasedMonthsAgo: 18, lastServiceMonthsAgo: 3 },
  { name: "Leg Press Machine", category: "Strength Machines", quantity: 1, condition: "Good", location: "Strength Floor", purchasedMonthsAgo: 18, lastServiceMonthsAgo: 3 },
  { name: "Cable Crossover Machine", category: "Strength Machines", quantity: 1, condition: "Out of Service", location: "Strength Floor", purchasedMonthsAgo: 24, lastServiceMonthsAgo: 6, notes: "Cable snapped, waiting on replacement part" },
  { name: "Lat Pulldown Machine", category: "Strength Machines", quantity: 1, condition: "Good", location: "Strength Floor", purchasedMonthsAgo: 12, lastServiceMonthsAgo: 2 },
  { name: "Chest Press Machine", category: "Strength Machines", quantity: 1, condition: "Good", location: "Strength Floor", purchasedMonthsAgo: 12, lastServiceMonthsAgo: 2 },
  { name: "Squat Rack", category: "Free Weights", quantity: 3, condition: "Good", location: "Free Weights Area", purchasedMonthsAgo: 16 },
  { name: "Flat Bench", category: "Free Weights", quantity: 6, condition: "Good", location: "Free Weights Area", purchasedMonthsAgo: 16 },
  { name: "Dumbbell Set (2.5–50kg)", category: "Free Weights", quantity: 1, condition: "Good", location: "Free Weights Area", purchasedMonthsAgo: 16 },
  { name: "Olympic Barbell Set", category: "Free Weights", quantity: 8, condition: "Needs Repair", location: "Free Weights Area", purchasedMonthsAgo: 22, lastServiceMonthsAgo: 8, notes: "One bar bent, needs replacing" },
  { name: "Kettlebell Set (4–24kg)", category: "Free Weights", quantity: 1, condition: "Good", location: "Free Weights Area", purchasedMonthsAgo: 10 },
  { name: "Yoga Mats", category: "Accessories", quantity: 20, condition: "Good", location: "Studio Room", purchasedMonthsAgo: 6 },
  { name: "Resistance Bands Set", category: "Accessories", quantity: 15, condition: "Good", location: "Free Weights Area", purchasedMonthsAgo: 4 },
];

function buildEquipment(seed: EquipmentSeed, index: number, today: Date): InventoryItem {
  const purchaseDate = addMonths(today, -seed.purchasedMonthsAgo);
  const maintenanceHistory: InventoryItem["maintenanceHistory"] = [];

  if (seed.lastServiceMonthsAgo !== undefined) {
    const lastServiceDate = addMonths(today, -seed.lastServiceMonthsAgo);
    maintenanceHistory.push({
      id: uid("maint"),
      date: lastServiceDate.toISOString(),
      note: seed.condition === "Good" ? "Routine inspection and servicing" : seed.notes ?? "Reported fault during inspection",
      condition: seed.condition,
    });
    if (seed.lastServiceMonthsAgo > 3) {
      maintenanceHistory.unshift({
        id: uid("maint"),
        date: addMonths(lastServiceDate, -3).toISOString(),
        note: "Routine inspection and servicing",
        condition: "Good",
      });
    }
  }

  return {
    id: uid(`equip${index}`),
    name: seed.name,
    category: seed.category,
    quantity: seed.quantity,
    condition: seed.condition,
    location: seed.location,
    purchaseDate: purchaseDate.toISOString(),
    lastServiceDate: maintenanceHistory[maintenanceHistory.length - 1]?.date,
    notes: seed.condition !== "Good" ? seed.notes : undefined,
    maintenanceHistory,
  };
}

export function generateSeedData(): {
  members: Member[];
  payments: PaymentRecord[];
  activity: ActivityEntry[];
  notifications: NotificationEntry[];
  settings: GymSettings;
  inventory: InventoryItem[];
} {
  const today = new Date();
  const members: Member[] = [];
  const payments: PaymentRecord[] = [];

  SEEDS.forEach((seed, index) => {
    const { member, payments: memberPayments } = buildMember(seed, index, today);
    members.push(member);
    payments.push(...memberPayments);
  });

  const inventory: InventoryItem[] = EQUIPMENT_SEEDS.map((seed, index) => buildEquipment(seed, index, today));

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
    { id: uid("act"), text: "Cable Crossover Machine flagged out of service", timestamp: addDays(today, -3).toISOString(), kind: "equipment" },
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
    ...(() => {
      const needsAttention = inventory.filter((i) => i.condition !== "Good").length;
      return needsAttention > 0
        ? [
            {
              id: uid("ntf"),
              text: `${needsAttention} piece${needsAttention === 1 ? "" : "s"} of equipment need${needsAttention === 1 ? "s" : ""} attention.`,
              timestamp: addDays(today, -3).toISOString(),
              read: false,
              kind: "equipment" as const,
            },
          ]
        : [];
    })(),
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

  return { members, payments, activity, notifications, settings, inventory };
}
