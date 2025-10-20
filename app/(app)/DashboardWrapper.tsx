// app/(app)/DashboardWrapper.tsx
"use client";

import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { MobileSheet } from "@/components/layout/MobileSheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserButton } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

export function DashboardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <DesktopSidebar />
      <div className="flex flex-col md:pl-[220px] lg:pl-[280px]">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <MobileSheet />
          <div className="w-full flex-1"></div>
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
        <Toaster richColors />
      </div>
    </div>
  );
}
