import mongoose, { Schema, Document } from "mongoose";

// Define the Message interface for TypeScript
export interface IMessage extends Document {
    chatId: string; // Fetched from MySQL
    senderId: string; // Fetched from MySQL
    receiverId?: string; // Null if it's a group message
    groupId?: string; // Null if it's a private message
    messageType: "text" | "image" | "video" | "gif" | "document";
    text?: string;
    mediaUrl?: string;
    fileName?: string;
    replyTo?: mongoose.Types.ObjectId; // Reference to another message
    forwarded: boolean;
    reactions: { userId: number; emoji: string }[];
    status: {
        delivered: string[]; // List of user IDs who received the message
        read: string[]; // List of user IDs who read the message
    };
    starredBy: number[]; // Users who starred the message
    createdAt: Date;
    updatedAt?: Date;
}

// Define the Mongoose Schema
const MessageSchema: Schema = new Schema<IMessage>(
    {
        chatId: { type: String, required: true },
        senderId: { type: String, required: true },
        receiverId: { type: String, default: null },
        groupId: { type: String, default: null },
        messageType: { type: String, enum: ["text", "image", "video", "gif", "document"], required: true },
        text: { type: String, default: null },
        mediaUrl: { type: String, default: null },
        fileName: { type: String, default: null },
        replyTo: { type: Schema.Types.ObjectId, ref: "Message", default: null },
        forwarded: { type: Boolean, default: false },
        reactions: [
            {
                userId: { type: Number },
                emoji: { type: String }
            }
        ],
        status: {
            delivered: [{ type: Number }],
            read: [{ type: Number }]
        },
        starredBy: [{ type: Number }],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: null }
    },
    { timestamps: true } // Automatically creates 'createdAt' and 'updatedAt' fields
);

// Create the Mongoose Model
const Message = mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
