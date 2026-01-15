require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const logger = require('./logger');
const sessionManager = require('./sessionManager');
const messageService = require('./messageService');
const qrcode = require('qrcode');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Initialize WhatsApp Session
sessionManager.setSocketIO(io);
sessionManager.initialize();

// API Endpoints

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get Status
app.get('/status', (req, res) => {
    res.json(sessionManager.getStatus());
});

// Send Message
app.post('/send-message', async (req, res) => {
    try {
        const { phone, message } = req.body;
        if (!phone || !message) {
            return res.status(400).json({ error: 'Phone and message are required' });
        }
        
        await messageService.sendMessage(phone, message);
        res.json({ success: true });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Socket.IO Connection
io.on('connection', (socket) => {
    logger.info('Client connected to Socket.IO');
    
    // Send initial status
    socket.emit('status', sessionManager.getStatus());

    socket.on('disconnect', () => {
        logger.info('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
