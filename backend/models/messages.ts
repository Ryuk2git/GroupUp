import mongoose, { Schema, Document } from "mongoose";

// Define the Message interface
export interface IMessage extends Document {
    chatId: string;
    senderId: string;
    receiverId?: string; // Null for group messages
    groupId?: string; // Null for private messages
    messageType: "text" | "image" | "video" | "gif" | "document" | "audio"; // Added "audio"
    text?: string;
    mediaUrl?: string;
    fileName?: string;
    replyTo?: mongoose.Types.ObjectId;
    forwarded: boolean;
    reactions: { userId: string; emoji: string }[];
    status: {
        delivered: string[];
        read: string[];
    };
    starredBy: string[];
    isEdited: boolean;
    editedAt?: Date;
    deletedFor: string[]; // Tracks which users deleted the message
    createdAt: Date;
    updatedAt?: Date;
    // Audio Message Fields
    audioUrl?: string; // URL of the audio file
    audioDuration?: number; // Duration in seconds
    waveformData?: number[]; // Optional waveform visualization data
}

// Define Schema
const MessageSchema: Schema = new Schema<IMessage>(
    {
        chatId: { type: String, required: true },
        senderId: { type: String, required: true },
        receiverId: { type: String, default: null },
        groupId: { type: String, default: null },
        messageType: { type: String, enum: ["text", "image", "video", "gif", "document", "audio"], required: true },
        text: { type: String, default: null },
        mediaUrl: { type: String, default: null },
        fileName: { type: String, default: null },
        replyTo: { type: Schema.Types.ObjectId, ref: "Message", default: null },
        forwarded: { type: Boolean, default: false },
        reactions: [{ userId: { type: String }, emoji: { type: String } }],
        status: {
            delivered: [{ type: String }],
            read: [{ type: String }]
        },
        starredBy: [{ type: String }],
        isEdited: { type: Boolean, default: false },
        editedAt: { type: Date, default: null },
        deletedFor: [{ type: String }], // Users who deleted this message
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: null },
        // Audio Message Fields
        audioUrl: { type: String, default: null }, // URL of audio file
        audioDuration: { type: Number, default: null }, // Audio length in seconds
        waveformData: [{ type: Number }] // Optional waveform data for visualization
    },
    { timestamps: true }
);

// Create 
const Message = mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
