import { getFriends } from '../services/friendsService.js'; // Adjust the import based on your file structure

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