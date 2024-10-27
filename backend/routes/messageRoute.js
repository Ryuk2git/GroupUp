import express from 'express';
import {
    sendMessage,
    updateMessageStatus,
    getMessages,
    getUserChatHistory,
    deleteMessage
} from '../controller/messageController.js';

const router = express.Router();

// Route to send a message
router.post('/send', async (req, res) => {
    const { senderId, receiverId, messageContent } = req.body;
    try {
        const message = await sendMessage(senderId, receiverId, messageContent);
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to update message status
router.patch('/status/:messageId', async (req, res) => {
    const { status } = req.body;
    const { messageId } = req.params;
    try {
        await updateMessageStatus(messageId, status);
        res.status(200).json({ message: 'Message status updated successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to get messages between two users
router.get('/between/:senderId/:receiverId', async (req, res) => {
    const { senderId, receiverId } = req.params;
    const { limit, offset } = req.query; // Get limit and offset for pagination
    try {
        const messages = await getMessages(parseInt(senderId), parseInt(receiverId), parseInt(limit), parseInt(offset));
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to get chat history for a user
router.get('/history/:userId', async (req, res) => {
    const { userId } = req.params;
    const { limit, offset } = req.query; // Get limit and offset for pagination
    try {
        const chatHistory = await getUserChatHistory(parseInt(userId), parseInt(limit), parseInt(offset));
        res.status(200).json(chatHistory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to delete a message
router.delete('/:messageId', async (req, res) => {
    const { messageId } = req.params;
    try {
        const deletedMessage = await deleteMessage(messageId);
        res.status(200).json({ message: 'Message deleted successfully.', deletedMessage });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
 