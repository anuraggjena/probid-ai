import Link from "next/link";
import { SidebarNav } from "./SidebarNav";
import Image from "next/image";
import { useTheme } from "next-themes";

export function DesktopSidebar() {
  const { theme } = useTheme();
  
  return (
    <div className="hidden border-r bg-muted/40 md:fixed md:inset-y-0 md:z-50 md:flex md:w-[220px] lg:w-[280px] md:flex-col">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image src={theme === "dark" ? "/logo-dark.svg" : "/logo-light.svg"} alt="Logo" width={20} height={20}/>
            <span className="text-lg">ProBid AI</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav />
        </div>
      </div>
    </div>
  );
}