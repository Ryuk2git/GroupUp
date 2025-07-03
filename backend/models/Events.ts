import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
    eventId: string;
    title: string;
    description?: string;
    location: string;
    startDate: Date;
    endDate: Date;
    category: 'work' | 'personal';
    createdBy: String; // user ID of the creator
    members: String[]; // array of user IDs
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    eventId: {type: String, required: true},
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    location: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    category: {
      type: String,
      enum: ['work', 'personal'],
      default: 'personal',
    },
    createdBy: {
      type: String,
      required: true,
    },
    members: [
      {
        type: String,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IEvent>('Event', EventSchema);
