import mongoose, { Schema, Document } from "mongoose";

interface IEventLog extends Document {
    eventId: string;
    logs: {
        updatedBy: string;
        action: string;   // e.g., 'created', 'updated', 'canceled'
        details?: string; // Optional details
        timestamp: Date;
    }[];
}

const EventLogSchema = new Schema<IEventLog>({
    eventId: { type: String, required: true, index: true },
    logs: [
        {
            updatedBy: { type: String, required: true },
            action: { type: String, required: true },
            details: String,
            timestamp: { type: Date, default: Date.now }
        }
    ]
});

export default mongoose.model<IEventLog>('EventLog', EventLogSchema);
