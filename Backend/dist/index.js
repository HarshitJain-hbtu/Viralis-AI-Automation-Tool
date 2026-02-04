"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const logger_1 = __importDefault(require("./utils/logger"));
const mongodb_1 = require("./config/mongodb");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const business_routes_1 = __importDefault(require("./routes/business.routes"));
const lead_routes_1 = __importDefault(require("./routes/lead.routes"));
const aiContentRoutes_1 = __importDefault(require("./routes/aiContentRoutes"));
const socialRoutes_1 = __importDefault(require("./routes/socialRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const voice_routes_1 = __importDefault(require("./routes/voice.routes"));
require("./config/passport"); // Initialize Passport Config
// Initialize App
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ limit: '10mb', extended: true }));
app.use((0, cors_1.default)({
    origin: true, // Allow all origins for Hackathon/Demo purposes
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
// Database Connections
(0, mongodb_1.connectMongoDB)();
// WebSocket Setup
const ws_1 = require("ws");
const webCallController_1 = require("./controllers/webCallController");
// WebSocket Setup (mix of Socket.IO and Native WS)
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*', // Configure this properly in production
        methods: ['GET', 'POST']
    }
});
io.on('connection', (socket) => {
    logger_1.default.info(`Client connected to Socket.IO: ${socket.id}`);
    socket.on('disconnect', () => {
        logger_1.default.info(`Client disconnected from Socket.IO: ${socket.id}`);
    });
});
// Setup Native WebSocket for Voice AI
const wss = new ws_1.WebSocketServer({ noServer: true });
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
    (0, webCallController_1.handleWebConnection)(ws, req);
});
const public_routes_1 = __importDefault(require("./routes/public.routes"));
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/public', public_routes_1.default); // Public Routes
app.use('/api', socialRoutes_1.default); // /api/auth/youtube, /api/auth/facebook, /api/stats
app.use('/', socialRoutes_1.default); // Fallback: Allow /auth/youtube without /api prefix
app.use('/api/business', business_routes_1.default);
app.use('/api/voice', voice_routes_1.default);
app.use('/api/leads', lead_routes_1.default);
app.use('/api/ai', aiRoutes_1.default);
app.use('/api/ai-content', aiContentRoutes_1.default); // Corrected and moved
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
app.use('/api/dashboard', dashboard_routes_1.default);
// Health check endpoint for Koyeb
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});
app.get('/', (_req, res) => {
    res.send('🚀 VIRALIS Backend is Running (TypeScript)!');
});
// Start Server
server.listen(env_1.env.PORT, () => {
    logger_1.default.info(`
  ################################################
  🛡️  Server listening on port: ${env_1.env.PORT} 🛡️
  ################################################
  `);
});
//# sourceMappingURL=index.js.map