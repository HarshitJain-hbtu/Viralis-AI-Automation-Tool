"use client";

import { motion } from "framer-motion";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Headers";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { GrowthChart } from "@/components/dashboard/GrowthChart";
import { CompetitorWidget } from "@/components/dashboard/CompetitorWidget";
import { GrowthCalendar } from "@/components/dashboard/GrowthCalender";
import { ActionCenter } from "@/components/dashboard/ActionCenter";
import { BrandVoiceMeter } from "@/components/dashboard/BrandVoiceMeter";
import { LocalSEOMap } from "@/components/dashboard/LocalSEOMap";
import { statsData } from "@/lib/mock-data";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px]" />
      </div>

      <Sidebar />
      <Header />

      <main className="pl-64 pt-20 transition-all">
        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-1"
          >
            <h1 className="text-3xl font-black tracking-tight">Command Center</h1>
            <p className="text-zinc-500 font-medium">Welcome back, Dr. Julian. Your AI growth engine is running at 98% efficiency.</p>
          </motion.div>

          {/* Top Row: Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, idx) => (
              <StatsCard key={stat.title} {...stat} index={idx} />
            ))}
          </div>

          {/* Middle Row: Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GrowthChart />
            </div>
            <div>
              <CompetitorWidget />
            </div>
          </div>

          {/* Feature 2: Growth Calendar */}
          <GrowthCalendar />

          {/* Feature 1, 4, 5: Action Center */}
          <ActionCenter />

          {/* Bottom Row: Feature 8 & 9 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
            <BrandVoiceMeter />
            <LocalSEOMap />
          </div>
        </div>
      </main>

      <footer className="pl-64 py-6 border-t border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md">
        <div className="px-8 text-center text-zinc-400 text-xs font-bold uppercase tracking-widest">
          Viralis AI Engine v2.4.0 • System Status: Operational
        </div>
      </footer>
    </div>
  );
}