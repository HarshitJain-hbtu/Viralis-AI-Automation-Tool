import mongoose, { Schema, Document } from 'mongoose';

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

    // Raw Platform Stats
    platformStats: IPlatformStats;

    // AI Analysis Results (from ChatGPT)
    aiSummary?: string;
    keyInsights?: string[];
    audienceType?: string;
    audienceSentiment?: 'positive' | 'negative' | 'neutral' | 'mixed';
    topicsMentioned?: string[];
    recommendations?: string[];
    thumbnailUrl?: string;
    description?: string;

    // Lead Generation Data
    leadQualityScore?: number; // 0-100

    analyzedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const videoAnalysisSchema = new Schema<IVideoAnalysis>(
    {
        businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
        contentId: { type: Schema.Types.ObjectId, ref: 'Content', required: true, index: true },
        videoUrl: { type: String, required: true },
        platform: {
            type: String,
            enum: ['instagram', 'youtube'],
            required: true,
            index: true
        },

        platformStats: {
            platform: { type: String, enum: ['instagram', 'youtube'], required: true },
            views: { type: Number },
            likes: { type: Number },
            comments: { type: Number },
            shares: { type: Number },
            impressions: { type: Number },
            reach: { type: Number },
            saves: { type: Number },
            engagement: { type: Number },
            engagementRate: { type: Number },
            fetchedAt: { type: Date, default: Date.now }
        },

        aiSummary: { type: String },
        keyInsights: [{ type: String }],
        audienceType: { type: String },
        audienceSentiment: {
            type: String,
            enum: ['positive', 'negative', 'neutral', 'mixed']
        },
        topicsMentioned: [{ type: String }],
        recommendations: [{ type: String }],
        thumbnailUrl: { type: String },
        description: { type: String },

        leadQualityScore: { type: Number, min: 0, max: 100 },

        analyzedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const VideoAnalysis = mongoose.model<IVideoAnalysis>('VideoAnalysis', videoAnalysisSchema);
