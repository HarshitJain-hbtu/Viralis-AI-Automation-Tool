import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import dotenv from 'dotenv';
import { handleWebConnection } from './controllers/webCallController';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('🎙️ Voice Microservice Running');
});

// WebSocket Handling
wss.on('connection', (ws, req) => {
    handleWebConnection(ws, req as any);
});

server.listen(PORT, () => {
    console.log(`
    ################################################
    🎙️  Voice Service listening on port: ${PORT} 
    ################################################
    `);
});
