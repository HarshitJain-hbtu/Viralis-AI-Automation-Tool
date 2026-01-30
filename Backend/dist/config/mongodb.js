"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongoDB = connectMongoDB;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const logger_1 = __importDefault(require("../utils/logger"));
async function connectMongoDB() {
    try {
        await mongoose_1.default.connect(env_1.env.MONGO_URI);
        logger_1.default.info('✅ MongoDB Connected');
    }
    catch (error) {
        logger_1.default.error('❌ MongoDB connection failed:', error);
        // process.exit(1); // Don't crash, let the server run
    }
}
//# sourceMappingURL=mongodb.js.map