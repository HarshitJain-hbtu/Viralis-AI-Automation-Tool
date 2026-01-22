import jwt from 'jsonwebtoken';
import { env } from '../config/env';

interface ITokenPayload {
    userId: string;
    businessId: string;
    role: string;
}

export function signToken(payload: ITokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): ITokenPayload | null {
    try {
        return jwt.verify(token, env.JWT_SECRET) as ITokenPayload;
    } catch (error) {
        return null;
    }
}
