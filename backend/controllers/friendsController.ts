import { Request, response, Response } from "express";
import { sequelize } from "../config/db"; // Import the sequelize instance
import NotificationModel, { NotificationType } from "../models/notification";
import { v4 as uuidv4 } from 'uuid';
import { QueryTypes } from "sequelize";
import { io } from "../middleware/socket";
import mongoose from "mongoose";

export const getFriends = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.query;

  if (!userId) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }

  try {
    const result = await sequelize.query(
      `SELECT 
          CASE 
            WHEN f.userId = :userId THEN f.friendId 
            ELSE f.userId 
          END AS friendId, 
          u.userName, 
          u.emailID, 
          u.pfpRoute, 
          f.chatId
       FROM friends f
       LEFT JOIN users u ON u.userID = 
          CASE 
            WHEN f.userId = :userId THEN f.friendId 
            ELSE f.userId 
          END
       WHERE (f.userId = :userId OR f.friendId = :userId) 
         AND f.status = 'accepted'`,
      {
        replacements: { userId },
        type: QueryTypes.SELECT,
      }
    );

    const friends = Array.isArray(result) ? result : []; // Ensure friends is always an array

    if (friends.length === 0) {
      res.status(200).json({ message: "No friends found" });
      return;
    }

    const formattedFriends = friends.map((friend: any) => ({
      userId: friend.friendId,
      chatId:friend.chatId,
      username: friend.userName ?? "Unknown",
      email: friend.emailID ?? "Unknown",
      pfp: friend.pfpRoute ?? "Unknown",
    }));
    res.status(200).json(formattedFriends);
    return;
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};

export const sendFriendRequest = async (req: Request, res: Response) => {
  try {
      const { currentUserId, friendId } = req.body; // Get IDs from params

      if (!currentUserId || !friendId) {
          res.status(400).json({ error: "Both user IDs are required." });
          return;
      }

      // Check if friendship already exists
      const existingFriendship: any = await sequelize.query(
          `SELECT status FROM friends WHERE 
          (userId = ? AND friendId = ?) OR (userId = ? AND friendId = ?) 
          LIMIT 1`, 
          {
              replacements: [currentUserId, friendId, friendId, currentUserId],
              type: "SELECT"
          }
      );

      if (existingFriendship.length > 0) {
          const status = existingFriendship[0].status;
          if (status === "accepted") {
              res.status(400).json({ error: "You are already friends." });
              return;
          }
          if (status === "pending") {
              res.status(400).json({ error: "Friend request already sent." });
              return;
          }
      }

      // Generate a unique chatId
      const chatId = `chat-${uuidv4().slice(0, 6)}`;

      // Insert friend request into MySQL
      await sequelize.query(
          `INSERT INTO friends (chatId, userId, friendId, status) VALUES (?, ?, ?, 'pending')`,
          { 
            replacements: [chatId, currentUserId, friendId], 
            type: "INSERT" 
          }
      );
      
      const friendUserNameResult = await sequelize.query(
        `SELECT userName FROM users WHERE userID = ? LIMIT 1`,
        {
            replacements: [friendId],
            type: "SELECT"
        }
    );
    
    // Extract the userName from the query result
    const friendUserName = (friendUserNameResult as any[]).length > 0 ? (friendUserNameResult as any[])[0].userName : "Unknown User";

      // Create a notification in MongoDB
      const newNotification = new NotificationModel({
        notificationId: new mongoose.Types.ObjectId().toString(),  // Generates a unique notificationId
        userId: friendId,
        userName: friendUserName, // Fetch the friend's username
        type: NotificationType.FRIEND_REQUEST,
        content: { senderId: currentUserId, message: "You have a new friend request." },
    });
    await newNotification.save();

      await newNotification.save();

      res.status(201).json({ message: "Friend request sent successfully.", chatId });
      return;

  } catch (error: any) {
      res.status(500).json({ error: "Server Error", details: error.message });
      return;
  }
};

export const approveFriendRequest = async (req: Request, res: Response) => {
  try {
    const { friendRequestId, currentUserId , notificationId } = req.body;

    // Validate inputs
    if (!friendRequestId || !currentUserId) {
      res.status(400).json({ error: "friendRequestId and currentUserId are required." });
      return;
    }

    // Update friendship status in MySQL
    const [updatedCount]: any = await sequelize.query(
      `UPDATE friends SET status = 'accepted' WHERE userId = ? AND friendId = ?`,
      {
        replacements: [friendRequestId, currentUserId],
        type: "UPDATE",
      }
    );

    if (updatedCount === 0) {
      res.status(404).json({ error: "Friend request not found or not authorized to accept." });
      return;
    }

    // Fetch updated friendship data
    const updatedFriendship: any = await sequelize.query(
      `SELECT * FROM friends WHERE userId = ? AND friendId = ? AND status = 'accepted' LIMIT 1`,
      {
        replacements: [friendRequestId, currentUserId],
        type: "SELECT",
      }
    );

    if (!updatedFriendship.length) {
      res.status(404).json({ error: "Friend request not found." });
      return;
    }

    const { friendId, userId } = updatedFriendship[0];

    const friendUserNameResult: any = await sequelize.query(
      `SELECT userName FROM users WHERE userID = ? LIMIT 1`,
      {
        replacements: [userId],
        type: "SELECT",
      }
    );

    // Extract the userName from the query result
    const friendUserName = friendUserNameResult.length > 0 ? friendUserNameResult[0].userName : "Unknown User";


    // Create a notification in MongoDB
    const newNotification = new NotificationModel({
      notificationId: notificationId,
      userId: userId,
      userName: friendUserName,
      type: NotificationType.FRIEND_REQUEST_ACCEPTED,
      content: { senderId: userId, message: "Your friend request was accepted." },
    });

    await newNotification.save();

    // Emit real-time event
    io.to(friendId).emit("friendRequestApproved", { friendRequestId, userId });

    res.status(200).json({ message: "Friend request approved successfully." });
    return;
  } catch (error: any) {
    console.error("Error approving friend request:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
    return;
  }
};

export const rejectFriendRequest = async (req: Request, res: Response) => {
  try {
      const { chatId } = req.params;

      if (!chatId) {
          res.status(400).json({ error: "chatId is required." });
          return;
      }

      // Delete friendship request from MySQL
      const deletedCount = await sequelize.query(
          `DELETE FROM friends WHERE chatId = ?`, 
          { 
            replacements: [chatId], 
            type: "DELETE" 
          }
      );

      if (!deletedCount) {
          res.status(404).json({ error: "Friend request not found." });
          return;
      }

      // Emit real-time event
      io.emit("friendRequestRejected", { chatId });

      res.status(200).json({ message: "Friend request rejected." });
      return;

  } catch (error: any) {
      res.status(500).json({ error: "Server Error", details: error.message });
      return;
  }
};