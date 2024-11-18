import express from 'express';
import {
    fetchMessagesBetweenUsers, 
    sendMessage
} from '../controller/messageController.js';

const router = express.Router();

// Route to get messages between two users
router.post('/:currentUserId/:selectedFriendId', async (req, res) => {
    const { currentUserId, selectedFriendId } = req.params;

    console.log(`Fetching messages between senderId: ${currentUserId} and receiverId: ${selectedFriendId}`);

    try {
        const messages = await fetchMessagesBetweenUsers(currentUserId, selectedFriendId);
        if (!messages || messages.length === 0) {
            return res.status(404).json({ message: 'No messages found' });
        }

        res.status(200).json(messages); // Return the messages
    } catch (error) {
        console.error(`Error fetching messages: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});


// Route to send a message
router.post('/send/:senderId/:receiverId', async (req, res) => {
    const{ senderId, receiverId } = req.params;
    const content = req.body;

    console.log("senderID", senderId);
    console.log("ReceiverId", receiverId);
    console.log("Message", content);

    try {
        const message = await sendMessage(senderId, receiverId, content);
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
 