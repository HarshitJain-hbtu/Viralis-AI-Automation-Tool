import mongoose, { Document } from 'mongoose';
export interface ITranscript extends Document {
    businessId: mongoose.Types.ObjectId;
    leadId?: mongoose.Types.ObjectId;
    text: string;
    audioUrl?: string;
    durationSeconds?: number;
    sentiment?: 'positive' | 'neutral' | 'negative';
    intent?: string;
    topics?: string[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const Transcript: mongoose.Model<ITranscript, {}, {}, {}, mongoose.Document<unknown, {}, ITranscript, {}, {}> & ITranscript & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Transcript.d.ts.map