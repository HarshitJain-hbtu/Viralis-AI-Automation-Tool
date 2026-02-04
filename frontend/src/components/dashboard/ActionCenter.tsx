"use client";

import { motion } from "framer-motion";
import {
  Rocket,
  MessageCircle,
  Star,
  Sparkles,
  ChevronRight,
  TrendingUp,
  CalendarCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

// More realistic "General Business" actions instead of specific dental ones
const recommendedActions = [
  {
    id: 1,
    text: "Schedule content for next week to maintain consistency",
    icon: "calendar",
    priority: "HIGH",
  },
  {
    id: 2,
    text: "Review competitor performance report",
    icon: "rocket",
    priority: "MEDIUM",
  },
  {
    id: 3,
    text: "Check new leads from recent campaigns",
    icon: "star",
    priority: "LOW",
  }
];

const icons: Record<string, any> = {
  rocket: TrendingUp,
  message: MessageCircle,
  star: Star,
  calendar: CalendarCheck
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
                transition={{ delay: index * 0.1 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer group gap-4 sm:gap-0"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.priority === 'HIGH' ? 'bg-blue-50 text-blue-600' :
                    action.priority === 'MEDIUM' ? 'bg-purple-50 text-purple-600' :
                      'bg-gray-50 text-gray-600'
                    }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{action.text}</p>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${action.priority === 'HIGH' ? 'text-blue-600' :
                      action.priority === 'MEDIUM' ? 'text-purple-600' :
                        'text-gray-400'
                      }`}>
                      Priority: {action.priority}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-blue-500 transition-colors" />
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        className="relative rounded-2xl overflow-hidden group h-full min-h-[200px] shadow-sm cursor-pointer"
        onClick={() => window.location.href = '/dashboard/ai-calendar'}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: "url('/assets/content-studio-banner.png')" }}
        />
        {/* Overlay for legibility */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

        <div className="relative inset-0 p-8 flex flex-col justify-between text-white relative z-10">
          <div>
            <h4 className="text-2xl font-black mb-2 text-white drop-shadow-md">Content Studio</h4>
            <p className="text-gray-100 text-sm font-medium leading-relaxed drop-shadow-sm max-w-[90%]">
              Generate viral posts, schedule content, and manage your calendar.
            </p>
          </div>
          <Button className="w-[90%] absolute -bottom-20 right-5 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 rounded-xl h-12 font-bold gap-2">
            Open Studio <Sparkles className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
