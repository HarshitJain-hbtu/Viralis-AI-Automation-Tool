"use client";

import { Bell, Search, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="fixed top-0 right-0 left-64 h-20 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl border-b border-white/20 dark:border-white/10 px-8 flex items-center justify-between z-40 transition-all">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 font-medium">Current Mode:</span>
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold">
            DENTIST
          </Badge>
        </div>
        <div className="relative w-96 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="Search AI features, posts, or leads..."
            className="pl-10 bg-white/50 dark:bg-zinc-900/50 border-white/20 dark:border-white/10 rounded-2xl h-11 focus-visible:ring-emerald-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {mounted && (theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />)}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 pl-2 pr-4 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white">
                <User className="w-5 h-5" />
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-sm font-bold leading-tight">Dr. Julian</p>
                <p className="text-[10px] text-zinc-500 font-medium">Premium Member</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2">
            <DropdownMenuItem className="rounded-xl cursor-pointer">Profile</DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl cursor-pointer">Subscription</DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl cursor-pointer text-red-500">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
