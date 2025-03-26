import mongoose, { Schema, Document } from "mongoose";

// Define an interface for folder metadata
interface IFolderMetadata extends Document {
  folder_id: string; // Reference to MySQL folder_id
  tags?: string[];
  shared_with?: string[];
  additional_info?: string; // Optional field for any extra metadata
}

// Define the schema
const FolderMetadataSchema = new Schema<IFolderMetadata>(
  {
    folder_id: { type: String, required: true, unique: true },
    tags: { type: [String], default: [] },
    shared_with: { type: [String], default: [] },
    additional_info: { type: String, default: "" },
  },
  { timestamps: true }
);

// Export the model
export default mongoose.model<IFolderMetadata>("FolderMetadata", FolderMetadataSchema);
