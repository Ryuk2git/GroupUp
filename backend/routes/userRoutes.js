import express from 'express';
import authService from '../services/authService'; 
import User from '../models/User.js'; 

const router = express.Router();

// Route to fetch user details
router.get('/', authService.authenticateRequest, async (req, res) => {
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

export default router;
