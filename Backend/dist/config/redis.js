"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = connectRedis;
exports.getRedisClient = getRedisClient;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("./env");
const logger_1 = __importDefault(require("../utils/logger"));
let redisClient = null;
function connectRedis() {
    if (redisClient)
        return redisClient;
    redisClient = new ioredis_1.default({
        host: env_1.env.REDIS_HOST,
        port: env_1.env.REDIS_PORT,
        maxRetriesPerRequest: 3,
    });
    redisClient.on('connect', () => {
        logger_1.default.info('✅ Redis connected');
    });
    redisClient.on('error', (err) => {
        logger_1.default.error('❌ Redis connection error:', err);
    });
    return redisClient;
}
function getRedisClient() {
    if (!redisClient) {
        throw new Error('Redis client not initialized');
    }
    return redisClient;
}
//# sourceMappingURL=redis.js.map