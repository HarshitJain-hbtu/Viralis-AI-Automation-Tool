"use client";

import { motion } from "framer-motion";
import { Phone, Users, Calendar, Clock } from "lucide-react";

interface Event {
    type: 'lead' | 'call' | 'content';
    data: any;
    date: string;
}

interface RecentActivityProps {
    events?: Event[];
}

export function RecentActivity({ events = [] }: RecentActivityProps) {
    if (!events || events.length === 0) {
        return (
            <div className="p-6 h-full flex flex-col justify-center items-center text-center text-gray-400">
                <Clock className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No recent activity</p>
            </div>
        );
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'lead': return <Users className="w-4 h-4 text-blue-500" />;
            case 'call': return <Phone className="w-4 h-4 text-green-500" />;
            case 'content': return <Calendar className="w-4 h-4 text-purple-500" />;
            default: return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getDescription = (e: Event) => {
        switch (e.type) {
            case 'lead': return `New lead: ${e.data.name || 'Unknown'}`;
            case 'call': return `Call logged (${e.data.durationSeconds || '0'}s)`;
            case 'content': return `Content scheduled: ${e.data.strategyType || 'Post'}`;
            default: return 'Unknown activity';
        }
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.round(diffMs / 60000);
        const diffHrs = Math.round(diffMs / 3600000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHrs < 24) return `${diffHrs}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="p-6 h-full overflow-hidden flex flex-col">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                Recently Active
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </h3>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {events.map((e, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-sm transition-all"
                    >
                        <div className="mt-0.5 p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                            {getIcon(e.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {getDescription(e)}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                {formatTime(e.date)}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
