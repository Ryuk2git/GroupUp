import { Request, Response } from "express";
import Message from "../models/messages";
import User from "../models/users"; // Import User model
import { sequelize } from "../config/db";
import { QueryTypes } from "sequelize";
import { v4 as uuidv4 } from 'uuid';

import { Server } from "socket.io";
import http from "http";

const server = http.createServer(); // Create an HTTP server
const io = new Server(server, {
    transports: ["websocket", "polling"], // Ensure compatibility with different transport methods
    path: "/socket.io", // Explicitly specify the path to match the server configuration
});

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
        const { messageId } = req.params; // Extract messageId as a string
        const { userId, emoji } = req.body;

        console.log(`Message Id: ${messageId} ::userId: ${userId} :: emoji:${emoji} `);

        if (!messageId || !userId || !emoji) {
            res.status(400).json({ error: "Message ID, User ID, and Emoji are required" });
            return;
        }

        // Fetch the message to get the chatId
        const message = await Message.findById(messageId);

        if (!message) {
            res.status(404).json({ error: "Message not found" });
            return;
        }

        const chatId = message.chatId; // Assuming message schema has a `chatId` field

        const updatedMessage = await Message.findByIdAndUpdate(
            messageId, // Use the extracted messageId
            { $push: { reactions: { userId, emoji } } },
            { new: true }
        );

        if (!updatedMessage) {
            res.status(404).json({ error: "Message not found" });
            return;
        }

        io.to(chatId.toString()).emit("messageReacted", { messageId, userId, emoji });
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
        const { messageId } = req.params;

        if (!messageId) {
            res.status(400).json({ error: "Message ID is required" });
            return;
        }

        const deleted = await Message.findByIdAndDelete(messageId);

        if (!deleted) {
            res.status(404).json({ error: "Message not found" });
            return;
        }

        io.to(deleted.chatId).emit("messageDeleted", { messageId });

        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const forwardMessage = async (req: Request, res: Response) => {
    try {
        const { fromMessageId, toChatId } = req.params;
        const { senderId } = req.body;

        const original = await Message.findById(fromMessageId);
        if (!original){
            res.status(404).json({ message: "Original message not found" });
            return;
        }

        const forwardedMessage = new Message({
            chatId: toChatId,
            senderId,
            messageType: original.messageType,
            text: original.text,
            mediaUrl: original.mediaUrl,
            fileName: original.fileName,
            audioUrl: original.audioUrl,
            audioDuration: original.audioDuration,
            waveformData: original.waveformData,
            forwarded: true
        });

        await forwardedMessage.save();
        res.status(201).json({ message: "Message forwarded", data: forwardedMessage });

    } catch (err) {
        console.error("Error forwarding message:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const replyToMessage = async (req: Request, res: Response) => {
    try {
        const { chatId, messageId } = req.params;
        const { senderId, text, messageType = "text" } = req.body;

        const repliedMessage = new Message({
            chatId,
            senderId,
            messageType,
            text,
            replyTo: messageId
        });

        await repliedMessage.save();
        res.status(201).json({ message: "Reply sent", data: repliedMessage });

    } catch (err) {
        console.error("Error replying to message:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

//GROUPS

interface GroupMemberDetails {
    userId: string;
    username: string;
    is_admin: number;
    joined_at: Date;
    profile_pic: string | null;
}

export const createGroup = async (req: Request, res: Response) => {
    const { groupName, groupDescription = "", members, createdBy } = req.body;
    
  
    if (!groupName || !Array.isArray(members) || members.length === 0) {
        res.status(400).json({ error: "Group name and members are required." });
        return;
    }
  
    const groupId = "group_" + uuidv4();
    const chatId = `chat-${uuidv4().slice(0, 6)}`;
    const t = await sequelize.transaction();
  
    try {
      // 1. Insert into groups_ table
      await sequelize.query(
        `
        INSERT INTO groups_ (groupId, groupName, groupDescription, created_by, created_at, chatId)
        VALUES (?, ?, ?, ?, NOW(), ?)
        `,
        {
          replacements: [groupId, groupName, groupDescription, createdBy, chatId],
          transaction: t,
        }
      );
  
      // 2. Prepare all members (creator is admin)
      const allMembers = [
        [groupId, createdBy, 1, new Date()],
        ...members
          .filter((id: string) => id !== createdBy)
          .map((id: string) => [groupId, id, 0, new Date()]),
      ];
  
      await sequelize.query(
        `
        INSERT INTO group_members (groupId, userId, is_admin, joined_at)
        VALUES ${allMembers.map(() => "(?, ?, ?, ?)").join(", ")}
        `,
        {
          replacements: allMembers.flat(),
          transaction: t,
        }
      );
  
      // 3. Get group details with user info
    const groupDetails = await sequelize.query<GroupMemberDetails>(
        `
        SELECT 
          g.groupId, g.groupName, g.groupDescription, g.created_by, g.created_at,
          gm.userId, gm.is_admin, gm.joined_at,
          u.username
        FROM groups_ g
        JOIN group_members gm ON g.groupId = gm.groupId
        JOIN users u ON gm.userID = u.userID
        WHERE g.groupId = ?
        `,
        {
          replacements: [groupId],
          transaction: t,
          type: QueryTypes.SELECT,
        }
      );
  
      await t.commit();
  
    res.status(201).json({
        message: "Group created successfully",
        group: {
            groupId,
            groupName,
            groupDescription,
            created_by: createdBy,
            members: Array.isArray(groupDetails) ? groupDetails.map((m) => ({
                userId: m.userId,
                username: m.username,
                is_admin: m.is_admin === 1,
                joined_at: m.joined_at,
            })) : [],
        },
      });
      return;
    } catch (err: unknown) {
      await t.rollback();
      const error = err as Error;
      console.error("Group creation error:", error);
        res.status(500).json({ error: error.message || "Failed to create group." });
        return;
    }
  };

  export const getGroups = async (req: Request, res: Response) => {
    const { userId } = req.query;
    console.log("UserID from getGroups ln 417", userId);
    if (!userId) {
        res.status(400).json({ error: "userId is required as a query parameter." });
        return;
    }

    try {
        // Get all groups where the user is either the creator or a member
        const groups = await sequelize.query(
            `
            SELECT 
                g.groupId, g.groupName, g.groupDescription, g.created_by, g.created_at, g.chatId
            FROM groups_ g
            LEFT JOIN group_members gm ON g.groupId = gm.groupId
            WHERE g.created_by = :userId OR gm.userId = :userId
            GROUP BY g.groupId
            `,
            {
                replacements: { userId },
                type: QueryTypes.SELECT,
            }
        );
        console.log("Groups:" , groups); //DEBUG LINE

        // For each group, get members
        const groupIds = groups.map((g: any) => g.groupId);
        let members: any[] = [];
        if (groupIds.length > 0) {
            members = await sequelize.query(
                `
                SELECT 
                    gm.groupId, gm.userId, gm.is_admin, gm.joined_at,
                    u.username
                FROM group_members gm
                JOIN users u ON gm.userID = u.userID
                WHERE gm.groupId IN (:groupIds)
                `,
                {
                    replacements: { groupIds },
                    type: QueryTypes.SELECT,
                }
            );
        }

        // Attach members to their groups
        const groupMap: Record<string, any> = {};
        groups.forEach((g: any) => {
            groupMap[g.groupId] = {
                ...g,
                members: [],
            };
        });
        members.forEach((m: any) => {
            if (groupMap[m.groupId]) {
                groupMap[m.groupId].members.push({
                    userId: m.userId,
                    username: m.username,
                    is_admin: m.is_admin === 1,
                    joined_at: m.joined_at,
                });
            }
        });

        const allGroups = Object.values(groupMap);

        res.status(200).json(allGroups);
    } catch (err: unknown) {
        const error = err as Error;
        console.error("Error fetching groups:", error);
        res.status(500).json({ error: error.message || "Failed to fetch groups." });
    }
};