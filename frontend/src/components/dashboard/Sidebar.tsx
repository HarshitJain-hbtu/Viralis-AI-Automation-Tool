'use client';

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Video,
  Mic,
  Search,
  Settings,
  Zap,
  Layers,
  BarChart3,
  MessageSquare,
  HelpCircle,
  Plus,
  LogOut,
  CreditCard,
  User,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Calendar, label: "Growth Plan", href: "/calendar" },
  { icon: Layers, label: "Content Board", href: "/board" },
  { icon: Sparkles, label: "Content Studio", href: "/dashboard/content" },
];

const toolItems = [
  { icon: Video, label: "Reels Studio", href: "/dashboard/studio" },
  { icon: Mic, label: "Voice Lab", href: "/voice" },
  { icon: Search, label: "Competitor Spy", href: "/spy" },
];

const secondaryItems = [
  { icon: MessageSquare, label: "Inbox", href: "/dashboard/inbox", badge: 7 },
  { icon: BarChart3, label: "Reporting", href: "/reporting" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const business = user?.businessId as any;
  const [showSubscription, setShowSubscription] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  }

  return (
    <>
      <div className="fixed left-0 top-0 h-full w-64 bg-[#FDFCFF] border-r border-[#EBEBEB] p-4 flex flex-col font-sans">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 mb-8 mt-2">
          <img src="/logo.png" alt="Viralis" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="font-bold text-gray-900 leading-none">Viralis</h1>
            <p className="text-[10px] text-gray-500 font-medium">Auto-Pilot Mode</p>
          </div>
        </div>

        {/* Scrollable Nav Area */}
        <div className="flex-1 overflow-y-auto -mx-4 px-4 space-y-6">
          <div>
            <p className="px-3 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Dashboard</p>
            <nav className="space-y-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-gray-100/80 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", pathname === item.href ? "text-gray-900" : "text-gray-500")} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="px-3 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">AI Tools</p>
            <nav className="space-y-0.5">
              {toolItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-gray-100/80 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", pathname === item.href ? "text-gray-900" : "text-gray-500")} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="px-3 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Workspace</p>
            <nav className="space-y-0.5">
              {secondaryItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-gray-500" />
                    {item.label}
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* User Profile - Static Bottom */}
        <div className="mt-0 pt-4 border-t border-gray-100 bg-[#FDFCFF] z-10">
          {/* Subscription Snippet */}
          <div className="mb-4 p-4 bg-gray-900 rounded-xl text-white relative overflow-hidden group cursor-pointer" onClick={() => setShowSubscription(true)}>
            <div className="absolute top-0 right-0 p-3 opacity-10 transition-transform group-hover:scale-110">
              <Sparkles className="w-16 h-16" />
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-sm">Viralis Pro</h3>
                <span className="text-[10px] bg-white/20 px-1.5 rounded font-medium">PRO</span>
              </div>
              <p className="text-[10px] text-gray-400 mb-3">750/1000 AI Credits Used</p>
              <div className="w-full h-1.5 bg-gray-800 rounded-full mb-3 overflow-hidden">
                <div className="w-[75%] h-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
              </div>
              <Button size="sm" className="w-full bg-white text-gray-900 hover:bg-gray-100 h-7 text-xs font-bold border-0">
                Upgrade Now
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* Subscription Dialog */}
      <Dialog open={showSubscription} onOpenChange={setShowSubscription}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Viralis Pro Plan
            </DialogTitle>
            <DialogDescription>
              You are currently on the Pro Tier. Here's your usage.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-600">AI Credits</span>
                <span className="text-gray-900">750 / 1,000</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-purple-600 rounded-full" />
              </div>
              <p className="text-xs text-gray-500">Resets in 12 days</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-600 font-medium mb-1">Voice Agent</p>
                <p className="text-lg font-bold text-blue-900">Active</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                <p className="text-xs text-green-600 font-medium mb-1">Seats Used</p>
                <p className="text-lg font-bold text-green-900">1 / 3</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowSubscription(false)}>Close</Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">Upgrade Plan</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
