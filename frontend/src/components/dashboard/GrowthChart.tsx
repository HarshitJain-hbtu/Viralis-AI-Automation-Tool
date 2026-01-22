"use client";

import { motion } from "framer-motion";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { growthData } from "@/lib/mock-data";

export function GrowthChart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-sm"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold">Cross-Platform Growth</h3>
          <p className="text-zinc-500 text-xs">Combined followers across Insta, GMB, and YouTube</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-medium text-zinc-500 uppercase">Insta</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-500" />
            <span className="text-[10px] font-medium text-zinc-500 uppercase">GMB</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-lime-500" />
            <span className="text-[10px] font-medium text-zinc-500 uppercase">YT</span>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={growthData}>
            <defs>
              <linearGradient id="colorInsta" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorGmb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: "#888" }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: "#888" }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "rgba(255, 255, 255, 0.8)", 
                borderRadius: "12px", 
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                backdropFilter: "blur(8px)"
              }}
              itemStyle={{ fontSize: "12px", fontWeight: "600" }}
            />
            <Area 
              type="monotone" 
              dataKey="insta" 
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorInsta)" 
            />
            <Area 
              type="monotone" 
              dataKey="gmb" 
              stroke="#14b8a6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorGmb)" 
            />
            <Area 
              type="monotone" 
              dataKey="youtube" 
              stroke="#84cc16" 
              strokeWidth={3}
              fillOpacity={0} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
