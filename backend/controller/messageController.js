import sequelize from '../config/database.js'; // Ensure sequelize is correctly imported
import Message from '../models/Message.js';
import { v4 as uuidv4 } from 'uuid'; 

export const fetchMessagesBetweenUsers = async (currentUserId, selectedFriendId) => {
    try {
        // Use raw SQL query to fetch messages between users
        const rawQuery = `
            SELECT *
            FROM messages
            WHERE (senderId = :currentUserId AND receiverId = :selectedFriendId)
               OR (senderId = :selectedFriendId AND receiverId = :currentUserId)
            ORDER BY createdAt ASC;
        `;

        // Execute the query with parameterized userId and friendId
        const messages = await sequelize.query(rawQuery, {
            replacements: { 
                currentUserId, 
                selectedFriendId 
            },
            type: sequelize.QueryTypes.SELECT, // Specify SELECT query
        });

        if (messages.length === 0) {
            return { message: 'No messages found. Start a conversation!' };
        }

        return messages; // Return the result as JSON (messages)
    } catch (error) {
        throw new Error(`Error fetching messages: ${error.message}`);
    }
};

export const sendMessage = async (senderId, receiverId, messageContent) => {
    try {
        const messageId = uuidv4();  // Generate a unique message ID
        const status = 'sent';  // Initial message status
        const currentTimestamp = new Date().toISOString();  // Current timestamp for createdAt and updatedAt

        // Create and save the new message using Sequelize, bypassing validation
        const newMessage = await Message.create({
            messageId,
            senderId,
            receiverId,
            messageContent,
            status,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        }, {
            validate: false  // Bypass Sequelize validation
        });

        // Return the message data
        return {
            messageId: newMessage.messageId,
            senderId: newMessage.senderId,
            receiverId: newMessage.receiverId,
            messageContent: newMessage.messageContent,
            status: newMessage.status,
            createdAt: newMessage.createdAt,
            updatedAt: newMessage.updatedAt,
        };
    } catch (error) {
        console.error('Error sending message:', error);
        throw new Error('Error inserting message into the database');
    }
};