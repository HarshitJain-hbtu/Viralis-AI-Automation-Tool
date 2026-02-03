import { VideoStats } from './platformApi';
export interface AIAnalysisResult {
    summary: string;
    keyInsights: string[];
    audienceType: string;
    audienceSentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
    topicsMentioned: string[];
    recommendations: string[];
    leadQualityScore: number;
}
/**
 * Send video stats to ChatGPT for analysis
 */
export declare function analyzeVideoWithChatGPT(videoUrl: string, platform: 'instagram' | 'youtube', stats: VideoStats, competitorData?: string): Promise<AIAnalysisResult | null>;
//# sourceMappingURL=chatgptAnalysis.d.ts.map