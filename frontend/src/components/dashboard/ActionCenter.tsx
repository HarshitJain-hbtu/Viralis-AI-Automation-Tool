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
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-500" />
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
                className="flex items-center justify-between p-4 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/20 dark:border-white/10 group hover:border-emerald-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
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
        whileHover={{ scale: 1.02 }}
        className="relative rounded-3xl overflow-hidden group h-full min-h-[200px]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-600 opacity-90 group-hover:opacity-100 transition-opacity" />
        <img 
          src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=60" 
          alt="Studio" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
          <div>
            <h4 className="text-2xl font-black mb-2">Video Studio</h4>
            <p className="text-emerald-100 text-sm font-medium leading-relaxed">
              Generate 10 viral reels in 60 seconds using AI.
            </p>
          </div>
          <Button className="w-full bg-white text-emerald-600 hover:bg-zinc-100 rounded-2xl h-12 font-bold gap-2">
            Quick Generate <Video className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
