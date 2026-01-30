'use client';

import { Search, SlidersHorizontal, Share2, Plus, LogOut, User, CreditCard, Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    // Remove /dashboard from the start and split
    const path = pathname?.replace(/^\/dashboard\/?/, '') || '';
    if (!path) return (
      <>
        <span>/</span>
        <span className="font-semibold text-gray-900">Dashboard</span>
      </>
    );

    const segments = path.split('/').filter(Boolean);

    // Map of path segments to friendly names
    const nameMap: Record<string, string> = {
      'ai-brain': 'Voice Lab',
      'settings': 'Settings',
      'studio': 'Reels Studio',
      'competitor-spy': 'Competitor Spy',
      'lead-management': 'Lead Management',
      'growth-plan': 'Growth Plan',
      'content-board': 'Content Board'
    };

    return segments.map((segment, index) => {
      const name = nameMap[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const isLast = index === segments.length - 1;

      return (
        <Fragment key={segment}>
          <span>/</span>
          <span className={`${isLast ? 'font-semibold text-gray-900' : 'hover:text-gray-900 cursor-pointer transition-colors'}`}>
            {name}
          </span>
        </Fragment>
      );
    });
  };

  return (
    <header className="sticky top-0 z-40 h-16 px-8 pt-16 pb-8 flex items-center justify-between border-b border-gray-100 bg-[#FAFAFA]/80 backdrop-blur-md">
      {/* Breadcrumbs / Title */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span
          className="hover:text-gray-900 cursor-pointer transition-colors font-medium"
          onClick={() => router.push('/dashboard')}
        >
          Viralis
        </span>
        {getBreadcrumbs()}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-600" />
          <input
            type="text"
            placeholder="Search"
            className="h-9 pl-9 pr-4 text-sm bg-gray-100/50 border border-transparent rounded-lg w-64 focus:bg-white focus:border-gray-200 focus:outline-none transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className="text-[10px] text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">⌘K</span>
          </div>
        </div>

        <div className="h-6 w-px bg-gray-200 mx-2" />

        <Button variant="ghost" size="sm" className="text-gray-600 gap-2 h-9 font-medium">
          <SlidersHorizontal className="w-4 h-4" />
          Manage
        </Button>

        <Button variant="ghost" size="sm" className="text-gray-600 gap-2 h-9 font-medium">
          <Share2 className="w-4 h-4" />
          Share
        </Button>

        <Button className="bg-[#1C1C1C] text-white hover:bg-gray-800 h-9 rounded-lg gap-2 px-4 font-medium shadow-sm">
          <Plus className="w-4 h-4" />
          Create content
        </Button>

        <div className="h-6 w-px bg-gray-200 mx-2" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded-full transition-colors outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <div className="w-8 h-8 rounded-full bg-gray-200 border border-white shadow-sm overflow-hidden">
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
                  alt="User"
                />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-100 shadow-xl rounded-xl p-2">
            <DropdownMenuLabel className="px-3 py-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none text-gray-900">{user?.name}</p>
                <p className="text-xs leading-none text-gray-500 font-medium">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-100 my-1" />
            <DropdownMenuItem onClick={() => router.push('/dashboard/profile')} className="cursor-pointer rounded-lg hover:bg-gray-50 focus:bg-gray-50 text-gray-700 px-3 py-2">
              <User className="mr-2 h-4 w-4 text-gray-500" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="cursor-pointer rounded-lg hover:bg-gray-50 focus:bg-gray-50 text-gray-700 px-3 py-2">
              <Settings className="mr-2 h-4 w-4 text-gray-500" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/dashboard/billing')} className="cursor-pointer rounded-lg hover:bg-gray-50 focus:bg-gray-50 text-gray-700 px-3 py-2">
              <CreditCard className="mr-2 h-4 w-4 text-gray-500" />
              <span>Billing</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-100 my-1" />
            <DropdownMenuItem onClick={() => { logout(); router.push('/'); }} className="text-red-600 cursor-pointer rounded-lg hover:bg-red-50 focus:bg-red-50 px-3 py-2 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
