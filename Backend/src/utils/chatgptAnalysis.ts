import axios from 'axios';
import { env } from '../config/env';
import logger from './logger';
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
export async function analyzeVideoWithChatGPT(
    videoUrl: string,
    platform: 'instagram' | 'youtube',
    stats: VideoStats,
    competitorData?: string
): Promise<AIAnalysisResult | null> {
    if (!env.OPENAI_API_KEY) {
        logger.warn('OpenAI API Key not configured');
        return null;
    }

    try {
        const prompt = buildAnalysisPrompt(videoUrl, platform, stats, competitorData);

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert marketing analyst specializing in social media video content analysis. 
Your task is to analyze video performance data and provide actionable insights for business growth.
Respond in JSON format only, no additional text.`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            },
            {
                headers: {
                    'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const content = response.data.choices[0].message.content;
        const parsed = JSON.parse(content);

        return {
            summary: parsed.summary || '',
            keyInsights: parsed.keyInsights || [],
            audienceType: parsed.audienceType || 'Unknown',
            audienceSentiment: parsed.audienceSentiment || 'neutral',
            topicsMentioned: parsed.topicsMentioned || [],
            recommendations: parsed.recommendations || [],
            leadQualityScore: parsed.leadQualityScore || 0
        };
    } catch (error: any) {
        const errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        logger.error(`Error analyzing video with ChatGPT (${error.response?.status}): ${errorData}`);
        return null;
    }
}

/**
 * Build a comprehensive prompt for ChatGPT
 */
function buildAnalysisPrompt(
    videoUrl: string,
    platform: 'instagram' | 'youtube',
    stats: VideoStats,
    competitorData?: string
): string {
    const statsText = `
Video Platform: ${platform}
Views: ${stats.views || 'N/A'}
Likes: ${stats.likes || 'N/A'}
Comments: ${stats.comments || 'N/A'}
Shares: ${stats.shares || 'N/A'}
Engagement: ${stats.engagement || 'N/A'}
Engagement Rate: ${stats.engagementRate || 'N/A'}%
Reach: ${stats.reach || 'N/A'}
Impressions: ${stats.impressions || 'N/A'}
`;

    return `
Please analyze the following video performance data and provide comprehensive insights for competitor analysis:

Video URL: ${videoUrl}

Performance Metrics:
${statsText}

${competitorData ? `Competitor Context:\n${competitorData}\n` : ''}

Please provide your analysis in the following JSON format:
{
  "summary": "2-3 sentence summary of video performance",
  "keyInsights": [
    "insight 1",
    "insight 2",
    "insight 3",
    "insight 4",
    "insight 5"
  ],
  "audienceType": "Target audience demographic/type",
  "audienceSentiment": "positive|negative|neutral|mixed",
  "topicsMentioned": ["topic1", "topic2", "topic3"],
  "recommendations": [
    "actionable recommendation 1",
    "actionable recommendation 2",
    "actionable recommendation 3"
  ],
  "leadQualityScore": 0-100
}

Focus on:
1. What makes this content successful or unsuccessful
2. Who the audience is and what they care about
3. Potential business value and lead generation opportunity
4. Actionable recommendations for improvement
5. How this compares to competitor performance (if provided)
`;
}
