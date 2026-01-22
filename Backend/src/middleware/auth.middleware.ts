import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                businessId: string;
                role: string;
            };
        }
    }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    req.user = decoded;
    next();
    return;
}
