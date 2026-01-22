"use client";

import { motion } from "framer-motion";
import {
  Rocket,
  MessageCircle,
  Star,
  Video,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { recommendedActions } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

const icons: Record<string, any> = {
  rocket: Rocket,
  message: MessageCircle,
  star: Star,
};

export function ActionCenter() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900">
          <Sparkles className="w-5 h-5 text-blue-600" />
          AI Advisor Suggestions
        </h3>
        <div className="space-y-3">
          {recommendedActions.map((action, index) => {
            const Icon = icons[action.icon] || Rocket;
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{action.text}</p>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                      Priority: {action.priority}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-emerald-500 transition-colors" />
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        className="relative rounded-2xl overflow-hidden group h-full min-h-[200px] shadow-sm"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-indigo-900 opacity-90 group-hover:opacity-100 transition-opacity" />
        <img
          src="/ai-studio.png"
          alt="Studio"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
        />
        <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
          <div>
            <h4 className="text-2xl font-black mb-2">Video Studio</h4>
            <p className="text-blue-100 text-sm font-medium leading-relaxed">
              Generate 10 viral reels in 60 seconds using AI.
            </p>
          </div>
          <Button className="w-full bg-white text-blue-600 hover:bg-gray-50 rounded-xl h-12 font-bold gap-2">
            Quick Generate <Video className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
