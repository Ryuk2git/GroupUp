import {
    sendMessage,
    updateMessageStatus,
    getMessages,
    getUserChatHistory,
    deleteMessage
} from '../services/messageService.js';

// Send a message
export const sendMessageController = async (req, res) => {
    const { senderId, receiverId, messageContent } = req.body;
    try {
        const message = await sendMessage(senderId, receiverId, messageContent);
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update message status
export const updateMessageStatusController = async (req, res) => {
    const { status } = req.body;
    const { messageId } = req.params;
    try {
        await updateMessageStatus(messageId, status);
        res.status(200).json({ message: 'Message status updated successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get messages between two users
export const getMessagesController = async (req, res) => {
    const { senderId, receiverId } = req.params;
    const { limit, offset } = req.query; // Get limit and offset for pagination
    try {
        const messages = await getMessages(parseInt(senderId), parseInt(receiverId), parseInt(limit), parseInt(offset));
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user chat history
export const getUserChatHistoryController = async (req, res) => {
    const { userId } = req.params;
    const { limit, offset } = req.query; // Get limit and offset for pagination
    try {
        const chatHistory = await getUserChatHistory(parseInt(userId), parseInt(limit), parseInt(offset));
        res.status(200).json(chatHistory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a message
export const deleteMessageController = async (req, res) => {
    const { messageId } = req.params;
    try {
        const deletedMessage = await deleteMessage(messageId);
        res.status(200).json({ message: 'Message deleted successfully.', deletedMessage });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
