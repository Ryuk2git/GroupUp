import express from 'express';
import { fetchProjects } from '../controller/projectsController.js';
import Project from '../models/Project.js';
import Folder from '../models/Folder.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
 
// Define the route to fetch friends
router.post('/:userID', fetchProjects);

router.post('/create/:userID', async (req, res) => {
    const { projectName, description } = req.body;
    const userID = req.params.userID; // Assume user ID is retrieved from the token

    const projectID = uuidv4();

    try {
        // Create the project
        const newProject = await Project.create({
            projectID,
            projectName,
            ownerId: userID,
            description: description,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Create the user folder for the project
        if (newProject) {
            const userFolderName = `${userID}_${projectName.replace(/\s+/g, '_')}`;

            await Folder.create({
                folderName: userFolderName,
                parentID: null,
                projectID: projectID,
                displayName: userFolderName,
                storageName: userFolderName,
            });

            return res.status(201).json({
                projectID: newProject.projectID,
                userFolderName,
            });
        } else {
            return res.status(400).json({ error: 'Project creation failed' });
        }
    } catch (error) {
        console.error('Error creating project:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;