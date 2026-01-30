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

  { icon: Search, label: "Competitor Spy", href: "/spy" },

  { icon: Search, label: "Lead Management", href: "/lead-management" },
  { icon: Mic, label: "Voice Lab", href: "/dashboard/settings/ai-brain" }, // Updated

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

  // Helper to get Plan Details
  const getPlanDetails = () => {
    const tier = (typeof business === 'object' ? business?.subscriptionTier : 'Free') || 'Free';

    switch (tier) {
      case 'Business':
        return {
          name: 'Viralis Business',
          badge: 'BIZ',
          credits: '2,500/10,000',
          percent: 25,
          color: 'from-amber-400 to-orange-500',
          textColor: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-100'
        };
      case 'Starter':
        return {
          name: 'Viralis Starter',
          badge: 'PRO',
          credits: '750/1,000',
          percent: 75,
          color: 'from-blue-500 to-cyan-400',
          textColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-100'
        };
      case 'Free':
      default:
        return {
          name: 'Viralis Free',
          badge: 'FREE',
          credits: '5/5 Videos',
          percent: 100,
          color: 'from-gray-400 to-gray-500',
          textColor: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-100'
        };
    }
  };

  const plan = getPlanDetails();

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
          <div className="mb-4 p-4 bg-gray-900 rounded-xl text-white relative overflow-hidden group cursor-pointer" onClick={() => router.push('/dashboard/billing')}>
            <div className="absolute top-0 right-0 p-3 opacity-10 transition-transform group-hover:scale-110">
              <Sparkles className="w-16 h-16" />
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-sm">{plan.name}</h3>
                <span className="text-[10px] bg-white/20 px-1.5 rounded font-medium">{plan.badge}</span>
              </div>
              <p className="text-[10px] text-gray-400 mb-3">{plan.credits} Used</p>
              <div className="w-full h-1.5 bg-gray-800 rounded-full mb-3 overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${plan.color}`} style={{ width: `${plan.percent}%` }} />
              </div>
              <Button
                size="sm"
                className="w-full bg-white text-gray-900 hover:bg-gray-100 h-7 text-xs font-bold border-0"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push('/dashboard/billing');
                }}
              >
                Upgrade Now
              </Button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
