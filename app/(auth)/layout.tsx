"use client";

import { LandingHeader } from "@/components/layout/LandingHeader";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // Background gradients for light and dark mode
  const backgroundStyle =
  theme === "light"
    ? {
        backgroundImage: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 50%, #ffffff 100%)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0% 0%",
        backgroundSize: "400% 400%",
      }
    : {
        backgroundImage: "linear-gradient(45deg, #1e293b 0%, #3b82f6 50%, #0f172a 100%)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0% 0%",
        backgroundSize: "400% 400%",
      };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 z-0 animate-gradient-xy opacity-30"
        style={backgroundStyle}
      ></div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <LandingHeader />

        {/* Centered auth form */}
        <main className="flex flex-1 items-center justify-center px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
