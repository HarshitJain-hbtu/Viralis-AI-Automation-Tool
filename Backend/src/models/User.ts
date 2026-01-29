import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

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

const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, select: false },
        googleId: { type: String },
        name: { type: String, required: true },
        role: { type: String, enum: ['admin', 'user'], default: 'user' },
        businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
        socialAccounts: {
            youtube: {
                accessToken: String,
                refreshToken: String,
                channelId: String,
                stats: Schema.Types.Mixed
            },
            facebook: {
                accessToken: String,
                userId: String,
                pageId: String,
                stats: Schema.Types.Mixed
            },
            instagram: {
                stats: Schema.Types.Mixed
            }
        }
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err as Error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidate: string) {
    if (!this.password) return false;
    return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
