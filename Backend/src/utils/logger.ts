import winston from 'winston';

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message, ...meta }) => {
                    let metaString = '';
                    if (Object.keys(meta).length) {
                        try {
                            const cache = new Set();
                            metaString = ` ${JSON.stringify(meta, (_: any, value: any) => {
                                if (typeof value === 'object' && value !== null) {
                                    if (cache.has(value)) return '[Circular]';
                                    cache.add(value);
                                }
                                return value;
                            }, 2)}`;
                        } catch (e) {
                            metaString = ' [Unable to stringify meta]';
                        }
                    }
                    return `${timestamp} [${level}]: ${message}${metaString}`;
                })
            ),
        }),
    ],
});

export default logger;
