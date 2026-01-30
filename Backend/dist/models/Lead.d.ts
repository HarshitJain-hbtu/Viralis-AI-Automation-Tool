import mongoose, { Document } from 'mongoose';
export interface ILead extends Document {
    businessId: mongoose.Types.ObjectId;
    name: string;
    email?: string;
    phone?: string;
    score: number;
    status: 'new' | 'qualified' | 'contacted' | 'closed' | 'archived';
    source?: 'Voice Call' | 'Instagram DM' | 'Website' | 'Manual';
    intentScore?: number;
    aiSummary?: string;
    nextAction?: string;
    personalityType?: string;
    transcriptId?: mongoose.Types.ObjectId;
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
export declare const Lead: mongoose.Model<ILead, {}, {}, {}, mongoose.Document<unknown, {}, ILead, {}, {}> & ILead & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Lead.d.ts.map