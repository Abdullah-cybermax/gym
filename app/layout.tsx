import type { Metadata, Viewport } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "./globals.css";
import { GymStoreProvider } from "@/lib/store";
import { ToastProvider } from "@/components/ui/Toast";
import { Sidebar } from "@/components/nav/Sidebar";
import { TopBar } from "@/components/nav/TopBar";
import { DesktopTopBar } from "@/components/nav/DesktopTopBar";
import { BottomNav } from "@/components/nav/BottomNav";

export const metadata: Metadata = {
  title: {
    default: "Iron Peak Fitness | Membership Dashboard",
    template: "%s | Iron Peak Fitness",
  },
  description: "Gym membership and subscription management dashboard — track active members, renewals, payments and expiring memberships.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0b0c",
};

export default function GymRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="gym-app">
        <GymStoreProvider>
          <ToastProvider>
            <Sidebar />
            <div className="md:pl-64">
              <TopBar />
              <DesktopTopBar />
              <main className="mx-auto min-h-[calc(100dvh-3.5rem)] max-w-6xl pb-24 md:pb-10">{children}</main>
            </div>
            <BottomNav />
          </ToastProvider>
        </GymStoreProvider>
      </body>
    </html>
  );
}
