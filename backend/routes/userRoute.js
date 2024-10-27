import express from 'express';
import authService from '../services/authService.js'; 
import User from '../models/User.js'; 
import Friends from '../models/Friends.js'; // Assuming you have a Friends model

const router = express.Router();

// Route to fetch user details
router.get('/', authService.authenticateRequest, (req, res) => {
    const { name, emailID, pfpUrl } = req.user;

    res.json({ 
        user: {
            name,
            emailID,
            pfpUrl,
        }
    });
});

// Route to fetch members for the specific user
router.get('/members', authService.authenticateRequest, async (req, res) => {
    console.log('Reached /members route'); // Debugging

    const userId = req.user.userID; // Get the user ID from the authenticated user

    try {
        // Fetch friends based on userId
        const friendsList = await Friends.findAll({
            where: {
                userId: userId, // Ensure you are querying the correct user
            },
            include: [
                {
                    model: User,
                    as: 'friend', // Assuming you have an alias set for the friend model
                    attributes: ['userID', 'username', 'pfpUrl'],
                },
            ],
        });

        const friends = friendsList.map(friend => friend.friend);

        // Check for search query if needed
        const { search } = req.query;
        if (search) {
            const filteredFriends = friends.filter(friend =>
                friend.username.toLowerCase().includes(search.toLowerCase())
            );
            return res.json({ members: filteredFriends });
        }

        res.json({ members: friends });
    } catch (error) {
        console.error('Error fetching members:', error); // Log the error
        res.status(500).json({ msg: 'Server error', error });
    }
});

export default router;
