'use client';

import { MoreHorizontal, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface RichStatsCardProps {
    title: string;
    total: string;
    subStats: Array<{ label: string; value: string; color: string }>;
    chart?: React.ReactNode;
}

export function RichStatsCard({ title, total, subStats, chart }: RichStatsCardProps) {
    return (
        <div className="!bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                    <div className="w-2 h-2 rounded-full bg-gray-900" />
                    {title}
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-baseline gap-6 mb-6">
                <div>
                    <span className="text-3xl font-bold text-gray-900 tracking-tight">{total}</span>
                    <p className="text-xs text-gray-500 font-medium mt-1">Total {title}</p>
                </div>

                {subStats.map((stat, i) => (
                    <div key={i}>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">{stat.value}</span>
                        <div className="flex items-center gap-1.5 mt-1">
                            <div className={`w-2 h-2 rounded-full ${stat.color}`} />
                            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {chart}
        </div>
    );
}
