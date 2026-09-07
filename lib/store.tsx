"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type {
  ActivityEntry,
  GymSettings,
  GymState,
  Member,
  PaymentMethod,
  PaymentRecord,
  PaymentStatus,
  Plan,
} from "./types";
import { generateSeedData } from "./seed";
import { PLAN_MONTHS, addMonths, formatCurrency, formatDate, getMembershipStatus, uid } from "./utils";

const STORAGE_KEY = "gym-store-v1";

function loadPersisted(): GymState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GymState;
    if (!parsed.members || !parsed.settings) return null;
    return parsed;
  } catch {
    return null;
  }
}

function freshState(): GymState {
  const seed = generateSeedData();
  return { ...seed, hydrated: true };
}

interface AddMemberInput {
  name: string;
  phone: string;
  gender: Member["gender"];
  dob?: string;
  address?: string;
  notes?: string;
  plan: Plan;
  startDate: string;
  expiryDate: string;
  fee: number;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
}

interface GymApi {
  state: GymState;
  addMember: (input: AddMemberInput) => Member;
  recordPayment: (memberId: string, amount: number, method: PaymentMethod) => void;
  renewMembership: (memberId: string, plan: Plan, fee: number, newExpiry: string, paymentStatus: PaymentStatus, method: PaymentMethod) => void;
  deleteMember: (memberId: string) => void;
  updateMemberProfile: (memberId: string, updates: Partial<Pick<Member, "name" | "phone" | "gender" | "dob" | "address" | "notes">>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateSettings: (settings: Partial<GymSettings>) => void;
  addActivity: (text: string, kind: ActivityEntry["kind"]) => void;
  resetDemoData: () => void;
}

const GymContext = createContext<GymApi | null>(null);

export function GymStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GymState>(() => ({
    members: [],
    payments: [],
    activity: [],
    notifications: [],
    settings: {
      gymName: "Iron Peak Fitness",
      ownerName: "Admin",
      phone: "",
      currency: "PKR",
      reminderMessage: "Hi {name}, your gym membership expires on {date}. Please renew your membership to continue your workouts. Thank you!",
      notifyExpiring: true,
      notifyPayments: true,
    },
    hydrated: false,
  }));
  const hydratedFromStorage = useRef(false);

  useEffect(() => {
    if (hydratedFromStorage.current) return;
    hydratedFromStorage.current = true;
    const persisted = loadPersisted();
    setState(persisted ?? freshState());
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addActivity = useCallback((text: string, kind: ActivityEntry["kind"]) => {
    setState((prev) => ({
      ...prev,
      activity: [{ id: uid("act"), text, timestamp: new Date().toISOString(), kind }, ...prev.activity].slice(0, 50),
    }));
  }, []);

  const addMember = useCallback((input: AddMemberInput): Member => {
    const memberId = uid("mem");
    const now = new Date().toISOString();
    const initialPayment: PaymentRecord | null =
      input.amountPaid > 0
        ? {
            id: uid("pay"),
            memberId,
            memberName: input.name,
            amount: input.amountPaid,
            method: input.paymentMethod,
            date: now,
            type: "New Membership",
          }
        : null;

    const member: Member = {
      id: memberId,
      name: input.name,
      phone: input.phone,
      gender: input.gender,
      dob: input.dob,
      address: input.address,
      notes: input.notes,
      memberSince: now,
      plan: input.plan,
      startDate: input.startDate,
      expiryDate: input.expiryDate,
      fee: input.fee,
      amountPaid: input.amountPaid,
      paymentStatus: input.paymentStatus,
      lastPaymentAmount: input.amountPaid,
      lastPaymentDate: now,
      lastPaymentMethod: input.paymentMethod,
      paymentHistory: initialPayment ? [initialPayment] : [],
    };

    setState((prev) => ({
      ...prev,
      members: [member, ...prev.members],
      payments: initialPayment ? [initialPayment, ...prev.payments] : prev.payments,
    }));
    addActivity(`${input.name} joined the gym`, "joined");
    return member;
  }, [addActivity]);

  const recordPayment = useCallback((memberId: string, amount: number, method: PaymentMethod) => {
    setState((prev) => {
      const member = prev.members.find((m) => m.id === memberId);
      if (!member) return prev;
      const now = new Date().toISOString();
      const totalPaid = member.amountPaid + amount;
      const paymentStatus: PaymentStatus = totalPaid >= member.fee ? "Paid" : totalPaid > 0 ? "Partial" : "Pending";
      const record: PaymentRecord = {
        id: uid("pay"),
        memberId,
        memberName: member.name,
        amount,
        method,
        date: now,
        type: "Payment",
      };
      const updatedMember: Member = {
        ...member,
        amountPaid: totalPaid,
        paymentStatus,
        lastPaymentAmount: amount,
        lastPaymentDate: now,
        lastPaymentMethod: method,
        paymentHistory: [record, ...member.paymentHistory],
      };
      return {
        ...prev,
        members: prev.members.map((m) => (m.id === memberId ? updatedMember : m)),
        payments: [record, ...prev.payments],
      };
    });
    const member = state.members.find((m) => m.id === memberId);
    addActivity(`${member ? member.name : "A member"} paid ${formatCurrency(amount)}`, "payment");
  }, [addActivity, state.members]);

  const renewMembership = useCallback(
    (memberId: string, plan: Plan, fee: number, newExpiry: string, paymentStatus: PaymentStatus, method: PaymentMethod) => {
      setState((prev) => {
        const member = prev.members.find((m) => m.id === memberId);
        if (!member) return prev;
        const now = new Date().toISOString();
        const amountPaid = paymentStatus === "Paid" ? fee : paymentStatus === "Partial" ? Math.round(fee / 2) : 0;
        const record: PaymentRecord = {
          id: uid("pay"),
          memberId,
          memberName: member.name,
          amount: amountPaid,
          method,
          date: now,
          type: "Renewal",
        };
        const updatedMember: Member = {
          ...member,
          plan,
          startDate: now,
          expiryDate: newExpiry,
          fee,
          amountPaid,
          paymentStatus,
          lastPaymentAmount: amountPaid,
          lastPaymentDate: now,
          lastPaymentMethod: method,
          paymentHistory: amountPaid > 0 ? [record, ...member.paymentHistory] : member.paymentHistory,
        };
        return {
          ...prev,
          members: prev.members.map((m) => (m.id === memberId ? updatedMember : m)),
          payments: amountPaid > 0 ? [record, ...prev.payments] : prev.payments,
        };
      });
      const member = state.members.find((m) => m.id === memberId);
      addActivity(`${member ? member.name : "A member"} renewed membership`, "renewal");
    },
    [addActivity, state.members]
  );

  const deleteMember = useCallback((memberId: string) => {
    setState((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== memberId),
    }));
  }, []);

  const updateMemberProfile = useCallback(
    (memberId: string, updates: Partial<Pick<Member, "name" | "phone" | "gender" | "dob" | "address" | "notes">>) => {
      setState((prev) => ({
        ...prev,
        members: prev.members.map((m) => (m.id === memberId ? { ...m, ...updates } : m)),
      }));
    },
    []
  );

  const markNotificationRead = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  const updateSettings = useCallback((settings: Partial<GymSettings>) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, ...settings } }));
  }, []);

  const resetDemoData = useCallback(() => {
    setState(freshState());
  }, []);

  const value = useMemo<GymApi>(
    () => ({
      state,
      addMember,
      recordPayment,
      renewMembership,
      deleteMember,
      updateMemberProfile,
      markNotificationRead,
      markAllNotificationsRead,
      updateSettings,
      addActivity,
      resetDemoData,
    }),
    [
      state,
      addMember,
      recordPayment,
      renewMembership,
      deleteMember,
      updateMemberProfile,
      markNotificationRead,
      markAllNotificationsRead,
      updateSettings,
      addActivity,
      resetDemoData,
    ]
  );

  return <GymContext.Provider value={value}>{children}</GymContext.Provider>;
}

export function useGym(): GymApi {
  const ctx = useContext(GymContext);
  if (!ctx) throw new Error("useGym must be used within GymStoreProvider");
  return ctx;
}

// ---- Derived selectors ----

export function useMemberStatus(member: Member) {
  return getMembershipStatus(member.expiryDate);
}

export function useDashboardStats() {
  const { state } = useGym();
  return useMemo(() => {
    let active = 0;
    let expiringSoon = 0;
    let expired = 0;
    for (const m of state.members) {
      const { status } = getMembershipStatus(m.expiryDate);
      if (status === "active") active++;
      else if (status === "expiring") expiringSoon++;
      else expired++;
    }
    const todayStr = formatDate(new Date());
    const todaysCollections = state.payments
      .filter((p) => formatDate(p.date) === todayStr)
      .reduce((sum, p) => sum + p.amount, 0);

    const pending = state.members
      .filter((m) => m.paymentStatus !== "Paid")
      .reduce((sum, m) => sum + (m.fee - m.amountPaid), 0);

    return { active, expiringSoon, expired, todaysCollections, pending, total: state.members.length };
  }, [state.members, state.payments]);
}

export function computeExpiry(plan: Plan, startDate: string): string {
  return addMonths(startDate, PLAN_MONTHS[plan]).toISOString();
}
