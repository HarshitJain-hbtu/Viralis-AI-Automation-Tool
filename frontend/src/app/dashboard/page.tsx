'use client';

import { Header } from "@/components/dashboard/Headers";
import { RichStatsCard } from "@/components/dashboard/RichStatsCard";
import { GrowthChart } from "@/components/dashboard/GrowthChart";
import { LocalSEOMap } from "@/components/dashboard/LocalSEOMap";
import { CompetitorWidget } from "@/components/dashboard/CompetitorWidget";
import { BrandVoiceMeter } from "@/components/dashboard/BrandVoiceMeter";
import { ActionCenter } from "@/components/dashboard/ActionCenter";
import { SocialConnect } from "@/components/SocialConnect";
import { SocialStats } from "@/components/SocialStats";
import { Filter, LayoutGrid, Plus, MoreVertical, Phone, MessageSquare, User, Calendar, Video } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { useState } from "react";

export default function Dashboard() {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'content' | 'leads'>('leads');

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <Header />

            <main className="px-8 py-6 max-w-[1600px] mx-auto">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Business Overview</h1>
                        <p className="text-gray-500 mt-1">Gemini 3 Powered CRM & Content Engine</p>
                    </div>
                    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('leads')}
                            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === 'leads' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            CRM & Leads
                        </button>
                        <button
                            onClick={() => setActiveTab('content')}
                            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === 'content' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Content Engine
                        </button>
                    </div>
                </div>

                {/* Top Actions: AI Advisor */}
                <div className="mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Daily Gemini 3 Actions</h3>
                        <ActionCenter />
                    </div>
                </div>

                {/* Social Integration */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-1">
                        <SocialConnect />
                    </div>
                    <div className="lg:col-span-2">
                        <SocialStats />
                    </div>
                </div>

                {/* CRM Stats Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    {/* 1. Leads Funnel */}
                    <RichStatsCard
                        title="Lead Pipeline"
                        total="42"
                        subStats={[
                            { label: "New", value: "12", color: "bg-blue-500" },
                            { label: "Qualified", value: "8", color: "bg-green-500" },
                            { label: "Calls", value: "22", color: "bg-orange-500" }
                        ]}
                        chart={
                            <div className="h-16 w-full flex gap-0.5 rounded-lg overflow-hidden mt-2">
                                <div className="h-full bg-blue-500 w-[30%] opacity-90" />
                                <div className="h-full bg-green-500 w-[20%] opacity-90" />
                                <div className="h-full bg-orange-500 w-[50%] opacity-90" />
                            </div>
                        }
                    />

                    {/* 2. Voice Agent Stats */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2 text-gray-900 font-semibold">
                                <div className="w-2 h-2 rounded-full bg-orange-500" />
                                Voice Agent
                            </div>
                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">ACTIVE</span>
                        </div>
                        <div className="flex items-end gap-2 mt-4">
                            <span className="text-3xl font-bold text-gray-900">89</span>
                            <span className="text-sm text-gray-500 mb-1">Calls handled</span>
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Appointments Booked</span>
                                <span className="font-semibold">14</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">FAQs Answered</span>
                                <span className="font-semibold">65</span>
                            </div>
                        </div>
                    </div>

                    {/* 3. Growth Chart */}
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
                </div>

                {/* Main Board Area - Toggles between CRM and Content */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">
                            {activeTab === 'leads' ? 'Lead Management' : 'Content Production'}
                        </h2>

                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200">
                                <Filter className="w-4 h-4" />
                                Filter
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition-colors">
                                <Plus className="w-4 h-4" />
                                {activeTab === 'leads' ? 'Add Lead' : 'Create Post'}
                            </button>
                        </div>
                    </div>

                    {activeTab === 'leads' ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <KanbanColumn
                                title="New Leads"
                                count={12}
                                items={[
                                    { title: "John Doe", tag: "Voice Call", date: "2m ago", icon: Phone, color: "text-orange-500" },
                                    { title: "Sarah Smith", tag: "Website", date: "1h ago", icon: User, color: "text-blue-500" }
                                ]}
                            />
                            <KanbanColumn
                                title="Qualified"
                                count={5}
                                color="text-green-500"
                                items={[
                                    { title: "Mike Johnson", tag: "High Intent", date: "Yesterday", icon: User, color: "text-green-600" }
                                ]}
                            />
                            <KanbanColumn title="Follow Up" count={3} color="text-yellow-500" items={[]} />
                            <KanbanColumn title="Closed" count={45} color="text-gray-400" items={[]} />
                        </div>
                    ) : (
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
                    )}
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
