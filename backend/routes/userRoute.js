import express from 'express';
import authService from '../services/authService.js'; 
import User from '../models/User.js'; 

const router = express.Router();

// Route to fetch user details
router.get('/', authService.authenticateRequest, (req, res) => {
    // Access the user object attached to req
    const { name, emailID, pfpUrl } = req.user; // Get user details directly from req.user

    // Respond with the user details
    res.json({ 
        user: {
            name,
            emailID,
            pfpUrl,
        }
    });
});

export default router;
