import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js'; // User model
import { v4 as uuidv4 } from 'uuid'; // For userID generation
import Folder from '../models/Folder.js'; // Import your Folder model
import Project from '../models/Project.js'; // Import your Project model

const privateKey = "mySuperSecretKey123!@";

// Register a new user
export const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    console.log('Request Body:', req.body); // Log the incoming request body

    const { username, name, email, password, dateOfBirth, city, state, country, role = 'user' } = req.body;
    const userID = uuidv4(); // Generate a new user ID

    try {
        // Check if the user already exists based on emailID
        let user = await User.findOne({ where: { emailID: email } });
        if (user) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }

        // Check if the username is already taken
        user = await User.findOne({ where: { username } });
        if (user) {
            return res.status(400).json({ msg: 'Username is already taken' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

        // Create a new user in the database
        user = await User.create({
            userID,
            username,
            name,
            emailID: email, 
            password: hashedPassword,
            dateOfBirth: dateOfBirth || null,
            city: city || null,
            state: state || null,
            country: country || null,
            role: role || null,
        });

        // Create a new project for the user
        const projectName = `${username}'s Project`; // Customize the project name
        const projectID = uuidv4(); // Generate a new project ID

        // Log the values before creating the project
        console.log('Creating new project with the following details:');
        console.log('Project Name:', projectName);
        console.log('Project ID:', projectID);
        console.log('Owner ID:', user.userID); // Ensure this is defined

        const newProject = await Project.create({
            projectID, 
            projectName: projectName, 
            ownerId: userID, 
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Create the main user folder in the project
        if (newProject) {
            const userFolderName = `${user.userID}_${username}`;
        
            // Ensure projectID is properly retrieved
            const projectID = newProject.projectId; // Ensure you're using the correct ID from the new project
        
            await Folder.create({
                folderName: userFolderName, // Use the correct folder name
                parentID: null, 
                projectID: projectID, 
                displayName: userFolderName, 
                storageName: userFolderName,
            });
            console.log('Creating folder with:', {
                folderName: userFolderName,
                parentID: null,
                projectID: projectID,
                displayName: userFolderName,
                storageName: userFolderName,
            });
            
        }

        // Payload for JWT token, including user role and userID
        const payload = {
            user: {
                userID: user.userID, // Using userID
                role: user.role,
            }
        };

        // Sign the JWT token
        const token = jwt.sign(payload, privateKey, { expiresIn: '1d' });

        res.json({ token, userID: user.userID});
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// Login a user
export const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { emailID, password = 'user'} = req.body; // Use emailID
    console.log('Request Body:', req.body);

    try {
        // Find the user based on emailID
        const user = await User.findOne({ where: { emailID } }); // Use emailID
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare the entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Payload for JWT token, include user role and userID
        const payload = {
            user: {
                userID: user.userID, // Using userID
                role: user.role,
            }
        };

        // Sign the JWT token
        const token = jwt.sign(payload, privateKey, { expiresIn: '1h' });

        res.json({ token, userID: user.userID});
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};
