'use client';

import { Header } from "@/components/dashboard/Headers";
import { RichStatsCard } from "@/components/dashboard/RichStatsCard";
import { GrowthChart } from "@/components/dashboard/GrowthChart";
import { LocalSEOMap } from "@/components/dashboard/LocalSEOMap";
import { CompetitorWidget } from "@/components/dashboard/CompetitorWidget";
import { BrandVoiceMeter } from "@/components/dashboard/BrandVoiceMeter";
import { ActionCenter } from "@/components/dashboard/ActionCenter";
import { Filter, LayoutGrid, Plus, MoreVertical, Phone, MessageSquare, User, Calendar, Video } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";

export default function Dashboard() {
    const { user } = useAuthStore();

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <Header />

            <main className="px-8 py-6 max-w-[1600px] mx-auto">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Business Overview</h1>
                        <p className="text-gray-500 mt-1">AI Content Engine</p>
                    </div>
                </div>

                {/* Top Actions: AI Advisor */}
                <div className="mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Daily AI Actions</h3>
                        <ActionCenter />
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                    {/* Growth Chart */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2 text-gray-900 font-semibold">
                                <div className="w-2 h-2 rounded-full bg-gray-900" />
                                Total Reach
                            </div>
                        </div>
                        <div className="flex-1 w-full min-h-[100px]">
                            <GrowthChart />
                        </div>
                    </div>

                    {/* Brand Voice Meter */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col">
                        <BrandVoiceMeter />
                    </div>
                </div>

                {/* Main Board Area - Content Production */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">
                            Content Production
                        </h2>

                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200">
                                <Filter className="w-4 h-4" />
                                Filter
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition-colors">
                                <Plus className="w-4 h-4" />
                                Create Post
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <KanbanColumn
                            title="Idea Backlog"
                            count={12}
                            items={[
                                { title: "Summer Promo", tag: "Marketing", date: "Sept 19", icon: Calendar, color: "text-purple-500" }
                            ]}
                        />
                        <KanbanColumn title="Scripting" count={4} color="text-blue-500" items={[]} />
                        <KanbanColumn title="Ready to Post" count={2} color="text-green-500" items={[]} />
                        <KanbanColumn title="Published" count={128} color="text-gray-500" items={[]} />
                    </div>
                </div>

                {/* Widgets Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 pb-20">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
                        <LocalSEOMap />
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between">
                            <h3 className="font-semibold text-gray-900">Competitor Intelligence</h3>
                            <div className="bg-red-50 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                Gap Detected
                            </div>
                        </div>
                        <CompetitorWidget />
                    </div>
                </div>

            </main>
        </div>
    );
}

function KanbanColumn({ title, count, color = "text-gray-500", items }: { title: string, count: number, color?: string, items: any[] }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-600">{title}</h3>
                    <span className="text-gray-400 text-xs font-medium bg-gray-100 px-1.5 rounded-sm">{count}</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                </button>
            </div>

            <div className="flex flex-col gap-3 min-h-[150px]">
                {items.length > 0 ? items.map((item, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-[10px] uppercase font-bold tracking-wider ${item.color} bg-opacity-10 bg-current px-1.5 py-0.5 rounded`}>{item.tag}</span>
                            <MoreVertical className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-3">{item.title}</h4>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                            <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full bg-blue-100 border border-white flex items-center justify-center text-[10px] font-bold text-blue-600">
                                    <item.icon className="w-3 h-3" />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 text-xs">
                                <span>{item.date}</span>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="h-full border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center">
                        <p className="text-xs text-gray-400">No items</p>
                    </div>
                )}

                <button className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-2 transition-colors border border-dashed border-gray-200">
                    <Plus className="w-4 h-4" />
                    Add
                </button>
            </div>
        </div>
    )
}
