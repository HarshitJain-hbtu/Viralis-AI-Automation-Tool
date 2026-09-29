"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.AppError = void 0;
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
const logger_1 = __importDefault(require("../utils/logger"));
const env_1 = require("../config/env");
/**
 * Application-level error with an attached HTTP status code.
 * Throw this from controllers/services for predictable, client-safe errors.
 */
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
exports.AppError = AppError;
/**
 * Wraps an async route handler so any rejected promise is forwarded to
 * Express' error pipeline instead of crashing the process or hanging.
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
/** 404 handler for unmatched routes. */
function notFoundHandler(req, res) {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.originalUrl} does not exist`,
    });
}
/** Normalizes common error shapes into a consistent JSON response. */
function resolveError(err) {
    // Explicit application errors
    if (err instanceof AppError) {
        return { statusCode: err.statusCode, message: err.message };
    }
    // Mongoose validation errors
    if (err?.name === 'ValidationError') {
        const message = Object.values(err.errors || {})
            .map((e) => e.message)
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
function errorHandler(err, _req, res, _next) {
    const { statusCode, message } = resolveError(err);
    // Log server-side errors with full detail; client errors at a lower level.
    if (statusCode >= 500) {
        logger_1.default.error('Unhandled error:', { message: err?.message, stack: err?.stack });
    }
    else {
        logger_1.default.warn(`Request error (${statusCode}): ${message}`);
    }
    // Never leak internal details to clients in production for 5xx.
    const clientMessage = statusCode >= 500 && env_1.env.NODE_ENV === 'production' ? 'Internal Server Error' : message;
    res.status(statusCode).json({
        error: clientMessage,
        ...(env_1.env.NODE_ENV !== 'production' && statusCode >= 500 ? { stack: err?.stack } : {}),
    });
}
//# sourceMappingURL=errorHandler.js.map