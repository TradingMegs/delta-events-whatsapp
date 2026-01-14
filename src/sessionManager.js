import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import { logger } from './logger.js';

class SessionManager {
  constructor() {
    this.sessions = new Map(); // userId -> { client, status, qr }
    this.statusListeners = [];
    this.messageListeners = [];
    this.ackListeners = [];
  }

  async getClient(userId) {
    if (!this.sessions.has(userId)) return null;
    return this.sessions.get(userId).client;
  }

  getSession(userId) {
      return this.sessions.get(userId);
  }

  // Initialize WhatsApp Web Client
  async initialize(userId) {
    if (this.sessions.has(userId)) {
        const session = this.sessions.get(userId);
        if (session.status === 'CONNECTED' && session.client) return session;
        if (session.status === 'INITIALIZING' || session.status === 'QR_RECEIVED') return session;
    }

    logger.info(`Initializing WhatsApp session for user: ${userId}`);
    
    // Create client with LocalAuth for session persistence
    const client = new Client({
        authStrategy: new LocalAuth({ clientId: userId }),
        puppeteer: {
            headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        }
    });

    // Create session entry
    this.sessions.set(userId, {
        client: client,
        status: 'INITIALIZING',
        qr: null,
        userId: userId
    });

    // QR Code event
    client.on('qr', async (qr) => {
        logger.info(`QR Code received for ${userId}`);
        logger.info(`QR String length: ${qr.length}`);
        
        // Print to console as ASCII (this works!)
        qrcode.generate(qr, { small: true });
        
        // Send the RAW QR string to frontend
        // Frontend will use qrcode.react to render it properly
        if (this.sessions.has(userId)) {
            const session = this.sessions.get(userId);
            session.qr = {
                raw: qr,  // Send raw string
                timestamp: Date.now()
            };
            session.status = 'QR_RECEIVED';
            this.updateStatus(userId, 'QR_RECEIVED', { qr: qr });  // Send raw string
        }
    });

    // Ready event (authenticated and ready)
    client.on('ready', () => {
        logger.info(`WhatsApp client ready for ${userId}`);
        if (this.sessions.has(userId)) {
            const session = this.sessions.get(userId);
            session.status = 'CONNECTED';
            session.qr = null;
            this.updateStatus(userId, 'CONNECTED');
        }
    });

    // Authenticated event
    client.on('authenticated', () => {
        logger.info(`WhatsApp authenticated for ${userId}`);
        if (this.sessions.has(userId)) {
            const session = this.sessions.get(userId);
            session.status = 'AUTHENTICATED';
            this.updateStatus(userId, 'AUTHENTICATED');
        }
    });

    // Disconnected event
    client.on('disconnected', (reason) => {
        logger.info(`WhatsApp disconnected for ${userId}: ${reason}`);
        if (this.sessions.has(userId)) {
            this.updateStatus(userId, 'DISCONNECTED', { reason });
        }
    });

    // Message event
    client.on('message', (message) => {
        this.notifyMessageListeners(userId, message);
    });

    // Message acknowledgment event
    client.on('message_ack', (message, ack) => {
        this.notifyAckListeners(userId, message.id._serialized, ack);
    });

    // Initialize the client
    try {
        await client.initialize();
    } catch (error) {
        logger.error(`WhatsApp initialization error for ${userId}:`, error);
        if (this.sessions.has(userId)) {
            this.updateStatus(userId, 'ERROR', { error: error.message || error });
            this.sessions.delete(userId);
        }
    }

    return this.sessions.get(userId);
  }

  async logout(userId) {
    if (this.sessions.has(userId)) {
        const session = this.sessions.get(userId);
        if (session.client) {
            try {
                await session.client.logout();
                await session.client.destroy();
            } catch { /* ignore */ }
        }
        this.sessions.delete(userId);
        this.updateStatus(userId, 'DISCONNECTED');
    }
  }

  async reconnect(userId) {
      await this.logout(userId);
      await this.initialize(userId);
  }

  async getConnectionInfo(userId) {
    if (!this.sessions.has(userId)) return { status: 'DISCONNECTED', connected: false };
    const session = this.sessions.get(userId);
    
    if (session.status !== 'CONNECTED' || !session.client) {
        return { status: session.status, connected: false };
    }

    try {
        const info = await session.client.info;
        return {
            status: 'CONNECTED',
            connected: true,
            ready: true,
            pushname: info.pushname,
            wid: info.wid._serialized,
            phone: info.wid.user
        };
    } catch {
        return { status: 'CONNECTED', connected: true, ready: true };
    }
  }

  getStatus(userId) {
      if (!this.sessions.has(userId)) return { status: 'DISCONNECTED', connected: false };
      const session = this.sessions.get(userId);
      return {
          status: session.status,
          connected: session.status === 'CONNECTED',
          qr: session.qr 
      };
  }

  // --- Event Handling ---

  onStatusChange(callback) {
    this.statusListeners.push(callback);
  }

  updateStatus(userId, status, data = {}) {
     // Broadcast to listeners
     this.statusListeners.forEach(cb => cb(userId, status, data));
  }

  onMessage(callback) {
    this.messageListeners.push(callback);
  }

  notifyMessageListeners(userId, msg) {
    this.messageListeners.forEach(cb => cb(userId, msg));
  }

  onMessageAck(callback) {
    this.ackListeners.push(callback);
  }

  notifyAckListeners(userId, msgId, ack) {
      this.ackListeners.forEach(cb => cb(userId, msgId, ack));
  }
}

export const sessionManager = new SessionManager();
