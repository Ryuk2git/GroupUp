import { Request, Response } from "express";
import NotificationModel, { NotificationType } from "../models/notification";

// Create a new notification
export const createNotification = async (req: Request, res: Response) => {
    try{
        const { userId, userName, type, content, referenceId } = req.body;

        if (!userId || !userName || !type || !content) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }

        const newNotification = new NotificationModel({
        userId,
        userName,
        type,
        content,
        referenceId,
        });

        await newNotification.save();
        res.status(201).json(newNotification);
        return;
    }catch(error: any){
        res.status(500).json({ error: "Server Error", details: error });
        return;
   }
};

// Get notifications for a user (Paginated)
export const getNotifications = async (req: Request, res: Response) => {
    try{
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);

        const notifications = await NotificationModel.find({ userId })
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

        res.status(200).json(notifications);
        return;
    }catch(error: any) {
        res.status(500).json({ error: "Server Error", details: error });
        return;
    }
};

// Mark a notification as read (Special Handling for Messages & Mails)
export const markAsReadNotification = async (req: Request, res: Response) => {
    try{
        const { userId, notificationId } = req.params;

        const notification = await NotificationModel.findOne({ userId, _id: notificationId });

        if (!notification) {
            res.status(404).json({ error: "Notification not found" });
            return 
        }

        // Delete notification for Messages & Mails after reading
        if (notification.type === NotificationType.MESSAGE || notification.type === NotificationType.MAIL) {
            await NotificationModel.findByIdAndDelete(notificationId);
            res.status(200).json({ message: "Notification deleted after read" });
            return;
        }

        // Mark notification as read for other types
        notification.isRead = true;
        await notification.save();
        res.status(200).json(notification);
        return;
    }catch(error: any) {
        res.status(500).json({ error: "Server Error", details: error });
        return;
  }
};

// Delete a single notification
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { userId, notificationId } = req.params;

    const deletedNotification = await NotificationModel.findOneAndDelete({ userId, _id: notificationId });

    if (!deletedNotification) {
        res.status(404).json({ error: "Notification not found" });
        return;
    }

    res.status(200).json({ message: "Notification deleted successfully" });
    return;
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error });
    return;
  }
};

// ~Clear all notifications for a user
export const deleteAllNotification = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    await NotificationModel.deleteMany({ userId });

    res.status(200).json({ message: "All notifications cleared" });
    return;
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error });
    return;
  }
};
