import express from 'express';
import {
    sendMessageController,
    updateMessageStatusController,
    getMessagesController,
    getUserChatHistoryController,
    deleteMessageController
} from '../controller/messageController.js';
import { searchFriendsByName } from '../services/messageService.js';

const router = express.Router();

router.get('/friends/search', async (req, res) => {
    const { userId, name } = req.query; // Get userId and name from query
    try {
        const friends = await searchFriendsByName(userId, name);
        res.json({ friends });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to send a message
router.post('/send', sendMessageController);

// Route to update message status
router.patch('/status/:messageId', updateMessageStatusController);

// Route to get messages between two users
router.get('/between/:senderId/:receiverId', getMessagesController);

// Route to get chat history for a user
router.get('/history/:userId', getUserChatHistoryController);

// Route to delete a message
router.delete('/:messageId', deleteMessageController);

export default router;
