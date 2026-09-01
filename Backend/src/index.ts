import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import logger from './utils/logger';
import { connectMongoDB } from './config/mongodb';

import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import { disconnectMongoDB } from './config/mongodb';

import authRoutes from './routes/auth.routes';
import businessRoutes from './routes/business.routes';
import leadRoutes from './routes/lead.routes';

import aiContentRoutes from './routes/aiContentRoutes';
import socialRoutes from './routes/socialRoutes';
import aiRoutes from './routes/aiRoutes';
import voiceRoutes from './routes/voice.routes';
import './config/passport'; // Initialize Passport Config


// Initialize App
const app = express();
const server = http.createServer(app);

// Trust the platform proxy (Koyeb/Vercel) so rate limiting & secure cookies see real client IPs.
app.set('trust proxy', 1);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS — use an explicit allowlist when CORS_ORIGINS is configured,
// otherwise fall back to allowing all origins (dev/demo convenience).
const allowedOrigins = env.CORS_ORIGINS
    ? env.CORS_ORIGINS.split(',').map((o: string) => o.trim()).filter(Boolean)
    : [];

app.use(cors({
    origin: allowedOrigins.length
        ? (origin, callback) => {
            // Allow same-origin/non-browser requests (no Origin header) and allowlisted origins.
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
        : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());
app.use(morgan('dev'));

// Global rate limiting for all API routes.
app.use('/api', apiLimiter);

// Database Connections
connectMongoDB();


// WebSocket Setup
import { WebSocketServer } from 'ws';
import { handleWebConnection } from './controllers/webCallController';

// WebSocket Setup (mix of Socket.IO and Native WS)
const io = new Server(server, {
    cors: {
        origin: '*', // Configure this properly in production
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    logger.info(`Client connected to Socket.IO: ${socket.id}`);
    socket.on('disconnect', () => {
        logger.info(`Client disconnected from Socket.IO: ${socket.id}`);
    });
});

// Setup Native WebSocket for Voice AI
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
    const pathname = request.url ? new URL(request.url, `http://${request.headers.host}`).pathname : '/';

    // Check if it's a Socket.IO request (Socket.IO handles its own upgrades usually, but we need to be careful not to steal them)
    // Socket.IO paths usually start with /socket.io/
    if (pathname.startsWith('/socket.io/')) {
        // Let Socket.IO handle it (it attaches its own upgrade listener under the hood usually, 
        // but if we consume the event, we might break it. 
        // Actually, creating 'io' fetches the upgrade listener.
        // We will just handle NON-socket.io requests here for our Voice Service.)
        return;
    }

    // Default to Voice Service for root or specific path
    // The frontend connects to "wss://url?brandId=..." which is essentially "/"
    // We check for '/' or '/voice' or empty path
    if (pathname === '/' || pathname === '/voice' || pathname === '') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    }
});

wss.on('connection', (ws, req) => {
    handleWebConnection(ws, req as any);
});

import publicRoutes from './routes/public.routes';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes); // Public Routes
app.use('/api', socialRoutes); // /api/auth/youtube, /api/auth/facebook, /api/stats
app.use('/', socialRoutes); // Fallback: Allow /auth/youtube without /api prefix
app.use('/api/business', businessRoutes);
app.use('/api/voice', voiceRoutes);

app.use('/api/leads', leadRoutes);

app.use('/api/ai', aiRoutes);
app.use('/api/ai-content', aiContentRoutes); // Corrected and moved
import dashboardRoutes from './routes/dashboard.routes';
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint for Koyeb
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/', (_req, res) => {
    res.send('🚀 VIRALIS Backend is Running (TypeScript)!');
});

// 404 for any unmatched route (must come after all routes).
app.use(notFoundHandler);

// Centralized error handler (must be the last middleware).
app.use(errorHandler);


// Start Server
server.listen(env.PORT, () => {
    logger.info(`
  ################################################
  🛡️  Server listening on port: ${env.PORT} 🛡️
  ################################################
  `);
});

// --- Process-level safety nets ---------------------------------------------

process.on('unhandledRejection', (reason: unknown) => {
    logger.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error);
    // An uncaught exception leaves the process in an undefined state — exit and
    // let the platform (Koyeb) restart it cleanly.
    gracefulShutdown('uncaughtException', 1);
});

let shuttingDown = false;
function gracefulShutdown(signal: string, exitCode = 0) {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info(`Received ${signal}. Shutting down gracefully...`);

    // Stop accepting new connections, then close DB.
    server.close(async () => {
        await disconnectMongoDB();
        logger.info('Shutdown complete.');
        process.exit(exitCode);
    });

    // Force-exit if graceful shutdown stalls.
    setTimeout(() => {
        logger.error('Forced shutdown after timeout.');
        process.exit(exitCode || 1);
    }, 10000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
