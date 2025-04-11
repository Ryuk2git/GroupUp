import { Request, Response } from "express";
import Message from "../models/messages";
import User from "../models/users"; // Import User model
import { sequelize } from "../config/db";
import { QueryTypes } from "sequelize";

// Function to send a new message
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    const { chatId } = req.params;
    try {
        const {
            senderId,
            receiverId,
            groupId,
            messageType,
            text,
            mediaUrl,
            fileName,
            replyTo,
            forwarded,
            audioUrl,
            audioDuration,
            waveformData
        } = req.body;

        if (!chatId || !senderId || !messageType) {
            res.status(400).json({ error: "Chat ID, Sender ID, and Message Type are required" });
            return;
        }

        const newMessage = new Message({
            chatId,
            senderId,
            receiverId: receiverId || null,
            groupId: groupId || null,
            messageType,
            text: text || null,
            mediaUrl: mediaUrl || null,
            fileName: fileName || null,
            replyTo: replyTo || null,
            forwarded: forwarded || false,
            reactions: [],
            status: { delivered: [], read: [] },
            starredBy: [],
            isEdited: false,
            editedAt: null,
            deletedFor: [],
            createdAt: new Date(),
            updatedAt: null,
            audioUrl: audioUrl || null,
            audioDuration: audioDuration || null,
            waveformData: waveformData || []
        });

        await newMessage.save();

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Function to get messages for a specific chat
export const getMessages = async (req: Request, res: Response): Promise<void> => {
    try {
        const { chatId } = req.params;

        if (!chatId) {
            res.status(400).json({ error: "Chat ID is required" });
            return;
        }

        // Step 1: Get messages from MongoDB
        const messages = await Message.find({ chatId }).sort({ createdAt: 1 }).lean();

        // Step 2: Extract unique senderIds
        const senderIds = [...new Set(messages.map(msg => msg.senderId))];

        if (senderIds.length === 0) {
            res.status(200).json([]);
            return;
        }

        // Step 3: Get user data from MySQL using raw SQL
        const usersData = await sequelize.query(
            `SELECT userID, userName AS senderName 
             FROM users 
             WHERE userID IN (:senderIds)`,
            {
                replacements: { senderIds },
                type: QueryTypes.SELECT
            }
        );

        // Step 4: Map senderId to name/pic
        const senderMap = usersData.reduce((acc: any, user: any) => {
            acc[user.userID] = { senderName: user.senderName };
            return acc;
        }, {});

        // Step 5: Enrich message objects
        const enrichedMessages = messages.map(msg => ({
            ...msg,
            senderName: senderMap[msg.senderId]?.senderName || "Unknown",
        }));

        res.status(200).json(enrichedMessages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Function to get chat details (e.g., last message)
export const getChatDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const { chatId } = req.query;

        if (!chatId) {
            res.status(400).json({ error: "Chat ID is required" });
            return;
        }

        const lastMessage = await Message.findOne({ chatId }).sort({ createdAt: -1 });

        if (!lastMessage) {
            res.status(404).json({ message: "No messages found for this chat" });
            return;
        }

        res.status(200).json({
            lastMessage: {
                senderId: lastMessage.senderId,
                text: lastMessage.text,
                messageType: lastMessage.messageType,
                mediaUrl: lastMessage.mediaUrl,
                createdAt: lastMessage.createdAt
            }
        });
    } catch (error) {
        console.error("Error fetching chat details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Function to add a reaction to a message
export const addReaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const { messageId, userId, emoji } = req.body;

        if (!messageId || !userId || !emoji) {
            res.status(400).json({ error: "Message ID, User ID, and Emoji are required" });
            return;
        }

        const updatedMessage = await Message.findByIdAndUpdate(
            messageId,
            { $push: { reactions: { userId, emoji } } },
            { new: true }
        );

        if (!updatedMessage) {
            res.status(404).json({ error: "Message not found" });
            return;
        }

        res.status(200).json(updatedMessage);
    } catch (error) {
        console.error("Error adding reaction:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Function to edit a message
export const editMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { messageId, userId, newText } = req.body;

        if (!messageId || !userId || !newText) {
            res.status(400).json({ error: "Message ID, User ID, and New Text are required" });
            return;
        }

        const message = await Message.findById(messageId);

        if (!message) {
            res.status(404).json({ error: "Message not found" });
            return;
        }

        if (message.senderId !== userId) {
            res.status(403).json({ error: "Unauthorized: You can only edit your own messages" });
            return;
        }

        message.text = newText;
        message.isEdited = true;
        message.editedAt = new Date();

        await message.save();

        res.status(200).json(message);
    } catch (error) {
        console.error("Error editing message:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Function to delete a message (soft delete for specific users)
export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { messageId, userId } = req.body;

        if (!messageId || !userId) {
            res.status(400).json({ error: "Message ID and User ID are required" });
            return;
        }

        const message = await Message.findById(messageId);

        if (!message) {
            res.status(404).json({ error: "Message not found" });
            return;
        }

        // Soft delete for the specific user
        if (!message.deletedFor.includes(userId)) {
            message.deletedFor.push(userId);
            await message.save();
        }

        res.status(200).json({ message: "Message deleted for this user" });
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
