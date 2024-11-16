import { getFriends } from '../services/friendsService.js'; // Adjust the import based on your file structure
import User from '../models/User.js';  // Specify the exact file
import Friend from '../models/Friends.js';  // Specify the exact file

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

export const fetchFriends = async (req, res) => {
    try{
        const friends = await getFriends();
        res.json(friends);
    }catch(error){
        console.error('Error fetching friends:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// export const fetchFriends = async (req, res) => {
//     const { userID } = req.query;  // Get the userId from route parameters
//     console.log("User ID: ", userID);

//     const token = req.headers['x-auth-token'];  // Get the token from headers
//     const headUserID = req.headers['userID'];
//     console.log(headUserID);

//     // Token validation logic (if you are using JWT)
//     if (!token) {
//         console.log("I did bnot recieve the token");
//         return res.status(401).json({ error: 'Token is missing.' });
//     }

//     try {
//         // Find the user by the userId
//         const user = await User.findByPk(userID);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found.' });
//         }

//         // Fetch the friends by userId using the Friend model
//         const friends = await Friend.findAll({
//             where: {
//                 userId: headUserID,  // Find friends of the current user
//             },
//             include: [
//                 {
//                     model: User,  // Include the User model to get the friend's details
//                     as: 'friend',  // Alias to avoid naming conflict (User table alias)
//                     attributes: ['userID', 'username']  // Only get friendId and username
//                 }
//             ]
//         });

//         if (friends.length === 0) {
//             return res.status(404).json({ message: 'No friends found.' });
//         }

//         // Format the result to return the friendId and username
//         const formattedFriends = friends.map(friend => ({
//             friendId: friend.friendId,  // Friend ID from Friend model
//             username: friend.friend.username,  // Friend's username from User model
//         }));

//         return res.status(200).json({ friends: formattedFriends });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Error fetching friends.' });
//     }
// };


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
