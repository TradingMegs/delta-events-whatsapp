/* eslint-disable react-hooks/rules-of-hooks */
import makeWASocket, { 
  DisconnectReason, 
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = pino({ level: 'silent' }); // Silent logger for Baileys

class SessionManager {
  constructor() {
    this.sessions = new Map(); // userId -> { socket, status, qr, store }
    this.statusListeners = [];
    this.messageListeners = [];
    this.ackListeners = [];
    
    // Ensure sessions directory exists
    const sessionsDir = path.join(__dirname, '..', 'sessions');
    if (!fs.existsSync(sessionsDir)) {
      fs.mkdirSync(sessionsDir, { recursive: true });
    }
  }

  async getClient(userId) {
    if (!this.sessions.has(userId)) return null;
    return this.sessions.get(userId).socket;
  }

  getSession(userId) {
    return this.sessions.get(userId);
  }

  async initialize(userId) {
    if (this.sessions.has(userId)) {
      const session = this.sessions.get(userId);
      if (session.status === 'CONNECTED' && session.socket) return session;
      if (session.status === 'INITIALIZING') return session;
    }

    console.log(`[Baileys] Initializing session for: ${userId}`);
    
    // Create session entry
    this.sessions.set(userId, {
      socket: null,
      status: 'INITIALIZING',
      qr: null,
      userId: userId,
      store: null
    });
    this.updateStatus(userId, 'INITIALIZING');

    try {
      const sessionPath = path.join(__dirname, '..', 'sessions', userId);
      
      // Load auth state from file
      const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
      
      // Get latest Baileys version
      const { version } = await fetchLatestBaileysVersion();
      
      // Create WhatsApp socket
      const socket = makeWASocket({
        version,
        auth: state,
        logger,
        printQRInTerminal: false,
        browser: ['Delta Events', 'Chrome', '120.0.0'],
        syncFullHistory: false,
        getMessage: async (key) => {
          // Return message from store if available
          const session = this.sessions.get(userId);
          if (session?.store) {
            const msg = await session.store.loadMessage(key.remoteJid, key.id);
            return msg?.message || undefined;
          }
          return undefined;
        }
      });

      const session = this.sessions.get(userId);
      session.socket = socket;

      // Connection update handler
      socket.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        // Handle QR code
        if (qr) {
          console.log(`[Baileys] QR Code received for ${userId}`);
          session.qr = {
            raw: qr,
            timestamp: Date.now()
          };
          session.status = 'QR_RECEIVED';
          this.updateStatus(userId, 'QR_RECEIVED', { qr });
        }

        // Handle connection status
        if (connection === 'close') {
          const shouldReconnect = (lastDisconnect?.error instanceof Boom)
            ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
            : true;

          console.log(`[Baileys] Connection closed for ${userId}. Reconnect: ${shouldReconnect}`);
          
          if (shouldReconnect) {
            // Auto-reconnect
            setTimeout(() => this.initialize(userId), 3000);
          } else {
            session.status = 'DISCONNECTED';
            this.updateStatus(userId, 'DISCONNECTED', { 
              reason: 'Logged out' 
            });
          }
        } else if (connection === 'open') {
          console.log(`[Baileys] Connection opened for ${userId}`);
          session.status = 'CONNECTED';
          session.qr = null;
          this.updateStatus(userId, 'CONNECTED');
        } else if (connection === 'connecting') {
          console.log(`[Baileys] Connecting for ${userId}`);
          session.status = 'CONNECTING';
        }
      });

      // Credentials update handler
      socket.ev.on('creds.update', saveCreds);

      // Messages handler
      socket.ev.on('messages.upsert', ({ messages, type }) => {
        if (type === 'notify') {
          messages.forEach(msg => {
            if (!msg.key.fromMe && msg.message) {
              this.notifyMessageListeners(userId, msg);
            }
          });
        }
      });

      // Message receipt update handler
      socket.ev.on('messages.update', (updates) => {
        updates.forEach(({ key, update }) => {
          if (update.status) {
            this.notifyAckListeners(userId, key.id, update.status);
          }
        });
      });

      return session;

    } catch (error) {
      console.error(`[Baileys] Initialization error for ${userId}:`, error);
      if (this.sessions.has(userId)) {
        this.updateStatus(userId, 'ERROR', { error: error.message });
        this.sessions.delete(userId);
      }
      throw error;
    }
  }

  async logout(userId) {
    if (this.sessions.has(userId)) {
      const session = this.sessions.get(userId);
      if (session.socket) {
        try {
          await session.socket.logout();
        } catch (err) {
          console.error('Logout error:', err);
        }
      }
      this.sessions.delete(userId);
      this.updateStatus(userId, 'DISCONNECTED');
      
      // Clean up session files
      const sessionPath = path.join(__dirname, '..', 'sessions', userId);
      if (fs.existsSync(sessionPath)) {
        fs.rmSync(sessionPath, { recursive: true, force: true });
      }
    }
  }

  async reconnect(userId) {
    await this.logout(userId);
    await this.initialize(userId);
  }

  async getConnectionInfo(userId) {
    if (!this.sessions.has(userId)) {
      return { status: 'DISCONNECTED', connected: false };
    }
    
    const session = this.sessions.get(userId);
    
    if (session.status !== 'CONNECTED' || !session.socket) {
      return { status: session.status, connected: false };
    }

    try {
      const jid = session.socket.user?.id;
      return {
        status: 'CONNECTED',
        connected: true,
        ready: true,
        pushname: session.socket.user?.name || 'Unknown',
        wid: jid,
        phone: jid?.split('@')[0] || 'Unknown'
      };
    } catch {
      return { status: 'CONNECTED', connected: true, ready: true };
    }
  }

  getStatus(userId) {
    if (!this.sessions.has(userId)) {
      return { status: 'DISCONNECTED', connected: false };
    }
    const session = this.sessions.get(userId);
    return {
      status: session.status,
      connected: session.status === 'CONNECTED',
      qr: session.qr
    };
  }

  // Event handling
  onStatusChange(callback) {
    this.statusListeners.push(callback);
  }

  updateStatus(userId, status, data = {}) {
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
