import mongoose, { Schema, Document } from 'mongoose';

interface IComment {
    commentedBy: string;
    comment: string;
    timestamp: Date;
}

interface IAttachment {
    fileName: string;
    fileURL: string;
    uploadedBy: string;
    uploadedAt: Date;
}

export interface ITask extends Document {
    title: string;
    description?: string;
    projectId: string;
    assignedTo: string[]; // user IDs
    status: 'todo' | 'in_progress' | 'done' | 'blocked';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate?: Date;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    comments?: IComment[];
    attachments?: IAttachment[];
}

const CommentSchema = new Schema<IComment>(
    {
        commentedBy: { type: String, required: true },
        comment: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
    },
    { _id: false }
);

const AttachmentSchema = new Schema<IAttachment>(
    {
        fileName: { type: String, required: true },
        fileURL: { type: String, required: true },
        uploadedBy: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const TaskSchema = new Schema<ITask>(
    {
        title: { type: String, required: true },
        description: { type: String },
        projectId: { type: String, index: true, required: false }, // <-- not required
        assignedTo: [{ type: String }], // <-- array, not required
        status: {
            type: String,
            enum: ['todo', 'in_progress', 'done', 'blocked'],
            default: 'todo',
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium',
        },
        dueDate: { type: Date },
        createdBy: { type: String, required: true },
        comments: [CommentSchema],
        attachments: [AttachmentSchema],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ITask>('Task', TaskSchema);
