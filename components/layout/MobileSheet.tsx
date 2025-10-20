// components/layout/MobileSheet.tsx

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileSidebarNav } from "./SidebarNav";
import Image from "next/image";
import { useTheme } from "next-themes";

export function MobileSheet() {
  const { theme } = useTheme();
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col p-4 sm:max-w-xs">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold mb-6 px-2"
        >
          <Image src={theme === "dark" ? "/logo-dark.svg" : "/logo-light.svg"} alt="Logo" width={15} height={15}/>
          <span>ProBid AI</span>
        </Link>
        <MobileSidebarNav />
      </SheetContent>
    </Sheet>
  );
}