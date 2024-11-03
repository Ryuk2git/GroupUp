import authService from '../services/authService.js'; // Adjust the import based on your file structure
import db from '../config/database.js'; // Adjust based on your database setup

// export const getFriends = async (token) => {
//     // Validate the token
//     const isValid = authService.validateToken(token);
//     console.log("Freinds token validation: " + isValid);
//     if (!isValid) {
//         throw new Error('Invalid token');
//     }
//     try {
//         const [friends] = await db.query('SELECT * FROM friends'); // Fetch all friends
//         return friends;
//     } catch (error) {
//         console.error('Error fetching friends:', error);
//         throw error; // Propagate the error to the controller
//     }
// };


export const getFriends = async () => {
    try{
        const friends = await db.query('SELECT * FROM friends');
        return friends;
    }catch(error){
        console.error('Error fetching friends: ', error);
        throw error;
    }
};