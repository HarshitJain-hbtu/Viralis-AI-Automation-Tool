/**
 * General API limiter — protects all routes from abuse/DoS.
 * Generous enough for normal usage, disabled in test env.
 */
export declare const apiLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Stricter limiter for authentication endpoints to slow brute-force attacks.
 */
export declare const authLimiter: import("express-rate-limit").RateLimitRequestHandler;
//# sourceMappingURL=rateLimiter.d.ts.map