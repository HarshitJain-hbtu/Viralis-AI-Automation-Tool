'use client';
import React, { useState, useEffect } from 'react';
import { Header } from "@/components/dashboard/Headers";
import { RichStatsCard } from "@/components/dashboard/RichStatsCard";
import { GrowthChart } from "@/components/dashboard/GrowthChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { CompetitorWidget } from "@/components/dashboard/CompetitorWidget";
import { BrandVoiceMeter } from "@/components/dashboard/BrandVoiceMeter";
import { ActionCenter } from "@/components/dashboard/ActionCenter";
import { SocialConnect } from "@/components/SocialConnect";
import { SocialStats } from "@/components/SocialStats";
import { Calendar } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";

export default function Dashboard() {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState('content');
    const [stats, setStats] = useState({
        content: { scheduled: 0, posted: 0, total: 0 },
        leads: { total: 0, pipeline: [] as any[] },
        voice: { callsHandled: 0, active: true }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Assuming apiClient is available or fetch directly
                // Assuming apiClient is available or fetch directly
                const token = localStorage.getItem('token');

                // Use the centralized API client which handles Authorization headers
                const { default: api } = await import('@/lib/api/client');
                const res = await api.get(`/dashboard/stats?t=${Date.now()}`);

                if (res.status === 200) {
                    setStats(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-[#FAFAFA]">

            <main className="px-8 py-6 max-w-[1600px] mx-auto">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Business Overview</h1>
                        <p className="text-gray-500 mt-1">Gemini 3 Powered CRM & Content Engine</p>                    </div>
                </div>

                {/* Top Actions: AI Advisor */}
                <div className="mb-8">
                    <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Daily Gemini 3 Actions</h3>
                        <ActionCenter />
                    </div>
                </div>


                {/* Stats Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                    {/* Growth Chart */}
                </div>

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
                        total={stats.leads.total.toString()}
                        subStats={stats.leads.pipeline.length > 0 ? stats.leads.pipeline : [
                            { label: "New", value: "0", color: "bg-blue-500" },
                            { label: "Qualified", value: "0", color: "bg-green-500" },
                            { label: "Calls", value: "0", color: "bg-orange-500" }
                        ]}
                        chart={
                            <div className="h-16 w-full flex gap-0.5 rounded-lg overflow-hidden mt-2">
                                {stats.leads.pipeline.length > 0 ? (
                                    stats.leads.pipeline.map((p, i) => (
                                        <div key={i} className={`h-full ${p.color} opacity-90`} style={{ width: `${(parseInt(p.value) / stats.leads.total) * 100}%` }} />
                                    ))
                                ) : (
                                    <div className="h-full bg-gray-100 w-full" />
                                )}
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
                            <span className="text-3xl font-bold text-gray-900">{stats.voice.callsHandled}</span>
                            <span className="text-sm text-gray-500 mb-1">Calls handled</span>
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Avg Duration</span>
                                <span className="font-semibold">{(stats.voice as any).avgDuration || '0m 0s'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Sentiment</span>
                                <span className={`font-semibold ${(stats.voice as any).sentiment === 'Positive' ? 'text-green-600' : (stats.voice as any).sentiment === 'Negative' ? 'text-red-600' : 'text-gray-600'}`}>
                                    {(stats.voice as any).sentiment || 'Neutral'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 3. Growth Chart */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col h-[300px]">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2 text-gray-900 font-semibold">
                                <div className="w-2 h-2 rounded-full bg-gray-900" />
                                Total Reach (6 Months)
                            </div>
                        </div>
                        <div className="flex-1 w-full min-h-[100px]">
                            <GrowthChart data={(stats as any).growthData || []} />
                        </div>
                    </div>

                    {/* Brand Voice Meter */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col">
                        {/* We don't have a specific score in stats yet, defaulting to 85 or extracting from user if available */}
                        <BrandVoiceMeter
                            score={92}
                            tone={(user?.businessId as any)?.brandVoice?.tone || 'Professional'}
                        />
                    </div>
                </div>

                {/* Content Overview */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">
                            Content Overview
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Scheduled</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.content.scheduled}</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <Calendar className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Posted</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.content.posted}</p>
                            </div>
                            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                                <Calendar className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                            <p className="text-gray-500 text-sm mb-3">Go to Studio</p>
                            <a
                                href="/dashboard/ai-calendar"
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors text-sm"
                            >
                                <Calendar className="w-4 h-4" />
                                Open Calendar
                            </a>
                        </div>
                    </div>
                </div>

                {/* Widgets Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 pb-20">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden h-[300px]">
                        <RecentActivity events={(stats as any).recentEvents} />
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between">
                            <h3 className="font-semibold text-gray-900">Competitor Intelligence</h3>
                            <div className="bg-red-50 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                Gap Detected
                            </div>
                        </div>
                        <CompetitorWidget userPostsCount={stats.content.total} />
                    </div>
                </div>

            </main>
        </div>
    );
}


