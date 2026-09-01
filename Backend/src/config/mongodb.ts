import mongoose from 'mongoose';
import { env } from './env';
import logger from '../utils/logger';

// Fail fast on unbuffered operations instead of hanging forever when disconnected.
mongoose.set('bufferTimeoutMS', 10000);

let listenersBound = false;

function bindConnectionListeners() {
    if (listenersBound) return;
    listenersBound = true;

    mongoose.connection.on('connected', () => logger.info('✅ MongoDB Connected'));
    mongoose.connection.on('error', (err) => logger.error('MongoDB error:', err));
    mongoose.connection.on('disconnected', () =>
        logger.warn('⚠️  MongoDB disconnected — will attempt to reconnect')
    );
    mongoose.connection.on('reconnected', () => logger.info('🔄 MongoDB reconnected'));
}

/**
 * Connects to MongoDB with bounded retries and exponential backoff.
 * The server can still boot if the DB is temporarily unavailable; Mongoose
 * will keep retrying the initial connection in the background.
 */
export async function connectMongoDB(maxRetries = 5): Promise<void> {
    bindConnectionListeners();

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await mongoose.connect(env.MONGO_URI, {
                serverSelectionTimeoutMS: 10000,
            });
            return;
        } catch (error) {
            const isLast = attempt === maxRetries;
            logger.error(
                `❌ MongoDB connection attempt ${attempt}/${maxRetries} failed${isLast ? '' : ' — retrying'}:`,
                error instanceof Error ? error.message : error
            );

            if (isLast) {
                // Don't crash the process — let the server run and rely on
                // Mongoose's automatic reconnection for subsequent attempts.
                logger.error('❌ Exhausted MongoDB connection retries. Server will keep running.');
                return;
            }

            const backoff = Math.min(1000 * 2 ** (attempt - 1), 15000);
            await new Promise((resolve) => setTimeout(resolve, backoff));
        }
    }
}

/** Gracefully closes the MongoDB connection (used during shutdown). */
export async function disconnectMongoDB(): Promise<void> {
    try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed');
    } catch (error) {
        logger.error('Error closing MongoDB connection:', error);
    }
}
