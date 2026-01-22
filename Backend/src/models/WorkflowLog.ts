import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkflowLog extends Document {
    businessId: mongoose.Types.ObjectId;
    workflowId: string;
    workflowName?: string;
    executionId?: string;
    status: 'success' | 'failed' | 'running';
    triggerType: string;
    startTime: Date;
    endTime?: Date;
    error?: string;
    meta?: any;
    createdAt: Date;
    updatedAt: Date;
}

const workflowLogSchema = new Schema<IWorkflowLog>(
    {
        businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
        workflowId: { type: String, required: true },
        workflowName: { type: String },
        executionId: { type: String },
        status: {
            type: String,
            enum: ['success', 'failed', 'running'],
            default: 'running',
            index: true
        },
        triggerType: { type: String },
        startTime: { type: Date, default: Date.now },
        endTime: { type: Date },
        error: { type: String },
        meta: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

export const WorkflowLog = mongoose.model<IWorkflowLog>('WorkflowLog', workflowLogSchema);
