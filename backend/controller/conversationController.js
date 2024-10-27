import * as conversationService from '../services/conversationService.js';

// Create a new conversation
export const createConversation = async (req, res) => {
    const { senderId, receiverId } = req.body;
    
    try {
        const conversation = await conversationService.createConversation(senderId, receiverId);
        res.status(201).json(conversation);
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ message: 'Failed to create conversation' });
    }
};

// Get conversations for a specific user
export const getConversations = async (req, res) => {
    const userId = req.params.userId;

    try {
        const conversations = await conversationService.getConversations(userId);
        res.status(200).json(conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ message: 'Failed to fetch conversations' });
    }
};

// Send a message in a conversation
export const sendMessageInConversation = async (req, res) => {
    const { senderId, receiverId, messageContent } = req.body;

    try {
        const message = await conversationService.sendMessageInConversation(senderId, receiverId, messageContent);
        res.status(200).json(message);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
};
