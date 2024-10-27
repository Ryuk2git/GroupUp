import express from 'express';
import authService from '../services/authService'; 
import User from '../models/User.js'; 

const router = express.Router();

// Route to fetch user details
router.get('/user', authService.authenticateRequest, async (req, res) => {
    try {
        // Fetch user based on the userID stored in the token
        const user = await User.findOne({ where: { userID: req.user.userID } });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({ 
            user: {
                name: user.name,
                emailID: user.emailID,
                pfpUrl: user.pfpUrl, // Ensure this field exists in your model
            }
        });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Route to fetch user members
router.get('/members', authService.authenticateRequest, async (req, res) => {
    try {
        // Assuming you have a method to fetch members
        const members = await User.findAll(); // Replace with actual logic for fetching members
        res.json({ members });
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error });
    }
});

export default router;
