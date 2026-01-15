import { sessionManager } from './sessionManager.js';

class MessageService {
  constructor() {
    this.queues = new Map();
    this.DELAY_MS = 7000; // 7 seconds delay
  }

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
        const socket = await sessionManager.getClient(userId);
        if (!socket) {
          throw new Error("WhatsApp client not connected for user " + userId);
        }

        const formattedTo = this.formatNumber(task.to);
        console.log(`[Baileys] Sending message to ${formattedTo}...`);
        
        let result;
        if (task.options.image) {
          result = await socket.sendMessage(formattedTo, {
            image: { url: task.options.image },
            caption: task.content
          });
        } else {
          result = await socket.sendMessage(formattedTo, {
            text: task.content
          });
        }
        
        task.resolve({ 
          success: true, 
          messageId: result.key.id, 
          result 
        });
        
        console.log(`[Baileys] Message sent to ${formattedTo}`);

      } catch (error) {
        console.error(`[Baileys] Failed to send to ${task.to}:`, error);
        task.reject(error);
      }

      // Delay before next message
      if (userQueue.queue.length > 0) {
        console.log(`[Baileys] Waiting ${this.DELAY_MS / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, this.DELAY_MS));
      }
    }

    userQueue.processing = false;
  }

  formatNumber(number) {
    if (!number) return '';
    
    // Already formatted
    if (number.includes('@s.whatsapp.net') || number.includes('@g.us')) {
      return number;
    }
    
    // Clean number
    let clean = number.replace(/\D/g, '');
    
    // Add country code if missing (assuming international format)
    if (!clean.startsWith('1') && clean.length === 10) {
      clean = '1' + clean; // US default
    }
    
    return `${clean}@s.whatsapp.net`;
  }

  async sendMessage(userId, to, message) {
    return this.enqueueMessage(userId, to, message);
  }

  async sendBulkMessages(userId, recipients, message) {
    const promises = recipients.map(to => 
      this.enqueueMessage(userId, to, message)
    );
    return Promise.allSettled(promises);
  }

  async getChats(userId) {
    const socket = await sessionManager.getClient(userId);
    if (!socket) throw new Error("Not connected");
    
    // Baileys doesn't have a direct getChats method
    // We'll return an empty array for now - chats need to be fetched differently
    console.warn('[Baileys] getChats not fully implemented - use getChatMessages instead');
    return [];
  }

  async getChatMessages(userId, chatId, limit = 50) {
    const socket = await sessionManager.getClient(userId);
    if (!socket) throw new Error("Not connected");
    
    try {
      // Fetch messages from WhatsApp
      const messages = await socket.fetchMessagesFromWA(chatId, limit);
      
      return messages.map(msg => ({
        id: msg.key.id,
        body: msg.message?.conversation || 
              msg.message?.extendedTextMessage?.text || '',
        type: Object.keys(msg.message || {})[0] || 'text',
        timestamp: msg.messageTimestamp * 1000,
        from: msg.key.remoteJid,
        to: msg.key.remoteJid,
        author: msg.key.participant,
        fromMe: msg.key.fromMe,
        hasMedia: !!(msg.message?.imageMessage || 
                     msg.message?.videoMessage ||
                     msg.message?.documentMessage),
        ack: msg.status || 0
      }));
    } catch (error) {
      console.error(`[Baileys] Error fetching messages:`, error);
      return [];
    }
  }

  async markAsRead(userId, chatId) {
    const socket = await sessionManager.getClient(userId);
    if (!socket) throw new Error("Not connected");
    
    // Simplified - mark chat as read
    await socket.readMessages([{ remoteJid: chatId, id: '*', fromMe: false }]);
  }

  async getAllGroups(userId = 'admin') {
    const socket = await sessionManager.getClient(userId);
    if (!socket) throw new Error("Not connected");
    
    // Fetch all group chats
    const groups = await socket.groupFetchAllParticipating();
    
    return Object.values(groups).map(g => ({
      id: g.id,
      name: g.subject,
      desc: g.desc,
      participants: g.participants?.length || 0
    }));
  }

  async getGroupInviteLink(userId, groupId) {
    const socket = await sessionManager.getClient(userId);
    if (!socket) throw new Error("Not connected");
    
    const code = await socket.groupInviteCode(groupId);
    return `https://chat.whatsapp.com/${code}`;
  }

  async isRegistered(userId, phone) {
    const socket = await sessionManager.getClient(userId);
    if (!socket) throw new Error("Not connected");
    
    const formatted = this.formatNumber(phone);
    const [result] = await socket.onWhatsApp(formatted);
    
    return result?.exists || false;
  }

  // Event-specific message templates
  async sendEventInvite(phone, event) {
    const message = `🎉 *Event Invitation*\n\n` +
      `You're invited to: *${event.title}*\n\n` +
      `📅 Date: ${event.date}\n` +
      `⏰ Time: ${event.time || 'TBA'}\n` +
      `📍 Location: ${event.location || 'TBA'}\n\n` +
      `RSVP here: ${event.rsvpLink || 'Contact organizer'}`;
    
    return this.sendMessage('admin', phone, message);
  }

  async sendMagicLink(phone, magicLink, userName) {
    const message = `👋 Hi ${userName || 'there'}!\n\n` +
      `Click this link to access your Delta Events account:\n\n` +
      `🔗 ${magicLink}\n\n` +
      `This link expires in 15 minutes.`;
    
    return this.sendMessage('admin', phone, message);
  }

  async sendEventReminder(phone, event) {
    const message = `⏰ *Event Reminder*\n\n` +
      `Don't forget: *${event.title}*\n\n` +
      `📅 ${event.date} at ${event.time}\n` +
      `📍 ${event.location}\n\n` +
      `See you there!`;
    
    return this.sendMessage('admin', phone, message);
  }

  // Chat actions (simplified for Baileys)
  async deleteChat() {
    // Baileys doesn't support deleting chats
    console.warn('[Baileys] Delete chat not supported');
  }

  async archiveChat(chatId) {
    const socket = await sessionManager.getClient('admin');
    if (!socket) throw new Error("Not connected");
    await socket.chatModify({ archive: true }, chatId);
  }

  async unarchiveChat(chatId) {
    const socket = await sessionManager.getClient('admin');
    if (!socket) throw new Error("Not connected");
    await socket.chatModify({ archive: false }, chatId);
  }

  async pinChat(chatId) {
    const socket = await sessionManager.getClient('admin');
    if (!socket) throw new Error("Not connected");
    await socket.chatModify({ pin: true }, chatId);
  }

  async unpinChat(chatId) {
    const socket = await sessionManager.getClient('admin');
    if (!socket) throw new Error("Not connected");
    await socket.chatModify({ pin: false }, chatId);
  }

  async muteChat(chatId, duration) {
    const socket = await sessionManager.getClient('admin');
    if (!socket) throw new Error("Not connected");
    await socket.chatModify({ mute: duration || 8 * 60 * 60 * 1000 }, chatId);
  }

  async unmuteChat(chatId) {
    const socket = await sessionManager.getClient('admin');
    if (!socket) throw new Error("Not connected");
    await socket.chatModify({ mute: null }, chatId);
  }
}

export const messageService = new MessageService();
