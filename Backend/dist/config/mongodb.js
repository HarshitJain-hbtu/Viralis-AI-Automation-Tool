"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongoDB = connectMongoDB;
exports.disconnectMongoDB = disconnectMongoDB;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const logger_1 = __importDefault(require("../utils/logger"));
// Fail fast on unbuffered operations instead of hanging forever when disconnected.
mongoose_1.default.set('bufferTimeoutMS', 10000);
let listenersBound = false;
function bindConnectionListeners() {
    if (listenersBound)
        return;
    listenersBound = true;
    mongoose_1.default.connection.on('connected', () => logger_1.default.info('✅ MongoDB Connected'));
    mongoose_1.default.connection.on('error', (err) => logger_1.default.error('MongoDB error:', err));
    mongoose_1.default.connection.on('disconnected', () => logger_1.default.warn('⚠️  MongoDB disconnected — will attempt to reconnect'));
    mongoose_1.default.connection.on('reconnected', () => logger_1.default.info('🔄 MongoDB reconnected'));
}
/**
 * Connects to MongoDB with bounded retries and exponential backoff.
 * The server can still boot if the DB is temporarily unavailable; Mongoose
 * will keep retrying the initial connection in the background.
 */
async function connectMongoDB(maxRetries = 5) {
    bindConnectionListeners();
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await mongoose_1.default.connect(env_1.env.MONGO_URI, {
                serverSelectionTimeoutMS: 10000,
            });
            return;
        }
        catch (error) {
            const isLast = attempt === maxRetries;
            logger_1.default.error(`❌ MongoDB connection attempt ${attempt}/${maxRetries} failed${isLast ? '' : ' — retrying'}:`, error instanceof Error ? error.message : error);
            if (isLast) {
                // Don't crash the process — let the server run and rely on
                // Mongoose's automatic reconnection for subsequent attempts.
                logger_1.default.error('❌ Exhausted MongoDB connection retries. Server will keep running.');
                return;
            }
            const backoff = Math.min(1000 * 2 ** (attempt - 1), 15000);
            await new Promise((resolve) => setTimeout(resolve, backoff));
        }
    }
}
/** Gracefully closes the MongoDB connection (used during shutdown). */
async function disconnectMongoDB() {
    try {
        await mongoose_1.default.connection.close();
        logger_1.default.info('MongoDB connection closed');
    }
    catch (error) {
        logger_1.default.error('Error closing MongoDB connection:', error);
    }
}
//# sourceMappingURL=mongodb.js.map