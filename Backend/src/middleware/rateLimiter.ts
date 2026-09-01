import rateLimit from 'express-rate-limit';

/**
 * General API limiter — protects all routes from abuse/DoS.
 * Generous enough for normal usage, disabled in test env.
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
    skip: () => process.env.NODE_ENV === 'test',
});

/**
 * Stricter limiter for authentication endpoints to slow brute-force attacks.
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many authentication attempts, please try again later.' },
    skip: () => process.env.NODE_ENV === 'test',
});
