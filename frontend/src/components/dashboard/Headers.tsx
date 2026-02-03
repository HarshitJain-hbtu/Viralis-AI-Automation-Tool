'use client';

import { SlidersHorizontal, Plus, LogOut, User, CreditCard, Settings, Sparkles, ChevronRight, Bell, Search, Command } from "lucide-react";
import { ShareCard } from "@/components/dashboard/ShareCard";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import { Fragment, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommandMenu } from "@/components/dashboard/CommandMenu";

export function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [openCommand, setOpenCommand] = useState(false);

  const getBreadcrumbs = () => {
    const path = pathname?.replace(/^\/dashboard\/?/, '') || '';
    if (!path) return (
      <span className="font-medium text-slate-800">Dashboard</span>
    );

    const segments = path.split('/').filter(Boolean);
    const nameMap: Record<string, string> = {
      'ai-brain': 'Voice Lab',
      'settings': 'Settings',
      'competitor-spy': 'Competitor Spy',
      'lead-management': 'Lead Management',
      'growth-plan': 'Growth Plan',
      'content-board': 'Content Board',
      'ai-calendar': 'Content Studio',
    };

    return (
      <div className="flex items-center gap-1.5 text-sm">
        <span className="text-slate-500 hover:text-slate-800 cursor-pointer transition-colors" onClick={() => router.push('/dashboard')}>
          Viralis
        </span>
        {segments.map((segment, index) => {
          const name = nameMap[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          const isLast = index === segments.length - 1;

          return (
            <Fragment key={segment}>
              <span className="text-slate-300">/</span>
              <span className={`${isLast ? 'font-medium text-slate-900' : 'text-slate-500 hover:text-slate-800 cursor-pointer transition-colors'}`}>
                {name}
              </span>
            </Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-14 px-6 flex items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
        {/* Breadcrumbs */}
        <div className="flex items-center">
          {getBreadcrumbs()}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Search Trigger */}
          <button
            onClick={() => setOpenCommand(true)}
            className="hidden md:flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 transition-colors mr-2 w-48 justify-between"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 opacity-70" />
              <span className="opacity-70">Search...</span>
            </div>
            <kbd className="hidden sm:inline-flex h-4 items-center gap-0.5 rounded border border-slate-200 bg-white px-1 font-mono text-[10px] font-medium text-slate-500">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          <ShareCard />

          <Button
            onClick={() => router.push('/dashboard/ai-calendar')}
            size="sm"
            className="bg-slate-900 hover:bg-slate-800 text-white h-8 px-3 rounded-lg text-xs font-medium shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-300" />
            Create content
          </Button>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="group flex items-center gap-2 outline-none">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden transition-all group-hover:ring-2 group-hover:ring-slate-100">
                    <img
                      src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border border-slate-100 shadow-xl rounded-xl p-1.5 mt-1">
              <DropdownMenuLabel className="px-2 py-2">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                  <p className="text-[11px] font-medium text-slate-500">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100 my-1" />
              <DropdownMenuItem onClick={() => router.push('/dashboard/profile')} className="cursor-pointer rounded-lg px-2 py-1.5 text-slate-600 focus:bg-slate-50 focus:text-slate-900">
                <User className="mr-2 h-4 w-4 text-slate-400" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="cursor-pointer rounded-lg px-2 py-1.5 text-slate-600 focus:bg-slate-50 focus:text-slate-900">
                <Settings className="mr-2 h-4 w-4 text-slate-400" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/dashboard/billing')} className="cursor-pointer rounded-lg px-2 py-1.5 text-slate-600 focus:bg-slate-50 focus:text-slate-900">
                <CreditCard className="mr-2 h-4 w-4 text-slate-400" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-100 my-1" />
              <DropdownMenuItem onClick={() => { logout(); router.push('/'); }} className="text-red-600 cursor-pointer rounded-lg px-2 py-1.5 focus:bg-red-50 focus:text-red-700">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <CommandMenu open={openCommand} setOpen={setOpenCommand} />
    </>
  );
}
