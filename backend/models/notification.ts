import mongoose, { Schema, Document } from "mongoose";

// Define Notification Type Enum
export enum NotificationType {
  FRIEND_REQUEST = "friend_request",
  MESSAGE = "message",
  REMINDER = "reminder",
  FILE_SHARE = "file_share",
  MAIL = "Mail",
  FRIEND_REQUEST_ACCEPTED = "FRIEND_REQUEST_ACCEPTED",
}

// Define Content Type
interface NotificationContent {
  senderId?: string; // Used for messages, friend requests, file shares
  message?: string; // Message content
  taskId?: string; // Task or event reminders
  fileId?: string; // Shared file reference
}

// Notification Interface
export interface INotification extends Document {
  notificationId: string; // user-specific ID like "johnDoe_5"
  userId: string; // Receiver's User ID
  userName: string; // Receiver's Username
  type: NotificationType; // Type of notification
  content: NotificationContent; // Notification details
  isRead: boolean; // Read status
  createdAt: Date; // Timestamp
}

// Schema
const notificationSchema = new Schema<INotification>(
  {
    notificationId: { type: String, required: true, unique: true }, // User-specific ID
    userId: { type: String, required: true }, // Receiver's User ID
    userName: { type: String, required: true }, // Receiver's Username
    type: { type: String, enum: Object.values(NotificationType), required: true },
    content: { type: Object, required: true }, // Dynamic content based on type
    isRead: { type: Boolean, default: false }, // Mark read/unread
  },
  { timestamps: { createdAt: "createdAt" } } // Auto add createdAt timestamp
);

// Middleware: Generate `notificationId` before saving
notificationSchema.pre<INotification>("save", async function (next) {
  if (!this.notificationId) {
    // Get count of existing notifications for this user
    const count = await NotificationModel.countDocuments({ userId: this.userId });
    this.notificationId = `${this.userName}_${count + 1}`;
  }
  next();
});

// Model
const NotificationModel = mongoose.model<INotification>("Notification", notificationSchema);

export default NotificationModel;
