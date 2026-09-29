/**
 * Connects to MongoDB with bounded retries and exponential backoff.
 * The server can still boot if the DB is temporarily unavailable; Mongoose
 * will keep retrying the initial connection in the background.
 */
export declare function connectMongoDB(maxRetries?: number): Promise<void>;
/** Gracefully closes the MongoDB connection (used during shutdown). */
export declare function disconnectMongoDB(): Promise<void>;
//# sourceMappingURL=mongodb.d.ts.map