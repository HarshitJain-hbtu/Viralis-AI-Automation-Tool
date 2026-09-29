export type SupportedPlatform = 'Instagram Post' | 'Instagram Reel' | 'Facebook' | 'YouTube Video' | 'YouTube Shorts' | 'LinkedIn';
export interface BusinessContext {
    name: string;
    niche: string;
    description?: string;
    location?: string;
    services?: Array<{
        name: string;
        price: string;
    }>;
    brandVoiceTone?: string;
    targetAudience?: string;
    customContext?: string;
}
export interface SceneItem {
    time: string;
    type: string;
    text: string;
    onScreenText: string;
    visual: string;
}
export interface StudioContentOutput {
    platform: string;
    targetDate: string;
    strategyType: 'viral' | 'reach' | 'niche';
    hook: string;
    hookAlternatives?: string[];
    caption: string;
    hashtags: string[];
    cta: string;
    bestTime: string;
    visualPrompt: string;
    imageUrl: string;
    storyboard?: SceneItem[];
    voiceoverScript?: string;
    youtubeTitles?: string[];
    youtubeDescription?: string;
    thumbnailPrompt?: string;
    thumbnailText?: string;
    linkedinTakeaways?: string[];
    discussionQuestion?: string;
}
export interface StudioContentResponse {
    viral: StudioContentOutput;
    reach: StudioContentOutput;
    niche: StudioContentOutput;
}
/**
 * Generates tailored publication-ready content using Gemini and attaches AI images
 */
export declare function generateStudioContent(platform: SupportedPlatform, business: BusinessContext, date: string): Promise<StudioContentResponse>;
//# sourceMappingURL=contentStudioService.d.ts.map