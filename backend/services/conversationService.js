import Conversation from '../models/Conversations.js';
import Message from '../models/Message.js';
import { Op } from 'sequelize';

let io; // Declare Socket.IO instance

// Function to set Socket.IO instance
export const setSocketIO = (socketIO) => {
    io = socketIO;
};

// Create a new conversation
export const createConversation = async (senderId, receiverId) => {
    try {
        const newConversation = await Conversation.create({
            members: [senderId, receiverId],
        });
        return newConversation;
    } catch (error) {
        console.error('Error creating conversation:', error);
        throw new Error('Failed to create conversation');
    }
};

// Get conversations for a user
export const getConversations = async (userId) => {
    try {
        const conversations = await Conversation.findAll({
            where: {
                members: {
                    [Op.contains]: [userId], // Ensure the user is part of the conversation
                },
            },
        });
        return conversations;
    } catch (error) {
        console.error('Error fetching conversations:', error);
        throw new Error('Failed to fetch conversations');
    }
};

// Function to send a message and potentially create a conversation
export const sendMessageInConversation = async (senderId, receiverId, messageContent) => {
    try {
        // Create a new conversation if it doesn't exist
        const conversation = await Conversation.findOne({
            where: {
                members: {
                    [Op.contains]: [senderId, receiverId],
                },
            },
        });

        if (!conversation) {
            await createConversation(senderId, receiverId);
        }

        const message = await sendMessage(senderId, receiverId, messageContent); // Assuming sendMessage from messageService is imported

        // Emit the message to the recipient through WebSocket
        if (io) {
            io.to(receiverId).emit('newMessage', {
                conversationId: conversation.id,
                ...message, // Include message details
            });
        }

        return message;
    } catch (error) {
        console.error('Error sending message in conversation:', error);
        throw new Error('Failed to send message in conversation');
    }
};
