import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
    businessId: mongoose.Types.ObjectId;
    name: string;
    email?: string;
    phone?: string;
    score: number;
    status: 'new' | 'qualified' | 'contacted' | 'closed' | 'archived';
    source?: 'Voice Call' | 'Instagram DM' | 'Website' | 'Manual';

    // AI Analysis
    intentScore?: number; // 0-100
    aiSummary?: string;
    nextAction?: string;
    personalityType?: string; // e.g. "Direct", "Cautious"

    transcriptId?: mongoose.Types.ObjectId;

    // History
    interactionHistory: Array<{
        type: string;
        date: Date;
        summary: string;
        transcriptId?: mongoose.Types.ObjectId;
    }>;

    tags: string[];
    customFields?: Map<string, any>;
    notes?: string;

    createdAt: Date;
    updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
    {
        businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
        name: { type: String, required: true },
        email: { type: String },
        phone: { type: String },
        score: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ['new', 'qualified', 'contacted', 'closed', 'archived'],
            default: 'new',
            index: true
        },
        source: {
            type: String,
            enum: ['Voice Call', 'Instagram DM', 'Website', 'Manual'],
            default: 'Manual'
        },

        // AI Analysis
        intentScore: { type: Number, min: 0, max: 100 },
        aiSummary: String,
        nextAction: String,
        personalityType: String,

        transcriptId: { type: Schema.Types.ObjectId, ref: 'Transcript' },

        interactionHistory: [{
            type: { type: String, required: true },
            date: { type: Date, default: Date.now },
            summary: String,
            transcriptId: { type: Schema.Types.ObjectId, ref: 'Transcript' }
        }],

        tags: [{ type: String }],
        customFields: { type: Map, of: Schema.Types.Mixed },
        notes: { type: String },
    },
    { timestamps: true }
);

export const Lead = mongoose.model<ILead>('Lead', leadSchema);
