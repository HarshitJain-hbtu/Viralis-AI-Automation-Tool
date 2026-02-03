import mongoose, { Document } from 'mongoose';
export interface IPlatformStats {
    platform: 'instagram' | 'youtube';
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    impressions?: number;
    reach?: number;
    saves?: number;
    engagement?: number;
    engagementRate?: number;
    fetchedAt: Date;
}
export interface IVideoAnalysis extends Document {
    businessId: mongoose.Types.ObjectId;
    contentId: mongoose.Types.ObjectId;
    videoUrl: string;
    platform: 'instagram' | 'youtube';
    platformStats: IPlatformStats;
    aiSummary?: string;
    keyInsights?: string[];
    audienceType?: string;
    audienceSentiment?: 'positive' | 'negative' | 'neutral' | 'mixed';
    topicsMentioned?: string[];
    recommendations?: string[];
    thumbnailUrl?: string;
    description?: string;
    leadQualityScore?: number;
    analyzedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const VideoAnalysis: mongoose.Model<IVideoAnalysis, {}, {}, {}, mongoose.Document<unknown, {}, IVideoAnalysis, {}, {}> & IVideoAnalysis & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=VideoAnalysis.d.ts.map