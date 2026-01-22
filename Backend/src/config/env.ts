import Joi from 'joi';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production').default('development'),
    PORT: Joi.number().default(5000),

    // Database
    MONGO_URI: Joi.string().required(),
    REDIS_HOST: Joi.string().default('localhost'),
    REDIS_PORT: Joi.number().default(6379),

    // N8N
    N8N_WEBHOOK_URL: Joi.string().optional().default('http://localhost:5678/webhook'),

    // APIs (Optional for now to allow server start, but should be required in prod)
    GEMINI_API_KEY: Joi.string().optional(),
    DEEPGRAM_API_KEY: Joi.string().optional(),
    TWILIO_ACCOUNT_SID: Joi.string().optional(),
    TWILIO_AUTH_TOKEN: Joi.string().optional(),
    TWILIO_PHONE_NUMBER: Joi.string().optional(),

    // JWT
    JWT_SECRET: Joi.string().default('dev-secret'),

    // Logging
    LOG_LEVEL: Joi.string().default('info'),
}).unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
    throw new Error(`❌ Environment validation failed: ${error.message}`);
}

export const env = value;
