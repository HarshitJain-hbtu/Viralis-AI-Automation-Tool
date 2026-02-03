"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
                let metaString = '';
                if (Object.keys(meta).length) {
                    try {
                        const cache = new Set();
                        metaString = ` ${JSON.stringify(meta, (_, value) => {
                            if (typeof value === 'object' && value !== null) {
                                if (cache.has(value))
                                    return '[Circular]';
                                cache.add(value);
                            }
                            return value;
                        }, 2)}`;
                    }
                    catch (e) {
                        metaString = ' [Unable to stringify meta]';
                    }
                }
                return `${timestamp} [${level}]: ${message}${metaString}`;
            })),
        }),
    ],
});
exports.default = logger;
//# sourceMappingURL=logger.js.map