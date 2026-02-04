'use client';

import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Layers,
    Mic,
    Search,
    MessageSquare,
    Zap,
    FileText,
    Phone,
    Menu,
    Sparkles
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

const navItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: Sparkles, label: "Content Studio", href: "/dashboard/ai-calendar" },
    { icon: Layers, label: "Content Board", href: "/dashboard/board" },
];

const toolItems = [
    { icon: Search, label: "Competitor Spy", href: "/dashboard/competitor-spy" },
    { icon: Search, label: "Lead Management", href: "/dashboard/lead-management" },
    { icon: Mic, label: "Voice Lab", href: "/dashboard/settings/ai-brain" },
];

const secondaryItems = [
    { icon: MessageSquare, label: "Inbox", href: "/dashboard/inbox" },
];

export function MobileSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuthStore();
    const business = user?.businessId as any;
    const [open, setOpen] = useState(false);

    // Usage tracking state (same as desktop)
    const [usage] = useState({
        contentToday: 0,
        contentLimit: 1,
        voiceMinutesUsed: 0,
        voiceMinutesLimit: 120,
    });

    const getPlanDetails = () => {
        const tier = (typeof business === 'object' ? business?.subscriptionTier : 'Free') || 'Free';

        switch (tier) {
            case 'Agency':
                return { badge: 'AGENCY', contentLimit: Infinity, voiceLimit: Infinity };
            case 'Growth':
                return { badge: 'GROWTH', contentLimit: Infinity, voiceLimit: 600 };
            case 'Free':
            default:
                return { badge: 'FREE', contentLimit: 1, voiceLimit: 120 };
        }
    };

    const plan = getPlanDetails();
    const contentPercent = plan.contentLimit === Infinity ? 0 : Math.min((usage.contentToday / plan.contentLimit) * 100, 100);
    const voicePercent = plan.voiceLimit === Infinity ? 0 : Math.min((usage.voiceMinutesUsed / plan.voiceLimit) * 100, 100);

    const formatMinutes = (mins: number) => {
        if (mins >= 60) {
            const hrs = Math.floor(mins / 60);
            const remainMins = mins % 60;
            return remainMins > 0 ? `${hrs}h ${remainMins}m` : `${hrs}h`;
        }
        return `${mins}m`;
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
                <VisuallyHidden.Root>
                    <SheetTitle>Navigation Menu</SheetTitle>
                </VisuallyHidden.Root>
                <div className="h-full flex flex-col bg-[#FDFCFF] font-sans">

                    {/* Brand */}
                    <div className="flex items-center gap-0 px-6 py-4 border-b border-gray-100">
                        <img src="/logo.png" alt="V" className="w-8 h-8 object-contain" />
                        <div className="ml-2">
                            <h1 className="font-bold text-gray-900 leading-none text-xl">iralis</h1>
                            <p className="text-[10px] text-gray-500 font-medium">Auto-Pilot Mode</p>
                        </div>
                    </div>

                    {/* Scrollable Nav Area */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                        <div>
                            <p className="px-3 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Dashboard</p>
                            <nav className="space-y-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
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
                            <nav className="space-y-1">
                                {toolItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
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
                            <nav className="space-y-1">
                                {secondaryItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                    >
                                        <item.icon className="w-4 h-4 text-gray-500" />
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Usage Stats Mobile */}
                    <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                        <div className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm mb-2">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Daily Usage</span>
                                <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">{plan.badge}</span>
                            </div>

                            <div className="space-y-3">
                                {/* Content */}
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-600 flex items-center gap-1"><FileText className="w-3 h-3 text-blue-500" /> Content</span>
                                        <span className="text-gray-500">{plan.contentLimit === Infinity ? '∞' : `${usage.contentToday}/${plan.contentLimit}`}</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: plan.contentLimit === Infinity ? '10%' : `${contentPercent}%` }} />
                                    </div>
                                </div>

                                {/* Voice */}
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-600 flex items-center gap-1"><Phone className="w-3 h-3 text-green-500" /> Voice</span>
                                        <span className="text-gray-500">{plan.voiceLimit === Infinity ? '∞' : `${formatMinutes(usage.voiceMinutesUsed)}/${formatMinutes(plan.voiceLimit)}`}</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 rounded-full" style={{ width: plan.voiceLimit === Infinity ? '10%' : `${voicePercent}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {plan.badge === 'FREE' && (
                            <Button
                                onClick={() => { setOpen(false); router.push('/dashboard/billing'); }}
                                className="w-full bg-gray-900 text-white text-xs h-9"
                            >
                                <Zap className="w-3 h-3 mr-2" /> Upgrade Plan
                            </Button>
                        )}
                    </div>

                </div>
            </SheetContent>
        </Sheet>
    );
}
