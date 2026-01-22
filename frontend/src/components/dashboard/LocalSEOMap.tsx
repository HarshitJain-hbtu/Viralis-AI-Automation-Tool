"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";

export function LocalSEOMap() {
  const points = [
    { x: "20%", y: "30%", scale: 1.5, opacity: 0.8 },
    { x: "50%", y: "45%", scale: 2.5, opacity: 0.9 },
    { x: "75%", y: "25%", scale: 1.2, opacity: 0.6 },
    { x: "35%", y: "70%", scale: 1.8, opacity: 0.7 },
    { x: "65%", y: "75%", scale: 2.2, opacity: 0.85 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-sm overflow-hidden"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-500" />
          GMB Heatmap
        </h3>
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          Downtown Region
        </span>
      </div>

      <div className="relative aspect-video rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 overflow-hidden group">
        {/* Simple stylized map grid */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#888_1px,transparent_1px)] [background-size:20px_20px]" />
        
        {/* Heatmap points */}
        {points.map((point, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: point.scale, opacity: point.opacity }}
            transition={{ delay: i * 0.2, duration: 2, repeat: Infinity, repeatType: "reverse" }}
            className="absolute w-8 h-8 rounded-full bg-blue-500/30 blur-xl"
            style={{ left: point.x, top: point.y }}
          />
        ))}

        {/* Central Marker */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-purple-500/40" />
            <div className="relative w-4 h-4 bg-purple-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="p-2 rounded-lg bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-white/20 text-[10px] font-bold">
            <p className="text-zinc-400">RANKING #1 IN</p>
            <p className="text-blue-600">8 LOCATIONS</p>
          </div>
          <button className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg">
            <Navigation className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
