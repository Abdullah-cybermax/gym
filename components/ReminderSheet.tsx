"use client";

import { useState } from "react";
import { MessageCircle, Phone, Send } from "lucide-react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useToast } from "@/components/ui/Toast";
import { useGym } from "@/lib/store";
import { reminderTemplate } from "@/lib/utils";
import type { Member } from "@/lib/types";

// Parent components key this by member?.id, so a fresh instance mounts
// whenever the target member changes and this initializer re-runs.
export function ReminderSheet({ member, open, onClose }: { member: Member | null; open: boolean; onClose: () => void }) {
  const { addActivity } = useGym();
  const { showToast } = useToast();
  const [message, setMessage] = useState(() => (member ? reminderTemplate(member.name, member.expiryDate) : ""));
  const [sentVia, setSentVia] = useState<string | null>(null);

  if (!member) return null;

  const send = (channel: "WhatsApp" | "SMS" | "Call") => {
    setSentVia(channel);
    if (channel === "Call") {
      addActivity(`Called ${member.name} about their expiring membership`, "reminder");
      showToast(`Calling ${member.name}...`);
    } else {
      addActivity(`Reminder sent to ${member.name} via ${channel}`, "reminder");
      showToast(`Reminder prepared for ${member.name}.`);
    }
    window.setTimeout(onClose, 700);
  };

  return (
    <BottomSheet open={open} onClose={onClose} title={`Remind ${member.name.split(" ")[0]}`}>
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--gym-text-muted)]">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-xl border border-[var(--gym-border)] bg-[var(--gym-surface-2)] p-3 text-sm text-[var(--gym-text)] outline-none focus:border-[var(--gym-accent)]"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => send("WhatsApp")}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-[var(--gym-border)] bg-[var(--gym-surface-2)] py-3 text-xs font-semibold text-[var(--gym-text)] active:scale-95 transition"
          >
            <MessageCircle size={20} className="text-[var(--gym-success)]" />
            WhatsApp
          </button>
          <button
            onClick={() => send("SMS")}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-[var(--gym-border)] bg-[var(--gym-surface-2)] py-3 text-xs font-semibold text-[var(--gym-text)] active:scale-95 transition"
          >
            <Send size={20} className="text-[var(--gym-accent)]" />
            SMS
          </button>
          <button
            onClick={() => send("Call")}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-[var(--gym-border)] bg-[var(--gym-surface-2)] py-3 text-xs font-semibold text-[var(--gym-text)] active:scale-95 transition"
          >
            <Phone size={20} className="text-[var(--gym-warning)]" />
            Call
          </button>
        </div>
        {sentVia && (
          <p className="text-center text-sm font-semibold text-[var(--gym-success)]">
            {sentVia === "Call" ? "Calling…" : `Reminder prepared for ${member.name}.`}
          </p>
        )}
      </div>
    </BottomSheet>
  );
}
