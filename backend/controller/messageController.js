import * as messageService from '../services/messageService.js';

// Send a message
export const sendMessage = async (req, res) => {
    const { senderId, receiverId, messageContent } = req.body;

    try {
        const message = await messageService.sendMessage(senderId, receiverId, messageContent);
        res.status(200).json(message);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
};

// Update message status
export const updateMessageStatus = async (req, res) => {
    const { messageId, status } = req.body;

    try {
        await messageService.updateMessageStatus(messageId, status);
        res.status(200).json({ message: 'Message status updated successfully' });
    } catch (error) {
        console.error('Error updating message status:', error);
        res.status(500).json({ message: 'Failed to update message status' });
    }
};

// Get messages between two users
export const getMessages = async (req, res) => {
    const { senderId, receiverId } = req.params;
    
    try {
        const messages = await messageService.getMessages(senderId, receiverId);
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).json({ message: 'Failed to retrieve messages' });
    }
};

// Fetch user chat history
export const getUserChatHistory = async (req, res) => {
    const userId = req.params.userId;

    try {
        const chatHistory = await messageService.getUserChatHistory(userId);
        res.status(200).json(chatHistory);
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ message: 'Could not fetch chat history' });
    }
};

// Delete a message
export const deleteMessage = async (req, res) => {
    const { messageId } = req.params;

    try {
        const deletedMessage = await messageService.deleteMessage(messageId);
        res.status(200).json(deletedMessage);
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Could not delete message' });
    }
};
