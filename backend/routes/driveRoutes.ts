import express from "express";
import { createFolder, fetchDriveContent, uploadFile, uploadFolder} from "../controllers/driveController";

const router = express.Router();

//ROute to get Drive Content
router.get("/content", fetchDriveContent);

// Route to create a new folder
router.post("/folder", createFolder);

// Route to upload a single file
router.post("/file", uploadFile);

// Route to upload a folder (multiple files)
router.post("/folder/upload", uploadFolder);

export default router;