import mongoose, { Schema, Document } from 'mongoose';

interface ITaskUpdate extends Document {
    taskId: string;
    updates: {
        updatedBy: string;       // User ID who made the change
        changeType: string;      // e.g., 'status_update', 'comment', 'edit'
        oldValue?: string;       // Previous value (if applicable)
        newValue?: string;       // New value (if applicable)
        timestamp: Date;         // When the update happened
    }[];
}

const TaskUpdateSchema = new Schema<ITaskUpdate>({
    taskId: { type: String, required: true, index: true },
    updates: [
        {
            updatedBy: { type: String, required: true },
            changeType: { type: String, required: true },
            oldValue: String,
            newValue: String,
            timestamp: { type: Date, default: Date.now }
        }
    ]
});

export default mongoose.model<ITaskUpdate>('TaskUpdate', TaskUpdateSchema);
