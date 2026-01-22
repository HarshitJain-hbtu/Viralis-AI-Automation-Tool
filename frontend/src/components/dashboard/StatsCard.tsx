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
      className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          "bg-blue-50 text-blue-600"
        )}>
          <Icon className="w-6 h-6" />
        </div>
        {trend === "up" && (
          <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            {change}
          </div>
        )}
        {trend === "pulse" && (
          <div className="flex items-center gap-1 text-blue-600 text-xs font-semibold bg-blue-50 px-2 py-1 rounded-full">
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            {change}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {(trend === "neutral" || title === "Est. Ad Value") && (
          <p className="text-gray-400 text-xs mt-1">{change}</p>
        )}
      </div>
    </motion.div>
  );
}
