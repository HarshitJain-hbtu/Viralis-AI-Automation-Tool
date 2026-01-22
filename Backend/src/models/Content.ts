import mongoose, { Schema, Document } from 'mongoose';

export interface IContent extends Document {
    businessId: mongoose.Types.ObjectId;
    title: string;
    body: string;
    type: 'post' | 'article' | 'email' | 'tweet';
    platform?: 'twitter' | 'linkedin' | 'email' | 'blog';
    status: 'draft' | 'scheduled' | 'published' | 'failed';
    scheduledFor?: Date;
    aiGenerated: boolean;
    meta?: any;
    createdAt: Date;
    updatedAt: Date;
}

const contentSchema = new Schema<IContent>(
    {
        businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
        title: { type: String, required: true },
        body: { type: String, required: true },
        type: {
            type: String,
            enum: ['post', 'article', 'email', 'tweet'],
            required: true
        },
        platform: { type: String, enum: ['twitter', 'linkedin', 'email', 'blog'] },
        status: {
            type: String,
            enum: ['draft', 'scheduled', 'published', 'failed'],
            default: 'draft',
            index: true
        },
        scheduledFor: { type: Date },
        aiGenerated: { type: Boolean, default: false },
        meta: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

export const Content = mongoose.model<IContent>('Content', contentSchema);
