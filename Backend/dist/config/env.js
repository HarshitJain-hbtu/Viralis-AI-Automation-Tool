"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const joi_1 = __importDefault(require("joi"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = joi_1.default.object({
    NODE_ENV: joi_1.default.string().valid('development', 'production').default('development'),
    PORT: joi_1.default.number().default(5000),
    // Database
    MONGO_URI: joi_1.default.string().required(),
    REDIS_HOST: joi_1.default.string().default('localhost'),
    REDIS_PORT: joi_1.default.number().default(6379),
    // N8N
    N8N_WEBHOOK_URL: joi_1.default.string().optional().default('http://localhost:5678/webhook'),
    // APIs (Optional for now to allow server start, but should be required in prod)
    GEMINI_API_KEY: joi_1.default.string().optional(),
    DEEPGRAM_API_KEY: joi_1.default.string().optional(),
    TWILIO_ACCOUNT_SID: joi_1.default.string().optional(),
    TWILIO_AUTH_TOKEN: joi_1.default.string().optional(),
    TWILIO_PHONE_NUMBER: joi_1.default.string().optional(),
    // JWT
    JWT_SECRET: joi_1.default.string().default('dev-secret'),
    // Logging
    LOG_LEVEL: joi_1.default.string().default('info'),
}).unknown(true);
const { error, value } = envSchema.validate(process.env);
if (error) {
    throw new Error(`❌ Environment validation failed: ${error.message}`);
}
exports.env = value;
//# sourceMappingURL=env.js.map