import mongoose, { Document } from 'mongoose';
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
export declare const WorkflowLog: mongoose.Model<IWorkflowLog, {}, {}, {}, mongoose.Document<unknown, {}, IWorkflowLog, {}, {}> & IWorkflowLog & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=WorkflowLog.d.ts.map