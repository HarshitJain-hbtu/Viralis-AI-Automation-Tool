"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const webCallController_1 = require("./controllers/webCallController");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ server });
const PORT = process.env.PORT || 8080;
app.get('/', (req, res) => {
    res.send('🎙️ Voice Microservice Running');
});
// WebSocket Handling
wss.on('connection', (ws, req) => {
    (0, webCallController_1.handleWebConnection)(ws, req);
});
server.listen(PORT, () => {
    console.log(`
    ################################################
    🎙️  Voice Service listening on port: ${PORT} 
    ################################################
    `);
});
