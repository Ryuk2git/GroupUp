import { Request, Response } from "express";
import { sequelize } from "../config/db";
import FolderMetadata from "../models/folderMetadata";
import fileMetadata from "../models/fileMetadata";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_STORAGE_PATH = path.join(__dirname, "../../storage");

// Extend the Request interface to include file and files properties
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
      files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
    }
  }
}


// Recursive function to get all nested folders & files
const getDriveContent = (directoryPath: string): any[] => {
    const items = fs.readdirSync(directoryPath);
    return items.map((item) => {
      const itemPath = path.join(directoryPath, item);
      const stats = fs.statSync(itemPath);
  
      return {
        name: item,
        isFolder: stats.isDirectory(),
        size: stats.isDirectory() ? null : stats.size, // Only show size for files
        createdAt: stats.birthtime,
        content: stats.isDirectory() ? getDriveContent(itemPath) : null, // Recursively fetch subfolders
      };
    });
  };
  

export const fetchDriveContent = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    console.log("User Id ", userId);

    if (!userId) {
      res.status(400).json({ message: "User ID is required." });
      return;
    }

    const userDrivePath = path.join(BASE_STORAGE_PATH, userId as string, "drive");

    if (!fs.existsSync(userDrivePath)) {
      res.status(404).json({ message: "User drive not found." });
      return;
    }

    // Fetch drive content (now recursive)
    const driveContent = getDriveContent(userDrivePath);

    // Process only folders to remove IDs from names
    const processedContent = driveContent.map((item) => {
      if (item.isFolder) {
        return processItemName(item); // Apply processItemName only to folders
      }
      return item; // Return files as is
    });

    res.status(200).json({
      message: "Drive content retrieved successfully.",
      content: processedContent,
    });
  } catch (error: any) {
    console.error("Error fetching drive content:", error);
    res.status(500).json({
      message: "Error fetching drive content",
      error: error.message,
    });
  }
};

// Helper function to process folder/file names
const processItemName = (item: any): any => {
  const [id, ...nameParts] = item.name.split("_"); // Split the name by "_"
  const nameWithoutId = nameParts.join("_"); // Join the remaining parts to reconstruct the name

  return {
    ...item,
    name: nameWithoutId, // Replace the name with the processed name
    content: item.isFolder && item.content ? item.content.map(processItemName) : null, // Recursively process subfolders
  };
};

/**
 * Create a new folder inside user's drive
 */
export const createFolder = async (req: Request, res: Response) => {
    try {
        const { userId, folderName, parentFolderID, projectID, folderType } = req.body;
        console.log(userId);
        console.log(folderName);
  
        if (!userId || !folderName) {
            res.status(400).json({ message: "User ID and folder name are required." });
            return;
        }
  
        // Generate shorter UUID-based folder ID
        const shortUUID = uuidv4().split("-")[0];
        const folderID = `folder-${shortUUID}`;
  
        // Define folder path inside /storage/{userID}/drive/
        const userDrivePath = path.join(BASE_STORAGE_PATH, userId, "drive");
        let parentPath = userDrivePath;

        // If parent folder exists, use it; otherwise, default to user's drive
        if (parentFolderID) {
            const potentialParentPath = path.join(userDrivePath, parentFolderID);
            if (fs.existsSync(potentialParentPath)) {
                parentPath = potentialParentPath;
            } else {
                console.warn(`Parent folder ${parentFolderID} does not exist. Creating in ${userDrivePath}`);
            }
        }

        const newFolderPath = path.join(parentPath, `${folderID}_${folderName}`);

        // Ensure base user drive exists before creating new folder
        if (!fs.existsSync(userDrivePath)) {
            fs.mkdirSync(userDrivePath, { recursive: true });
        }

        // Create folder in filesystem
        fs.mkdirSync(newFolderPath);

        // Get timestamp
        const createdAt = new Date();

        // Insert into MySQL using raw SQL query
        await sequelize.query(
        `INSERT INTO folders (folder_id, parent_id, owner_id, folder_name, folder_type, project_id, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
        {
            replacements: [folderID, parentFolderID || null, userId, folderName, "user", projectID || null, createdAt],
            type: "INSERT",
        }
        );

        // Insert metadata into MongoDB
        await FolderMetadata.create({
        folder_id: folderID,
        tags: [],
        shared_with: [],
        additional_info: "",
        });

        res.status(201).json({
            message: "Folder created successfully.",
            folderID,
            parentFolderID: parentFolderID || "root",
            path: newFolderPath,
        });
  
    } catch (error) {
      console.error("Error creating folder:", error);
        res.status(500).json({ message: "Error creating folder", error: error.message });
        return;
    }
};

/**
 * Multer Configuration for File Upload
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const userId = req.body.userId;
      const folderId = req.body.folderId || "";
      
      if (!userId) {
        return cb(new Error("User ID is required"), "");
      }
  
      const userDrivePath = path.join(BASE_STORAGE_PATH, userId, "drive");
      const targetPath = folderId ? path.join(userDrivePath, folderId) : userDrivePath;
  
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
      }
      cb(null, targetPath);
    },
    filename: (req, file, cb) => {
    //   const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage });

/**
 * Upload a single file to user's drive
 */
export const uploadFile = async (req: Request, res: Response) => {
    upload.single("file")(req, res, async (err) => {
        console.log("✅ File received:", req.file);
        console.log("✅ User ID received:", req.body.userId);

        if (err) {
            console.error("File upload error:", err);
            res.status(500).json({ message: "File upload failed", error: err.message });
            return;
        }

        if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
        }

        try {
            const userId = req.body.userId;
            const folderId = req.body.folderId || "";

            console.log(userId, folderId);

        if (!userId) {
            res.status(400).json({ message: "User ID and Folder ID are required." });
            return;
        }

        const fileID = `file-${uuidv4().split("-")[0]}`;
        const filePath = path.join(BASE_STORAGE_PATH, userId, "drive", folderId, req.file.filename);
        const uploadedAt = new Date();

        // Insert file info into MySQL
        await sequelize.query(
            `INSERT INTO files (file_id, owner_id, file_name, file_type, file_size, file_path, is_deleted, uploaded_at, last_modified, metadata_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            {
            replacements: [
                fileID,
                userId,
                req.file.originalname,
                req.file.mimetype,
                req.file.size,
                filePath,
                false, // is_deleted = false
                uploadedAt,
                uploadedAt,
                fileID, // Using fileID as metadata_id
            ],
            type: "INSERT",
            }
        );

        // Insert file metadata into MongoDB
        await fileMetadata.create({
            file_id: fileID,
            tags: [],
            shared_with: [],
            version_history: [{ version: 1, updatedBy: userId, timestamp: uploadedAt }],
            comments: [],
        });
        console.log("File Name is: ",req.file.originalname);
        res.status(201).json({
            message: "File uploaded successfully",
            file: { fileID, filePath, fileName: req.file.originalname },
        });
        return;

        } catch (error) {
            console.error("Error saving file info:", error);
            res.status(500).json({ message: "Error saving file info", error: error.message });
            return;
        }
    });
};
  
  /**
   * Upload multiple files (Folder Upload)
   */
  export const uploadFolder = async (req: Request, res: Response) => {
    try {
        // ✅ Check for Multer errors
        if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
            res.status(400).json({ message: "No files uploaded" });
            return;
        }

        const { userID, folderID, filePaths } = req.body; // `filePaths` contains relative paths
        
        // ✅ Ensure `filePaths` is an array
        const filePathsArray = typeof filePaths === "string" ? JSON.parse(filePaths) : filePaths;

        if (!userID || !folderID || !filePathsArray || !Array.isArray(filePathsArray)) {
            res.status(400).json({ message: "User ID, Folder ID, and file paths are required." });
            return;
        }

        const uploadedAt = new Date();
        const insertedFiles: any[] = [];

        for (let i = 0; i < (req.files as Express.Multer.File[]).length; i++) {
            const file = (req.files as Express.Multer.File[])[i];
            const relativePath = filePathsArray[i]; // Get the relative path sent from frontend

            if (!relativePath) continue; // Skip if no path info provided

            const fileID = `file-${uuidv4().split("-")[0]}`;
            const fileStoragePath = path.join("uploads", userID, "drive", relativePath);
            
            // ✅ Ensure nested folders exist
            fs.mkdirSync(path.dirname(fileStoragePath), { recursive: true });

            // ✅ Move file to correct location
            fs.renameSync(file.path, fileStoragePath);

            // ✅ Insert into MySQL
            await sequelize.query(
                `INSERT INTO files (file_id, owner_id, file_name, file_type, file_size, file_path, is_deleted, uploaded_at, last_modified, metadata_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                {
                    replacements: [
                        fileID,
                        userID,
                        path.basename(relativePath), // Store just the file name
                        file.mimetype,
                        file.size,
                        relativePath, // Store relative path instead of absolute
                        false,
                        uploadedAt,
                        uploadedAt,
                        fileID,
                    ],
                    type: "INSERT",
                }
            );

            // ✅ Insert metadata into MongoDB
            await fileMetadata.create({
                file_id: fileID,
                tags: [],
                shared_with: [],
                version_history: [{ version: 1, updatedBy: userID, timestamp: uploadedAt }],
                comments: [],
            });

            insertedFiles.push({ fileID, filePath: relativePath, fileName: path.basename(relativePath) });
        }

        res.status(201).json({
            message: "Folder uploaded successfully",
            files: insertedFiles,
        });
        return;

    } catch (error) {
        console.error("Error saving folder info:", error);
        res.status(500).json({ message: "Error saving folder info", error: error.message });
        return;
    }
};

