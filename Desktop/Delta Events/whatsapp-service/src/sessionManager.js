const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const path = require('path');
const pino = require('pino');
const logger = require('./logger');

class SessionManager {
    constructor() {
        this.sock = null;
        this.qr = null;
        this.status = 'disconnected';
        this.sessionDir = path.join(__dirname, '..', 'sessions');
        this.io = null;

        if (!fs.existsSync(this.sessionDir)) {
            fs.mkdirSync(this.sessionDir, { recursive: true });
        }
    }

    setSocketIO(io) {
        this.io = io;
    }

    async initialize() {
        try {
            const { state, saveCreds } = await useMultiFileAuthState(this.sessionDir);
            const { version } = await fetchLatestBaileysVersion();

            logger.info(`Initializing WhatsApp Client v${version.join('.')}`);

            this.sock = makeWASocket({
                version,
                logger: pino({ level: 'silent' }),
                printQRInTerminal: true,
                auth: state,
                browser: ['Delta Events', 'Chrome', '1.0.0'],
                generateHighQualityLinkPreview: true,
            });

            this.sock.ev.on('connection.update', (update) => this.handleConnectionUpdate(update));
            this.sock.ev.on('creds.update', saveCreds);

            return this.sock;
        } catch (error) {
            logger.error('Failed to initialize session:', error);
            throw error;
        }
    }

    handleConnectionUpdate(update) {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            this.qr = qr;
            this.status = 'scan_qr';
            logger.info('QR Code generated');
            if (this.io) this.io.emit('status', { status: 'scan_qr', qr });
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            logger.warn('Connection closed due to:', lastDisconnect?.error, ', reconnecting:', shouldReconnect);
            
            if (shouldReconnect) {
                this.initialize();
            } else {
                logger.error('Connection closed. You are logged out.');
                this.status = 'disconnected';
                if (this.io) this.io.emit('status', { status: 'disconnected' });
            }
        } else if (connection === 'open') {
            logger.info('Opened connection');
            this.status = 'connected';
            this.qr = null;
            if (this.io) this.io.emit('status', { status: 'connected' });
        }
    }

    getClient() {
        return this.sock;
    }

    getStatus() {
        return {
            status: this.status,
            qr: this.qr
        };
    }
}

module.exports = new SessionManager();
