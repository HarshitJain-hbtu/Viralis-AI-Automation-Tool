export interface DayPost {
    day: number;
    hook: string;
    caption: string;
    hashtags: string[];
    post_type: "carousel" | "reel" | "story" | "static";
    best_time: string;
    cta: string;
    visual_prompt: string;
}
export interface CalendarInput {
    niche: string;
    platform: string;
    city: string;
    description?: string;
    brandName?: string;
}
/**
 * Generates a 30-day social media calendar using the Gemini API.
 * @param input - The user's requirements for the calendar.
 * @returns A promise that resolves to an array of 30 DayPost objects.
 */
export declare function generate30DayCalendar(input: CalendarInput): Promise<DayPost[]>;
export interface DailyPostInput extends CalendarInput {
    date: string;
    context: {
        last7DaysContent: string[];
        recentStats: string;
        brandPositioning: string;
    };
}
export interface PostVariations {
    viral: DayPost;
    reach: DayPost;
    niche: DayPost;
}
export declare function generateDailyPost(input: DailyPostInput): Promise<PostVariations>;
//# sourceMappingURL=aiContentService.d.ts.map