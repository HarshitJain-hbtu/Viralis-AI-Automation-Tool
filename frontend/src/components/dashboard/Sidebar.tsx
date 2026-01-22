"use client";

import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Calendar, 
  Video, 
  Mic, 
  Search, 
  Settings,
  Zap
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Calendar, label: "Growth Plan", href: "/calendar" },
  { icon: Video, label: "Reels Studio", href: "/studio" },
  { icon: Mic, label: "Voice Lab", href: "/voice" },
  { icon: Search, label: "Competitor Spy", href: "/spy" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border-r border-white/20 dark:border-white/10 p-6 z-50 transition-all">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
          <Zap className="text-white w-6 h-6" />
        </div>
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
          VIRALIS
        </span>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group",
              pathname === item.href
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-transform group-hover:scale-110",
              pathname === item.href ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400"
            )} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-8 left-6 right-6">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">PRO PLAN ACTIVE</p>
          <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-teal-500" />
          </div>
          <p className="text-[10px] text-zinc-400 mt-2">750/1000 AI Credits Used</p>
        </div>
      </div>
    </div>
  );
}
