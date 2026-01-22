"use client";

import { motion } from "framer-motion";
import { Mic, CheckCircle2 } from "lucide-react";

export function BrandVoiceMeter() {
  const score = 92;
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-sm flex flex-col items-center justify-center text-center"
    >
      <div className="w-full flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Mic className="w-4 h-4 text-emerald-500" />
          Brand Voice Alignment
        </h3>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
          OPTIMIZED
        </span>
      </div>

      <div className="relative w-32 h-32 mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-zinc-100 dark:text-zinc-800"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="40"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            fill="transparent"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black">{score}%</span>
          <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-tighter">Match</span>
        </div>
      </div>

      <p className="text-xs text-zinc-500 font-medium px-4 leading-relaxed">
        Your AI content is currently <span className="text-emerald-600 font-bold">92%</span> aligned with your "Expert Surgeon" persona.
      </p>
    </motion.div>
  );
}
