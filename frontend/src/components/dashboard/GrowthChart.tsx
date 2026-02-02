"use client";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  YAxis,
  XAxis,
  CartesianGrid,
  Legend,
  Tooltip
} from "recharts";
import { growthData } from "@/lib/mock-data";

interface GrowthChartProps {
  data?: any[];
}

export function GrowthChart({ data }: GrowthChartProps) {
  // Use passed data or fallback to default growth curve
  const chartData = data || growthData;

  return (
    <div className="h-full w-full min-h-[100px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorInsta" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#833ab4" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#833ab4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorYt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff0000" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#ff0000" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
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
            domain={[0, (dataMax: number) => (dataMax === 0 ? 100 : dataMax * 1.2)]}
          />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ fontSize: '12px' }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Area
            type="monotone"
            dataKey="instagram"
            stroke="#833ab4"
            strokeWidth={2}
            fill="url(#colorInsta)"
            name="Instagram"
          />
          <Area
            type="monotone"
            dataKey="youtube"
            stroke="#ff0000"
            strokeWidth={2}
            fill="url(#colorYt)"
            name="YouTube"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
