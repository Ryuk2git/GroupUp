import Message from '../models/Message.js';
import Friend from '../models/Friends.js';
import crypto from 'crypto';
import { Op } from 'sequelize';
import { Server } from 'socket.io';
import sequelize from '../config/database.js'; // For transaction support

// Encryption Setup
const algorithm = 'aes-256-cbc'; // Encryption algorithm
const secretKey = process.env.ENCRYPTION_KEY || 'mySuperSecretKey123!@';

if (secretKey === 'your-secure-secret-key') {
    console.error('Warning: Using an insecure default encryption key. Set ENCRYPTION_KEY in the environment variables.');
}

// Initialize Socket.IO instance
let io;

// Function to set Socket.IO instance
export const setSocketIO = (socketIO) => {
    io = socketIO;
};

// Encrypt message
const encryptMessage = (messageContent) => {
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
    let encrypted = cipher.update(messageContent, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`; // Store IV and encrypted content separated by a colon
};

// Decrypt message
const decryptMessage = (encryptedContent) => {
    const [ivHex, content] = encryptedContent.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
    let decrypted = decipher.update(content, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

// Send an encrypted message with transaction handling
export const sendMessage = async (senderId, receiverId, messageContent) => {
    const transaction = await sequelize.transaction(); // Start transaction

    try {
        const encryptedMessage = encryptMessage(messageContent);

        // Save the message to the Message model
        const message = await Message.create({
            senderId,
            receiverId,
            messageContent: encryptedMessage, 
            status: 'sent',
        }, { transaction });

        // Update both sender and receiver's Friend relationship
        await Friend.update({ messageId: message.messageId }, {
            where: { userId: senderId, friendId: receiverId },
        }, { transaction });

        await Friend.update({ messageId: message.messageId }, {
            where: { userId: receiverId, friendId: senderId },
        }, { transaction });

        await transaction.commit();  // Commit the transaction if successful

        // Emit the message to the recipient through WebSocket
        if (io) {
            io.to(receiverId).emit('receiveMessage', {
                messageId: message.messageId,
                senderId,
                receiverId,
                messageContent: decryptMessage(encryptedMessage),
                status: message.status,
                sentAt: message.createdAt,
            });
        }

        return message;
    } catch (error) {
        await transaction.rollback();  // Rollback transaction on failure
        console.error('Error sending message:', error);
        throw new Error('Failed to send message');
    }
};

// Update Message Status (Delivered/Read)
export const updateMessageStatus = async (messageId, status) => {
    try {
        const message = await Message.findByPk(messageId);
        if (message) {
            message.status = status;
            await message.save();

            // Emit the updated message status through WebSocket
            if (io) {
                io.to(message.receiverId).emit('updateMessageStatus', {
                    messageId: message.messageId,
                    status: message.status,
                });
            }
        }
    } catch (error) {
        console.error('Error updating message status:', error);
        throw new Error('Failed to update message status');
    }
};

// Retrieve and decrypt messages between two users with pagination support
export const getMessages = async (senderId, receiverId, limit = 20, offset = 0) => {
    try {
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId },
                ],
            },
            order: [['createdAt', 'ASC']],
            limit, // Apply pagination limit
            offset, // Apply pagination offset
        });

        // Decrypt the message content and return readable text
        return messages.map((message) => {
            const decryptedMessage = decryptMessage(message.messageContent);
            return {
                messageId: message.messageId,
                senderId: message.senderId,
                receiverId: message.receiverId,
                messageContent: decryptedMessage,
                status: message.status,
                sentAt: message.sentAt || message.createdAt,
            };
        });
    } catch (error) {
        console.error('Error retrieving messages:', error);
        throw new Error('Failed to retrieve messages');
    }
};

// Fetch paginated chat history for a user
export const getUserChatHistory = async (userId, limit = 50, offset = 0) => {
    try {
        const messages = await Message.findAll({
            where: {
                [Op.or]: [{ senderId: userId }, { receiverId: userId }],
            },
            order: [['createdAt', 'ASC']],
            limit, // Apply pagination limit
            offset, // Apply pagination offset
        });

        // Decrypt the message content and return readable text
        return messages.map((message) => {
            const decryptedMessage = decryptMessage(message.messageContent);
            return {
                messageId: message.messageId,
                senderId: message.senderId,
                receiverId: message.receiverId,
                messageContent: decryptedMessage,
                status: message.status,
                sentAt: message.sentAt || message.createdAt,
            };
        });
    } catch (error) {
        console.error('Error fetching user chat history:', error);
        throw new Error('Could not fetch chat history');
    }
};

// Delete a specific message by its ID and return the deleted message
export const deleteMessage = async (messageId) => {
    try {
        const message = await Message.findByPk(messageId);
        if (!message) {
            throw new Error('Message not found');
        }

        await Message.destroy({ where: { messageId } });
        console.log(`Message with ID: ${messageId} has been deleted.`);

        // Emit delete event via Socket.IO (optional)
        if (io) {
            io.to(message.receiverId).emit('deleteMessage', { messageId });
        }

        return message;  // Return the deleted message (could be useful for logging)
    } catch (error) {
        console.error('Error deleting message:', error);
        throw new Error('Could not delete message');
    }
};
