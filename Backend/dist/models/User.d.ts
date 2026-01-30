import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    email: string;
    password?: string;
    googleId?: string;
    name: string;
    role: 'admin' | 'user';
    businessId: mongoose.Types.ObjectId;
    socialAccounts?: {
        youtube?: {
            accessToken: string;
            refreshToken?: string;
            channelId?: string;
            stats?: any;
        };
        facebook?: {
            accessToken: string;
            userId?: string;
            pageId?: string;
            stats?: any;
        };
        instagram?: {
            stats?: any;
        };
    };
    comparePassword(candidate: string): Promise<boolean>;
    createdAt: Date;
    updatedAt: Date;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.d.ts.map