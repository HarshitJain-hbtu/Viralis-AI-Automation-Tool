'use client';

import * as React from "react";
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    Search,
    Zap,
    LayoutDashboard,
    Target,
    BarChart,
    FileText,
    ArrowRight,
    Inbox
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function CommandMenu({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
    const router = useRouter();
    const [query, setQuery] = React.useState("");

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen(!open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [setOpen]);

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false);
        command();
    }, [setOpen]);

    const groups = [
        {
            heading: "Suggestions",
            items: [
                { icon: LayoutDashboard, name: "Dashboard", action: () => router.push("/dashboard") },
                { icon: Target, name: "Competitor Spy", action: () => router.push("/dashboard/competitor-spy") },
                { icon: Zap, name: "Content Studio", action: () => router.push("/dashboard/ai-calendar") },
            ]
        },
        {
            heading: "Tools",
            items: [
                { icon: Inbox, name: "Inbox", action: () => router.push("/dashboard/inbox") },
                { icon: FileText, name: "Content Board", action: () => router.push("/dashboard/content-board") },
                { icon: User, name: "Leads", action: () => router.push("/lead-management") },
            ]
        },
        {
            heading: "Settings",
            items: [
                { icon: User, name: "Profile", action: () => router.push("/dashboard/profile") },
                { icon: CreditCard, name: "Billing", action: () => router.push("/dashboard/billing") },
                { icon: Settings, name: "Settings", action: () => router.push("/dashboard/settings") },
            ]
        }
    ];

    const filteredGroups = groups.map(group => ({
        ...group,
        items: group.items.filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
    })).filter(group => group.items.length > 0);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="p-0 gap-0 overflow-hidden max-w-[550px] bg-white shadow-2xl border border-slate-200 top-[20%] translate-y-0">
                <DialogTitle className="sr-only">Command Menu</DialogTitle>
                <DialogDescription className="sr-only">Quick navigation and actions for Viralis</DialogDescription>

                <div className="flex items-center border-b border-slate-100 px-3" cmdk-input-wrapper="">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type a command or search..."
                        className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                        autoFocus
                    />
                    <div className="flex items-center gap-1">
                        <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100">
                            <span className="text-xs">ESC</span>
                        </kbd>
                    </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto overflow-x-hidden py-2 px-2">

                    {filteredGroups.length === 0 && (
                        <div className="py-6 text-center text-sm text-slate-500">
                            No results found.
                        </div>
                    )}

                    {filteredGroups.map((group) => (
                        <div key={group.heading} className="mb-2">
                            <h3 className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                {group.heading}
                            </h3>
                            {group.items.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => runCommand(item.action)}
                                    className="w-full flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors group text-left outline-none focus:bg-slate-100"
                                >
                                    <div className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white shadow-sm text-slate-500 group-hover:border-slate-300">
                                        <item.icon className="h-4 w-4" />
                                    </div>
                                    <span className="flex-1 font-medium">{item.name}</span>
                                    <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-slate-400" />
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="border-t border-slate-100 bg-slate-50 px-3 py-2 flex items-center justify-between">
                    <div className="text-[10px] text-slate-400 font-medium">
                        Pro Tip: Search for "Competitor" to jump straight to analysis.
                    </div>
                    <div className="flex gap-2 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1"><kbd className="font-sans border border-slate-200 bg-white rounded px-1">↑</kbd><kbd className="font-sans border border-slate-200 bg-white rounded px-1">↓</kbd> to navigate</span>
                        <span className="flex items-center gap-1"><kbd className="font-sans border border-slate-200 bg-white rounded px-1">↵</kbd> to select</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
