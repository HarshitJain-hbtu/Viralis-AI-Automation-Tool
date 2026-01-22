import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string;
    password?: string;
    googleId?: string;
    name: string;
    role: 'admin' | 'user';
    businessId: mongoose.Types.ObjectId;
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
