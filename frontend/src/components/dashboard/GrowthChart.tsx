"use client";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  YAxis,
  XAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import { growthData } from "@/lib/mock-data";

export function GrowthChart() {
  return (
    <div className="h-full w-full min-h-[100px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorInsta" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorGmb" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
          />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ fontSize: '12px' }}
          />
          <Area
            type="stepAfter"
            dataKey="insta"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#colorInsta)"
            name="Instagram"
          />
          <Area
            type="stepAfter"
            dataKey="gmb"
            stroke="#f59e0b"
            strokeWidth={2}
            fill="url(#colorGmb)"
            name="GMB"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
