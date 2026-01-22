require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/config');

const app = express();
const server = http.createServer(app);
connectDB();

// 2. Middleware
app.use(express.json()); 
app.use(cors()); 
app.use(helmet()); 
app.use(morgan('dev')); 

// 3. Routes (We will create these files next)
// app.use('/api/brands', require('./routes/brandRoutes'));
// app.use('/api/content', require('./routes/contentRoutes'));

// 4. Voice Agent WebSocket Server (The "Communicator")
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('🎙️ Voice Client Connected');

  ws.on('message', (message) => {
    try {
      // This is where Twilio audio streams will arrive
      console.log('Received:', message); 
    } catch (e) {
      console.error('WS Error:', e);
    }
  });

  ws.on('close', () => console.log('Voice Client Disconnected'));
});

// 5. Basic Health Check
app.get('/', (req, res) => {
  res.send('🚀 VIRALIS Backend is Running!');
});

// 6. Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
  ################################################
  🛡️  Server listening on port: ${PORT} 🛡️
  ################################################
  `);
});