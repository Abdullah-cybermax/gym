export type Gender = "Male" | "Female" | "Other";

export type Plan = "Monthly" | "3 Months" | "6 Months" | "Yearly";

export type PaymentMethod = "Cash" | "Bank Transfer" | "Other";

export type PaymentStatus = "Paid" | "Partial" | "Pending";

export type MembershipStatus = "active" | "expiring" | "expired";

export type PaymentType = "New Membership" | "Renewal" | "Payment";

export interface PaymentRecord {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  type: PaymentType;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  gender: Gender;
  dob?: string;
  address?: string;
  photoUrl?: string;
  notes?: string;
  memberSince: string;
  plan: Plan;
  startDate: string;
  expiryDate: string;
  fee: number;
  amountPaid: number;
  paymentStatus: PaymentStatus;
  lastPaymentAmount: number;
  lastPaymentDate: string;
  lastPaymentMethod: PaymentMethod;
  paymentHistory: PaymentRecord[];
}

export type ActivityKind = "renewal" | "payment" | "expired" | "joined" | "reminder";

export interface ActivityEntry {
  id: string;
  text: string;
  timestamp: string;
  kind: ActivityKind;
}

export type NotificationKind = "expiring" | "expired" | "payment" | "info";

export interface NotificationEntry {
  id: string;
  text: string;
  timestamp: string;
  read: boolean;
  kind: NotificationKind;
}

export interface GymSettings {
  gymName: string;
  gymLogo?: string;
  ownerName: string;
  phone: string;
  currency: "PKR";
  reminderMessage: string;
  notifyExpiring: boolean;
  notifyPayments: boolean;
}

export interface GymState {
  members: Member[];
  payments: PaymentRecord[];
  activity: ActivityEntry[];
  notifications: NotificationEntry[];
  settings: GymSettings;
  hydrated: boolean;
}
