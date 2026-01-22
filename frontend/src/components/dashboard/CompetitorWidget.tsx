"use client";

import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { competitorData } from "@/lib/mock-data";
import { AlertCircle } from "lucide-react";

export function CompetitorWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-sm"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold">Competitor Watch</h3>
          <p className="text-zinc-500 text-xs">You vs. Dr. Smile Clinic</p>
        </div>
        <div className="bg-red-500/10 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 animate-pulse">
          <AlertCircle className="w-3 h-3" />
          Gap Detected
        </div>
      </div>

      <div className="h-[200px] w-full mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={competitorData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: "#888" }}
            />
            <YAxis hide />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ 
                backgroundColor: "rgba(255, 255, 255, 0.8)", 
                borderRadius: "12px", 
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                backdropFilter: "blur(8px)"
              }}
            />
            <Bar dataKey="reels" radius={[6, 6, 0, 0]}>
              {competitorData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? "#10b981" : "#cbd5e1"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
        <p className="text-xs text-red-600 dark:text-red-400 font-medium">
          They are winning on Reels. AI suggests posting 2 more Reels this week to close the gap.
        </p>
      </div>
    </motion.div>
  );
}
