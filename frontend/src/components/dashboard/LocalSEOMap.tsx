"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";

interface LocalSEOMapProps {
  city?: string;
}

export function LocalSEOMap({ city }: LocalSEOMapProps) {
  const points = [
    { x: "20%", y: "30%", scale: 1.5, opacity: 0.9 },
    { x: "50%", y: "45%", scale: 2.5, opacity: 1 },
    { x: "75%", y: "25%", scale: 1.2, opacity: 0.8 },
    { x: "35%", y: "70%", scale: 1.8, opacity: 0.8 },
    { x: "65%", y: "75%", scale: 2.2, opacity: 0.9 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 h-full"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-500" />
          GMB Heatmap
        </h3>
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          {city || "Local Region"}
        </span>
      </div>

      <div className="relative aspect-video rounded-xl bg-gray-50 border border-gray-100 overflow-hidden group">
        {/* Simple stylized map grid */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#888_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* Heatmap points */}
        {points.map((point, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: point.scale, opacity: point.opacity }}
            transition={{ delay: i * 0.2, duration: 2, repeat: Infinity, repeatType: "reverse" }}
            className="absolute w-8 h-8 rounded-full bg-blue-500/40 blur-lg"
            style={{ left: point.x, top: point.y }}
          />
        ))}

        {/* Central Marker */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/40" />
            <div className="relative w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="p-2 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200 text-[10px] font-bold shadow-sm">
            <p className="text-gray-500">STATUS</p>
            <p className="text-blue-600 flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              TRACKING VISIBILITY
            </p>
          </div>
          <button className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg">
            <Navigation className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
