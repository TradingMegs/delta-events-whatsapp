const sessionManager = require('./sessionManager');
const logger = require('./logger');

class MessageService {
    async sendMessage(phone, message) {
        try {
            const sock = sessionManager.getClient();
            if (!sock) {
                throw new Error('WhatsApp client not initialized');
            }

            // Format phone number
            const formattedPhone = phone.includes('@s.whatsapp.net') 
                ? phone 
                : `${phone.replace(/\D/g, '')}@s.whatsapp.net`;

            logger.info(`Sending message to ${formattedPhone}`);

            const result = await sock.sendMessage(formattedPhone, { text: message });
            return result;
        } catch (error) {
            logger.error('Error sending message:', error);
            throw error;
        }
    }

    async getChats() {
        // Baileys doesn't store chats by default unless we use a store, 
        // simplified to return empty for now as requested in previous edits
        return [];
    }
}

module.exports = new MessageService();
