import express from 'express';
import * as conversationController from '../controller/conversationController.js';

const router = express.Router();

// Create a new conversation
router.post('/', conversationController.createConversation);

// Get conversations for a specific user
router.get('/:userId', conversationController.getConversations);

// Send a message in a conversation
router.post('/send', conversationController.sendMessageInConversation);

export default router;
