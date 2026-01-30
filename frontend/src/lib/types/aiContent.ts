// src/types/aiContent.ts

export type DayPost = {
  day: number;
  hook: string;
  caption: string;
  hashtags: string[];
  post_type: "carousel" | "reel" | "story" | "static";
  best_time: string;
  cta: string;
  visual_prompt: string;
};

export interface CalendarResponse {
  calendarId: string;
  calendar: DayPost[];
  message: string;
}
