import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import logger from './utils/logger';
import { connectMongoDB } from './config/mongodb';
import { connectRedis } from './config/redis';
import authRoutes from './routes/auth.routes';
import businessRoutes from './routes/business.routes';
import { BusinessController } from './controllers/business.controller';
import aiContentRoutes from './routes/aiContentRoutes';
import socialRoutes from './routes/socialRoutes';
import aiRoutes from './routes/aiRoutes';
import './config/passport'; // Initialize Passport Config

// Initialize App
const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Database Connections
connectMongoDB();
connectRedis();

// WebSocket Setup
const io = new Server(server, {
    cors: {
        origin: '*', // Configure this properly in production
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
    });
});

import publicRoutes from './routes/public.routes';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes); // Public Routes
app.use('/api', socialRoutes); // /api/auth/youtube, /api/auth/facebook, /api/stats
app.use('/api/business', businessRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/ai-content', aiContentRoutes); // Corrected and moved

app.get('/', (_req, res) => {
    res.send('🚀 VIRALIS Backend is Running (TypeScript)!');
});
app.use('/api', aiContentRoutes);


// Start Server
server.listen(env.PORT, () => {
    logger.info(`
  ################################################
  🛡️  Server listening on port: ${env.PORT} 🛡️
  ################################################
  `);
});