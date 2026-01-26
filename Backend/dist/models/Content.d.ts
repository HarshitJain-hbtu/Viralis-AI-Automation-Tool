import mongoose, { Document } from 'mongoose';
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
export declare const Content: mongoose.Model<IContent, {}, {}, {}, mongoose.Document<unknown, {}, IContent, {}, {}> & IContent & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Content.d.ts.map