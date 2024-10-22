import express from "express";
import File from '../models/File.js';
import Folder from '../models/Folder.js';
import { v4 as uuidv4 } from 'uuid'; // For unique IDs if necessary
const router = express.Router();

// New File
router.post('/files', async (req, res) => {
    const { userId, projectName, parentFolderId, displayName, projectId } = req.body;

    // Generate storage name based on userId and project name
    const storageName = `${userId}_${projectName}`;

    try {
        const newFile = await File.create({
            displayName,   // User-friendly name
            storageName,   // Unique storage name
            parentFolderId,
            projectId,
        });
        res.status(201).json(newFile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Files for projects
router.get('/files/:projectId', async (req, res) => {
    const { projectId } = req.params;
    try {
        const files = await File.findAll({ where: { projectId } });
        res.status(200).json(files);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete file
router.delete('/files/:fileId', async (req, res) => {
    const { fileId } = req.params;
    try {
        await File.destroy({ where: { id: fileId } }); // Changed 'fileId' to 'id'
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Rename file
router.put('/files/:fileId', async (req, res) => {
    const { fileId } = req.params;
    const { displayName } = req.body; // Only update displayName

    try {
        const updatedFile = await File.update({ displayName }, { where: { id: fileId } }); // Changed 'fileId' to 'id'
        res.status(200).json(updatedFile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Create a new folder
router.post('/folders', async (req, res) => {
    const { userId, projectName, parentFolderId, displayName } = req.body;

    // Generate storage name based on userId and project name
    const storageName = `${userId}_${projectName}`;

    try {
        const newFolder = await Folder.create({
            displayName,   // User-friendly name
            storageName,   // Unique storage name
            parentFolderId,
            userId,
        });
        res.status(201).json(newFolder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Folders for project
router.get('/folders/:projectId', async (req, res) => {
    const { projectId } = req.params;
    try {
        const folders = await Folder.findAll({ where: { projectId } });
        res.status(200).json(folders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a folder
router.delete('/folders/:folderId', async (req, res) => {
    const { folderId } = req.params;
    try {
        await Folder.destroy({ where: { id: folderId } }); // Changed 'folderId' to 'id'
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
