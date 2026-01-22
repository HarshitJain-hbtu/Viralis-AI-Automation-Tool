import mongoose from 'mongoose';
import { env } from './env';
import logger from '../utils/logger';

export async function connectMongoDB() {
    try {
        await mongoose.connect(env.MONGO_URI);
        logger.info('✅ MongoDB Connected');
    } catch (error) {
        logger.error('❌ MongoDB connection failed:', error);
        process.exit(1);
    }
}
