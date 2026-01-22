"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Play, Hash, FileText, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { calendarPosts, postDetailMock } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export function GrowthCalendar() {
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const days = Array.from({ length: 35 }, (_, i) => i - 3);

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold">Upcoming Content Schedule</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-xl"><ChevronLeft className="w-4 h-4" /></Button>
          <span className="text-sm font-bold">January 2026</span>
          <Button variant="ghost" size="icon" className="rounded-xl"><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-zinc-200 dark:bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="bg-zinc-50 dark:bg-zinc-900/50 p-4 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
        {days.map((day, idx) => {
          const posts = calendarPosts.filter((p) => p.date === day);
          const isToday = day === 20;

          return (
            <div
              key={idx}
              className={cn(
                "min-h-[120px] bg-white dark:bg-zinc-900/40 p-2 transition-colors",
                day <= 0 || day > 31 ? "opacity-20" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={cn(
                  "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full",
                  isToday ? "bg-emerald-600 text-white" : "text-zinc-500"
                )}>
                  {day > 0 && day <= 31 ? day : ""}
                </span>
              </div>
              <div className="space-y-1">
                {posts.map((post, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => setSelectedPost(post)}
                    className={cn(
                      "w-full text-left px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-transform active:scale-95",
                      post.color === "purple" && "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
                      post.color === "blue" && "bg-teal-500/10 text-teal-600 border border-teal-500/20",
                      post.color === "green" && "bg-lime-500/10 text-lime-600 border border-lime-500/20"
                    )}
                  >
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      post.color === "purple" && "bg-emerald-500",
                      post.color === "blue" && "bg-teal-500",
                      post.color === "green" && "bg-lime-500"
                    )} />
                    {post.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-white/10"
            >
              <div className="flex h-[600px]">
                <div className="w-1/2 bg-zinc-100 dark:bg-zinc-800 relative group overflow-hidden">
                  <img 
                    src={postDetailMock.videoUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 cursor-pointer hover:bg-white/40 transition-colors">
                      <Play className="text-white fill-white w-6 h-6 ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <div className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider">
                      {selectedPost.label} Preview
                    </div>
                  </div>
                </div>

                <div className="w-1/2 p-8 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold">{postDetailMock.title}</h3>
                      <p className="text-zinc-500 text-sm">Scheduled for Jan {selectedPost.date}, 2026</p>
                    </div>
                    <button 
                      onClick={() => setSelectedPost(null)}
                      className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                    <section>
                      <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest">
                        <FileText className="w-3 h-3" /> Caption
                      </div>
                      <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                        {postDetailMock.caption}
                      </p>
                    </section>

                    <section>
                      <div className="flex items-center gap-2 mb-2 text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-widest">
                        <Hash className="w-3 h-3" /> Hashtags
                      </div>
                      <p className="text-sm font-medium text-teal-600 dark:text-teal-400">
                        {postDetailMock.hashtags}
                      </p>
                    </section>

                    <section>
                      <div className="flex items-center gap-2 mb-2 text-lime-600 dark:text-lime-400 font-bold text-xs uppercase tracking-widest">
                        <Play className="w-3 h-3" /> AI Script
                      </div>
                      <div className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 italic">
                        {postDetailMock.script}
                      </div>
                    </section>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 font-bold">
                      Approve & Schedule
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-xl h-12 font-bold border-zinc-200 dark:border-zinc-700">
                      Regenerate
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
