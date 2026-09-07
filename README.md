# Gym Membership Dashboard

A mobile-first gym membership and subscription management prototype, built for a local gym owner who currently tracks members on paper and in spreadsheets.

## What it does

- **Dashboard** — active/expiring/expired counts, today's collections, an expiring-membership alert list, quick actions, recent activity, and a membership overview bar.
- **Members** — searchable/filterable directory, member detail with a countdown progress bar and payment history, add/edit/delete.
- **Renewals & Payments** — fast renew and record-payment flows that update expiry dates, payment history, and dashboard counts immediately.
- **Expiring Soon** — Today / 3 / 7 / 30-day tabs grouped by urgency, with a WhatsApp / SMS / Call reminder sheet and an editable pre-written message.
- **Payments, Reports, Notifications, Settings** — payment history with summaries and filters, a simple revenue chart, a notification center, and gym/owner settings.

Status logic: **Active** (>7 days to expiry), **Expiring Soon** (0–7 days), **Expired** (past due) — shown with both color and text, never color alone.

## Design

Dark charcoal foundation with an electric lime accent, bold typography, bordered cards, no gradients or glassmorphism — built to read as a real gym operations tool rather than a generic AI dashboard. Bottom navigation + a floating Add Member action on mobile, a sidebar on desktop, same visual language on both.

## Data

State lives in a client-side React context backed by `localStorage`, seeded with 20 realistic members (Pakistani names/phone numbers, PKR currency) spread across active, expiring, and expired statuses. Every action — adding a member, recording a payment, renewing a membership — updates counts and activity across every screen immediately. This is a prototype: there is no backend or auth.

## Stack

Next.js (App Router) · React 19 · TypeScript · Tailwind CSS v4 · lucide-react

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.
