import mongoose, { Schema, Document } from "mongoose";

// Define an interface for file metadata
interface IFileMetadata extends Document {
  file_id: string; // Reference to MySQL file_id
  tags?: string[];
  shared_with?: string[]; // User IDs of people with access
  version_history?: {
    version: number;
    updatedBy: string;
    timestamp: Date;
  }[];
  comments?: {
    user: string;
    comment: string;
    timestamp: Date;
  }[];
}

// Define the schema
const FileMetadataSchema = new Schema<IFileMetadata>(
  {
    file_id: { type: String, required: true, unique: true },
    tags: { type: [String], default: [] },
    shared_with: { type: [String], default: [] },
    version_history: [
      {
        version: { type: String, required: true },
        updatedBy: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    comments: [
      {
        user: { type: String, required: true },
        comment: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Export the model
export default mongoose.model<IFileMetadata>("FileMetadata", FileMetadataSchema);
