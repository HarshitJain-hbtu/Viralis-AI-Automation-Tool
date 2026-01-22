import mongoose, { Schema, Document } from 'mongoose';

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

const transcriptSchema = new Schema<ITranscript>(
    {
        businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
        leadId: { type: Schema.Types.ObjectId, ref: 'Lead', index: true },
        text: { type: String, required: true },
        audioUrl: { type: String },
        durationSeconds: { type: Number },
        sentiment: { type: String, enum: ['positive', 'neutral', 'negative'] },
        intent: { type: String },
        topics: [{ type: String }],
    },
    { timestamps: true }
);

export const Transcript = mongoose.model<ITranscript>('Transcript', transcriptSchema);
