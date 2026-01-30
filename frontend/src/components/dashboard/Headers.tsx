'use client';

import { Search, SlidersHorizontal, Share2, Plus, LogOut, User, CreditCard, Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
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

  return (
    <header className="h-16 px-8 flex items-center justify-between border-b border-transparent bg-[#FAFAFA]">
      {/* Breadcrumbs / Title */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="hover:text-gray-900 cursor-pointer">Overview</span>
        <span>/</span>
        <span className="font-semibold text-gray-900">Dashboard</span>
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

        <Button 
          onClick={() => router.push('/dashboard/ai-calendar')}
          className="bg-[#1C1C1C] text-white hover:bg-gray-800 h-9 rounded-lg gap-2 px-4 font-medium shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          Create content
        </Button>

        <div className="h-6 w-px bg-gray-200 mx-2" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded-full transition-colors outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <div className="w-8 h-8 rounded-full bg-gray-200 border border-white shadow-sm overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { logout(); router.push('/login'); }} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
