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
  Sparkles,
  FileText,
  Phone
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { useState, useEffect } from "react";
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
  { icon: Sparkles, label: "Content Studio", href: "/dashboard/ai-calendar" },
  { icon: Layers, label: "Content Board", href: "/dashboard/board" },
];

const toolItems = [
  { icon: Search, label: "Competitor Spy", href: "/dashboard/competitor-spy" },
  { icon: Search, label: "Lead Management", href: "/lead-management" },
  { icon: Mic, label: "Voice Lab", href: "/dashboard/settings/ai-brain" },
];

const secondaryItems = [
  { icon: MessageSquare, label: "Inbox", href: "/dashboard/inbox" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const business = user?.businessId as any;

  // Usage tracking state (would come from API in production)
  const [usage, setUsage] = useState({
    contentToday: 0,
    contentLimit: 1,
    voiceMinutesUsed: 0,
    voiceMinutesLimit: 120, // 2 hours = 120 mins
  });

  // Get plan details with usage limits
  const getPlanDetails = () => {
    const tier = (typeof business === 'object' ? business?.subscriptionTier : 'Free') || 'Free';

    switch (tier) {
      case 'Agency':
        return {
          name: 'Viralis Agency',
          badge: 'AGENCY',
          contentLimit: Infinity,
          voiceLimit: Infinity,
          color: 'from-purple-500 to-pink-500',
          textColor: 'text-purple-600',
        };
      case 'Growth':
        return {
          name: 'Viralis Growth',
          badge: 'GROWTH',
          contentLimit: Infinity,
          voiceLimit: 600, // 10 hours
          color: 'from-blue-500 to-cyan-400',
          textColor: 'text-blue-600',
        };
      case 'Free':
      default:
        return {
          name: 'Viralis Free',
          badge: 'FREE',
          contentLimit: 1,
          voiceLimit: 120, // 2 hours
          color: 'from-gray-400 to-gray-500',
          textColor: 'text-gray-600',
        };
    }
  };

  const plan = getPlanDetails();

  // Calculate usage percentages
  const contentPercent = plan.contentLimit === Infinity ? 0 : Math.min((usage.contentToday / plan.contentLimit) * 100, 100);
  const voicePercent = plan.voiceLimit === Infinity ? 0 : Math.min((usage.voiceMinutesUsed / plan.voiceLimit) * 100, 100);

  // Format voice minutes to readable time
  const formatMinutes = (mins: number) => {
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const remainMins = mins % 60;
      return remainMins > 0 ? `${hrs}h ${remainMins}m` : `${hrs}h`;
    }
    return `${mins}m`;
  };

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
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Usage Tracking & Subscription - Static Bottom */}
        <div className="mt-0 pt-4 border-t border-gray-100 bg-[#FDFCFF] z-10 space-y-3">

          {/* Usage Card */}
          <div className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Daily Usage</span>
              <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">{plan.badge}</span>
            </div>

            {/* Content Generation */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-blue-500" />
                  <span className="text-xs text-gray-700 font-medium">Content</span>
                </div>
                <span className="text-[10px] text-gray-500">
                  {plan.contentLimit === Infinity ? '∞' : `${usage.contentToday}/${plan.contentLimit}`}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    contentPercent >= 100 ? "bg-red-500" : "bg-blue-500"
                  )}
                  style={{ width: plan.contentLimit === Infinity ? '10%' : `${contentPercent}%` }}
                />
              </div>
              {contentPercent >= 100 && plan.contentLimit !== Infinity && (
                <p className="text-[9px] text-red-500 mt-1">Limit reached. Resets tomorrow.</p>
              )}
            </div>

            {/* Voice Agent */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-gray-700 font-medium">Voice Agent</span>
                </div>
                <span className="text-[10px] text-gray-500">
                  {plan.voiceLimit === Infinity ? '∞' : `${formatMinutes(usage.voiceMinutesUsed)}/${formatMinutes(plan.voiceLimit)}`}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    voicePercent >= 100 ? "bg-red-500" : "bg-green-500"
                  )}
                  style={{ width: plan.voiceLimit === Infinity ? '10%' : `${voicePercent}%` }}
                />
              </div>
              {voicePercent >= 100 && plan.voiceLimit !== Infinity && (
                <p className="text-[9px] text-red-500 mt-1">Monthly limit reached.</p>
              )}
            </div>
          </div>

          {/* Upgrade CTA */}
          {plan.badge === 'FREE' && (
            <Button
              size="sm"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white h-9 text-xs font-bold"
              onClick={() => router.push('/dashboard/billing')}
            >
              <Zap className="w-3 h-3 mr-1.5" />
              Upgrade for Unlimited
            </Button>
          )}

        </div>
      </div>
    </>
  );
}

