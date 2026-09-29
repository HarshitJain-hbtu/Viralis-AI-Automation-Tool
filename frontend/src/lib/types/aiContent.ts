// src/types/aiContent.ts

export type SupportedPlatform =
  | 'Instagram Post'
  | 'Instagram Reel'
  | 'Facebook'
  | 'YouTube Video'
  | 'YouTube Shorts'
  | 'LinkedIn';

export interface SceneItem {
  time: string;
  type: string;
  text: string;
  onScreenText: string;
  visual: string;
}

export interface DayPost {
  id?: string;
  platform?: string;
  targetDate?: string;
  scheduledDate?: string;
  strategyType?: 'viral' | 'reach' | 'niche';
  hook: string;
  hookAlternatives?: string[];
  caption: string;
  hashtags: string[];
  cta: string;
  best_time?: string;
  bestTime?: string;
  visual_prompt?: string;
  visualPrompt?: string;
  imageUrl?: string;
  storyboard?: SceneItem[];
  voiceoverScript?: string;
  youtubeTitles?: string[];
  youtubeDescription?: string;
  thumbnailPrompt?: string;
  thumbnailText?: string;
  linkedinTakeaways?: string[];
  discussionQuestion?: string;
  post_type?: "carousel" | "reel" | "story" | "static" | string;
  day?: number | string;
  status?: 'posted' | 'scheduled' | 'draft';
}

export interface PostVariations {
  viral: DayPost;
  reach: DayPost;
  niche: DayPost;
}

export interface CalendarResponse {
  calendarId: string;
  calendar: DayPost[];
  message: string;
}
