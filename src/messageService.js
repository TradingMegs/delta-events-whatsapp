import { sessionManager } from './sessionManager.js';
import { logger } from './logger.js';

class MessageService {
    constructor() {
        this.queues = new Map(); // userId -> { queue: [], processing: boolean }
        this.DELAY_MS = 7000; // 7 seconds delay between messages
    }

    // --- Message Queueing Logic ---

    async enqueueMessage(userId, to, content, options = {}) {
        return new Promise((resolve, reject) => {
            if (!this.queues.has(userId)) {
                this.queues.set(userId, { queue: [], processing: false });
            }
            
            const userQueue = this.queues.get(userId);
            
            userQueue.queue.push({
                to,
                content,
                options,
                resolve,
                reject
            });
            this.processQueue(userId);
        });
    }

    async processQueue(userId) {
        if (!this.queues.has(userId)) return;
        const userQueue = this.queues.get(userId);
        
        if (userQueue.processing) return;
        userQueue.processing = true;

        while (userQueue.queue.length > 0) {
            const task = userQueue.queue.shift();
            try {
                const client = await sessionManager.getClient(userId);
                if (!client) {
                    throw new Error("WhatsApp client not connected for user " + userId);
                }

                // Format number
                const formattedTo = this.formatNumber(task.to);

                logger.info(`Sending message from ${userId} to ${formattedTo}...`);
                
                // whatsapp-web.js: sendMessage
                const result = await client.sendMessage(formattedTo, task.content);
                
                task.resolve({ success: true, messageId: result.id._serialized, result });
                
                logger.info(`Message sent to ${formattedTo}`);

            } catch (error) {
                logger.error(`Failed to send message to ${task.to}:`, error);
                task.reject(error);
            }

            // Delay before next message
            if (userQueue.queue.length > 0) {
                logger.info(`Waiting ${this.DELAY_MS / 1000}s before next message...`);
                await new Promise(resolve => setTimeout(resolve, this.DELAY_MS));
            }
        }

        userQueue.processing = false;
    }

    formatNumber(number) {
        if (!number) return '';
        // Remove non-digits
        let clean = number.replace(/\D/g, '');
        // If already has suffix, keep it
        if (number.includes('@c.us') || number.includes('@g.us')) return number;
        
        return `${clean}@c.us`; 
    }

    // --- Public API Methods ---

    async sendMessage(userId, to, message) {
        return this.enqueueMessage(userId, to, message);
    }

    async sendBulkMessages(userId, recipients, message) {
        const promises = recipients.map(to => this.enqueueMessage(userId, to, message));
        return Promise.allSettled(promises);
    }

    async getChats(userId) {
        const client = await sessionManager.getClient(userId);
        if (!client) throw new Error("Not connected");
        
        const chats = await client.getChats();
        
        // Serialize to avoid circular references and 500 errors
        return chats.map(chat => ({
            id: chat.id._serialized,
            name: chat.name || chat.id.user,
            unreadCount: chat.unreadCount,
            timestamp: chat.timestamp,
            isGroup: chat.isGroup,
            lastMessage: chat.lastMessage ? {
                body: chat.lastMessage.body,
                type: chat.lastMessage.type,
                timestamp: chat.lastMessage.timestamp,
                fromMe: chat.lastMessage.fromMe
            } : null
        }));
    }

    async getChatMessages(userId, chatId, limit = 50) {
         const client = await sessionManager.getClient(userId);
         if (!client) throw new Error("Not connected");
         
         try {
             const chat = await client.getChatById(chatId);
             const messages = await chat.fetchMessages({ limit });
             
             // Serialize messages
             return messages.map(msg => ({
                 id: msg.id._serialized,
                 body: msg.body,
                 type: msg.type,
                 timestamp: msg.timestamp,
                 from: msg.from,
                 to: msg.to,
                 author: msg.author,
                 fromMe: msg.fromMe,
                 hasMedia: msg.hasMedia,
                 ack: msg.ack
             }));
         } catch (error) {
             logger.error(`Error fetching messages for ${chatId}:`, error);
             return [];
         }
    }

    async markAsRead(userId, chatId) {
        const client = await sessionManager.getClient(userId);
        if (!client) throw new Error("Not connected");
        const chat = await client.getChatById(chatId);
        return await chat.sendSeen();
    }
}

export const messageService = new MessageService();
