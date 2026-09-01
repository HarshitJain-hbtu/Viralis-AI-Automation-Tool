import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { env } from '../config/env';

/**
 * Application-level error with an attached HTTP status code.
 * Throw this from controllers/services for predictable, client-safe errors.
 */
export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace?.(this, this.constructor);
    }
}

/**
 * Wraps an async route handler so any rejected promise is forwarded to
 * Express' error pipeline instead of crashing the process or hanging.
 */
export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/** 404 handler for unmatched routes. */
export function notFoundHandler(req: Request, res: Response) {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.originalUrl} does not exist`,
    });
}

/** Normalizes common error shapes into a consistent JSON response. */
function resolveError(err: any): { statusCode: number; message: string } {
    // Explicit application errors
    if (err instanceof AppError) {
        return { statusCode: err.statusCode, message: err.message };
    }

    // Mongoose validation errors
    if (err?.name === 'ValidationError') {
        const message = Object.values(err.errors || {})
            .map((e: any) => e.message)
            .join(', ');
        return { statusCode: 400, message: message || 'Validation failed' };
    }

    // Mongoose bad ObjectId / cast errors
    if (err?.name === 'CastError') {
        return { statusCode: 400, message: `Invalid value for ${err.path}` };
    }

    // Mongo duplicate key
    if (err?.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        return { statusCode: 409, message: `${field} already exists` };
    }

    // JWT errors
    if (err?.name === 'JsonWebTokenError') {
        return { statusCode: 401, message: 'Invalid token' };
    }
    if (err?.name === 'TokenExpiredError') {
        return { statusCode: 401, message: 'Token expired' };
    }

    // Body parser / malformed JSON
    if (err?.type === 'entity.parse.failed') {
        return { statusCode: 400, message: 'Malformed JSON in request body' };
    }

    return { statusCode: err?.statusCode || 500, message: err?.message || 'Internal Server Error' };
}

/**
 * Global error handler. MUST be registered last, after all routes.
 */
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
    const { statusCode, message } = resolveError(err);

    // Log server-side errors with full detail; client errors at a lower level.
    if (statusCode >= 500) {
        logger.error('Unhandled error:', { message: err?.message, stack: err?.stack });
    } else {
        logger.warn(`Request error (${statusCode}): ${message}`);
    }

    // Never leak internal details to clients in production for 5xx.
    const clientMessage =
        statusCode >= 500 && env.NODE_ENV === 'production' ? 'Internal Server Error' : message;

    res.status(statusCode).json({
        error: clientMessage,
        ...(env.NODE_ENV !== 'production' && statusCode >= 500 ? { stack: err?.stack } : {}),
    });
}
