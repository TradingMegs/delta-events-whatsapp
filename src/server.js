/* eslint-disable no-undef */
/* eslint-env node */
/**
 * Express API Server for WhatsApp Service
 * Provides REST endpoints for WhatsApp operations
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import { sessionManager } from './sessionManager.js';
import { messageService } from './messageService.js';
import { logger } from './logger.js';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    body: req.body
  });
  next();
});

// ==================== WebSocket for Real-time QR Updates ====================
io.on('connection', (socket) => {
  logger.info('Client connected to WebSocket');

  // Send current status for ADMIN by default (for now)
  const adminStatus = sessionManager.getStatus('admin');
  socket.emit('status', {
    connected: adminStatus.connected,
    qr: adminStatus.qr
  });

  socket.on('disconnect', () => {
    logger.info('Client disconnected from WebSocket');
  });
});

// Register status change listener to broadcast to all connected clients
sessionManager.onStatusChange((userId, status, data) => {
  logger.info(`Status change for ${userId}: ${status}`);
  // Broadcast to all, filtering could happen on frontend or rooms
  if (userId === 'admin') {
      io.emit('status_change', { status, ...data });
  }
  // Also emit namespaced event
  io.emit('session_status', { userId, status, ...data });
});

// Register message listener to broadcast to frontend
sessionManager.onMessage((userId, msg) => {
  if (userId !== 'admin') return; 
  
  // Normalize Venom vs WWebJS
  const body = msg.body || msg.content || '';
  const from = msg.from || (typeof msg.sender === 'string' ? msg.sender : msg.sender?.id) || '';
  const to = msg.to || (typeof msg.to === 'string' ? msg.to : msg.to?.id) || '';
  // Venom uses 'isGroupMsg' vs WWebJS 'id.remote' containing g.us? 
  // We'll keep it simple for now.

  io.emit('new_message', {
    id: msg.id || Date.now().toString(),
    body: body,
    from: from,
    to: to,
    timestamp: msg.timestamp,
    type: msg.type,
    fromMe: msg.fromMe,
    participant: msg.author || msg.sender?.id, // for groups
    hasMedia: msg.hasMedia || (msg.type !== 'chat')
  });
});

// Acknowledgment listener
sessionManager.onMessageAck((userId, msgId, ack) => {
  io.emit('message_ack', { id: msgId, ack, userId });
});

// Register message acknowledgment listener for delivery status
sessionManager.onMessageAck((userId, msg, ack) => {
  if (userId !== 'admin') return;

  // Only broadcast for outgoing messages
  if (msg.fromMe) {
    io.emit('message_ack', {
      id: msg.id._serialized,
      to: msg.to,
      ack: ack, // -1=error, 0=pending, 1=sent, 2=delivered, 3=read
      timestamp: Date.now()
    });
  }
});

// ==================== Health & Status Endpoints ====================

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'whatsapp-service',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ==================== Chat & Message History API ====================

app.get('/chats', async (req, res) => {
  try {
    const chats = await messageService.getChats('admin');
    res.json({ chats });
  } catch (error) {
    logger.error('Error getting chats:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/chats/:chatId/messages', async (req, res) => {
  try {
    const { chatId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    
    const messages = await messageService.getChatMessages(chatId, limit);
    res.json({ messages });
  } catch (error) {
    logger.error('Error getting messages:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/chats/:chatId/read', async (req, res) => {
  try {
    const { chatId } = req.params;
    await messageService.markAsRead(chatId);
    res.json({ success: true });
  } catch (error) {
    logger.error('Error marking as read:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/status', async (req, res) => {
  try {
    const connectionInfo = await sessionManager.getConnectionInfo('admin');
    res.json(connectionInfo);
  } catch (error) {
    logger.error('Error getting status:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/qr', (req, res) => {
  const qrCode = sessionManager.getStatus('admin').qr;
  const status = sessionManager.getStatus('admin').status;

  // Always return 200 to suppress console errors on polling
  res.json({
    qr: qrCode ? qrCode.base64 : null,
    url: qrCode ? qrCode.url : null,
    status: status
  });
});

// ==================== Session Management Endpoints ====================

app.post('/connect', async (req, res) => {
  try {
    if (sessionManager.getStatus('admin').connected) {
      return res.json({
        message: 'Already connected',
        connected: true
      });
    }

    await sessionManager.initialize('admin');

    res.json({
      message: 'Connection initialized. Scan QR code to connect.',
      connected: false
    });
  } catch (error) {
    logger.error('Error initializing connection:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/disconnect', async (req, res) => {
  try {
    await sessionManager.logout('admin');
    res.json({ message: 'Disconnected successfully' });
  } catch (error) {
    logger.error('Error disconnecting:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/reconnect', async (req, res) => {
  try {
    await sessionManager.reconnect('admin');
    res.json({ message: 'Reconnection initiated' });
  } catch (error) {
    logger.error('Error reconnecting:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== Message Sending Endpoints ====================

app.post('/send', async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['to', 'message']
      });
    }

    if (!sessionManager.getStatus('admin').connected) {
      return res.status(503).json({
        error: 'WhatsApp service is not connected',
        message: 'Please connect via QR code first'
      });
    }

    const result = await messageService.sendMessage('admin', to, message);
    res.json(result);

  } catch (error) {
    logger.error('Error sending message:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== Chat Actions ====================

app.delete('/chats/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    await messageService.deleteChat(chatId);
    res.json({ success: true });
  } catch (error) {
    logger.error('Error deleting chat:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/chats/:chatId/archive', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { archive = true } = req.body; // Toggle support
    if (archive) {
      await messageService.archiveChat(chatId);
    } else {
      await messageService.unarchiveChat(chatId);
    }
    res.json({ success: true });
  } catch (error) {
    logger.error('Error archiving chat:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/chats/:chatId/pin', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { pin = true } = req.body;
    if (pin) {
      await messageService.pinChat(chatId);
    } else {
      await messageService.unpinChat(chatId);
    }
    res.json({ success: true });
  } catch (error) {
    logger.error('Error pinning chat:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/chats/:chatId/mute', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { mute = true, duration } = req.body;
    if (mute) {
      await messageService.muteChat(chatId, duration);
    } else {
      await messageService.unmuteChat(chatId);
    }
    res.json({ success: true });
  } catch (error) {
    logger.error('Error muting chat:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/send-bulk', async (req, res) => {
  try {
    const { recipients, message } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        error: 'recipients must be a non-empty array'
      });
    }

    if (!message) {
      return res.status(400).json({
        error: 'message is required'
      });
    }

    // Start processing in background
    res.json({
      message: 'Bulk send initiated',
      total: recipients.length,
      estimatedTime: `${(recipients.length * 7)} seconds`
    });

    // Process messages asynchronously
    const results = await messageService.sendBulkMessages('admin', recipients, message);
    
    logger.info('Bulk send completed', results);

  } catch (error) {
    logger.error('Error in bulk send:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== Specialized Message Endpoints ====================

app.post('/send-invite', async (req, res) => {
  try {
    const { phone, event } = req.body;

    if (!phone || !event) {
      return res.status(400).json({
        error: 'phone and event data required'
      });
    }

    const result = await messageService.sendEventInvite(phone, event);
    res.json(result);

  } catch (error) {
    logger.error('Error sending invite:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/send-magic-link', async (req, res) => {
  try {
    const { phone, magicLink, userName } = req.body;

    if (!phone || !magicLink) {
      return res.status(400).json({
        error: 'phone and magicLink required'
      });
    }

    const result = await messageService.sendMagicLink(phone, magicLink, userName);
    res.json(result);

  } catch (error) {
    logger.error('Error sending magic link:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/send-reminder', async (req, res) => {
  try {
    const { phone, event } = req.body;

    if (!phone || !event) {
      return res.status(400).json({
        error: 'phone and event data required'
      });
    }

    const result = await messageService.sendEventReminder(phone, event);
    res.json(result);

  } catch (error) {
    logger.error('Error sending reminder:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== Group Management Endpoints ====================

app.get('/groups', async (req, res) => {
  try {
    const groups = await messageService.getAllGroups();
    res.json({ groups });
  } catch (error) {
    logger.error('Error getting groups:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/group-invite-link/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const inviteLink = await messageService.getGroupInviteLink(groupId);
    
    res.json({ inviteLink });
  } catch (error) {
    logger.error('Error getting group invite link:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== Utility Endpoints ====================

app.post('/check-number', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'phone required' });
    }

    const isRegistered = await messageService.isRegistered(phone);
    
    res.json({
      phone,
      registered: isRegistered
    });
  } catch (error) {
    logger.error('Error checking number:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== Error Handling ====================

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// ==================== Server Startup ====================

server.listen(PORT, async () => {
  logger.info(`WhatsApp Service running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
  
  // Auto-initialize on startup if session exists
  try {
    logger.info('Attempting auto-connect for admin...');
    await sessionManager.initialize('admin');
  } catch (error) {
    logger.warn('Auto-connect failed (normal if first time):', error.message);
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  
  try {
    await sessionManager.logout('admin');
  } catch (error) {
    logger.error('Error during shutdown:', error);
  }
  
  process.exit(0);
});

export default app;
