import { getFriends } from '../services/friendsService.js'; // Adjust the import based on your file structure
import User from '../models/User.js';  // Specify the exact file
import Friend from '../models/Friends.js';  // Specify the exact file
import sequelize from '../config/database.js';

// export const fetchFriends = async (req, res) => {
//     const token = req.headers.authorization?.split(' ')[1]; // Get the token from the request headers
//     if (!token) {
//         return res.status(401).json({ msg: 'No token provided' });
//     }

//     try {
//         const friends = await getFriends(token);
        
//         // Filter friends for the specific user based on your business logic
//         const userId = req.user.userID; // Assume userId is set by the auth middleware
//         const friendList = friends.filter(friend => 
//             (friend.userId === userId || friend.friendId === userId) && 
//             friend.status === 'accepted' // Assuming "accepted" indicates a confirmed friendship
//         );

//         res.json(friendList);
//     } catch (error) {
//         console.error('Error fetching friends:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// export const fetchFriends = async (req, res) => {    
//     try{
//         const friends = await getFriends();
//         res.json(friends);
//     }catch(error){
//         console.error('Error fetching friends:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

export const fetchFriends = async (req, res) => {
    const userID = req.params.userID; // Get userID from the request body params
    console.log("User ID from params: ", userID);

    const token = req.headers['x-auth-token']; // Get the token from headers

    // Validate the token
    if (!token) {
        console.log("Token is missing.");
        return res.status(401).json({ error: 'Token is missing.' });
    }

    try {
        // Use raw SQL query to fetch friends
        const rawQuery = `
            SELECT f.friendId, f.status, u.username
            FROM friends f
            JOIN users u 
            ON u.userID = f.friendId
            WHERE f.userId = :userID;
        `;

        // Execute the query with parameterized userID
        const friends = await sequelize.query(rawQuery, {
            replacements: { userID }, // Parameterized query for security
            type: sequelize.QueryTypes.SELECT, // Specify SELECT query
        });

        if (friends.length === 0) {
            return res.status(404).json({ message: 'No friends found.' });
        }

        return res.status(200).json({ friends });

    } catch (error) {
        console.error("Error fetching friends: ", error);
        return res.status(500).json({ error: 'Error fetching friends.' });
    }
};



// export const fetchFriends = async (req, res) => {
//     const { userID } = req.query;  // Get the userId from query parameters
//     const token = req.headers['x-auth-token'];  // Get the token from headers

//     if (!token) {
//         return res.status(401).json({ error: 'Token is missing.' });
//     }

//     try {
//         // Call the service to fetch friends
//         console.log("Inside controller");
//         const friends = await getFriends(userID, token);
        
//         if (friends.length === 0) {
//             return res.status(404).json({ message: 'No friends found.' });
//         }

//         // Return the friends list
//         return res.status(200).json({ friends });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Error fetching friends.' });
//     }
// };
