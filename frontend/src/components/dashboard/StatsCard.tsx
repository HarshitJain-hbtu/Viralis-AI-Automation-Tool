"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Phone, ShieldCheck, DollarSign, Eye } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: string;
  color: string;
  index: number;
}

const icons: Record<string, any> = {
  "Total Reach": Eye,
  "Voice Leads": Phone,
  "Consistency Score": ShieldCheck,
  "Est. Ad Value": DollarSign,
};

export function StatsCard({ title, value, change, trend, color, index }: StatsCardProps) {
  const Icon = icons[title] || Eye;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-6 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
          color === "purple" && "bg-emerald-500/10 text-emerald-600",
          color === "green" && "bg-green-500/10 text-green-600",
          color === "blue" && "bg-teal-500/10 text-teal-600",
          color === "pink" && "bg-lime-500/10 text-lime-600"
        )}>
          <Icon className="w-6 h-6" />
        </div>
        {trend === "up" && (
          <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
            <TrendingUp className="w-3 h-3" />
            {change}
          </div>
        )}
        {trend === "pulse" && (
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {change}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold mt-1 tracking-tight">{value}</p>
        {trend === "neutral" && (
          <p className="text-zinc-400 text-[10px] mt-1 font-medium">{change}</p>
        )}
        {title === "Est. Ad Value" && (
          <p className="text-zinc-400 text-[10px] mt-1 font-medium">{change}</p>
        )}
      </div>
    </motion.div>
  );
}
