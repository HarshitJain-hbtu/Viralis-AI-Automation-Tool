import { Request, Response, NextFunction } from 'express';
/**
 * Application-level error with an attached HTTP status code.
 * Throw this from controllers/services for predictable, client-safe errors.
 */
export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number);
}
/**
 * Wraps an async route handler so any rejected promise is forwarded to
 * Express' error pipeline instead of crashing the process or hanging.
 */
export declare const asyncHandler: (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) => (req: Request, res: Response, next: NextFunction) => void;
/** 404 handler for unmatched routes. */
export declare function notFoundHandler(req: Request, res: Response): void;
/**
 * Global error handler. MUST be registered last, after all routes.
 */
export declare function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void;
//# sourceMappingURL=errorHandler.d.ts.map