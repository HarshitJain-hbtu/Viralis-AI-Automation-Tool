import Redis from 'ioredis';
import { env } from './env';
import logger from '../utils/logger';

let redisClient: Redis | null = null;

export function connectRedis() {
    if (redisClient) return redisClient;

    redisClient = new Redis({
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        maxRetriesPerRequest: 3,
    });

    redisClient.on('connect', () => {
        logger.info('✅ Redis connected');
    });

    redisClient.on('error', (err) => {
        logger.error('❌ Redis connection error:', err);
    });

    return redisClient;
}

export function getRedisClient() {
    if (!redisClient) {
        throw new Error('Redis client not initialized');
    }
    return redisClient;
}
