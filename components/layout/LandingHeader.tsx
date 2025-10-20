"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function LandingHeader() {
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 p-1 ${
        scrolled
          ? // When scrolled: add background + shadow
            "bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800"
          : // At top: fully transparent
            "bg-transparent border-transparent shadow-none"
      }`}
    >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-2">
          <Image src={theme === "dark" ? "/logo-dark.svg" : "/logo-light.svg"} alt="ProBid AI" width={25} height={25} className="text-background"/>
          <span className="text-xl font-bold text-blue-700 dark:text-white">
            ProBid AI
          </span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <Button
            asChild
            size="sm"
            className="
              bg-blue-600 hover:bg-blue-700 text-white
              dark:bg-blue-700 dark:hover:bg-blue-800
            "
          >
            <Link href="/sign-in">Login/Signup</Link>
          </Button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
