// import authService from '../services/authService.js'; // Adjust the import based on your file structure
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

// services/friendsService.js
// import db from '../config/database.js';  // Assuming you have a db config file
// import jwt from 'jsonwebtoken';    // Assuming you're using JWT for token verification

// // Function to verify the JWT token (if needed)
// const verifyToken = (token) => {
//     const privateKey = "mySuperSecretKey123!@";

//     try {
//         const decoded = jwt.verify(token, privateKey);  // Decode the token using secret
//         return decoded;
//     } catch (error) {
//         throw new Error('Invalid or expired token');
//     }
// };

// // Function to get friends from the database
// export const getFriends = async (userID, token) => {
//     // Verify the token before making any database calls
//     verifyToken(token);
//     console.log("Token decoded");

//     // SQL query to get friends and their details
//     const query = `
//         SELECT f.friendId, f.status, u.username
//         FROM friends f
//         JOIN users u ON u.userId = f.friendId
//         WHERE f.userId = ?;
//     `;
    
//     // Execute the query with userId as parameter
//     const [results] = await db.query(query, [userID]);

//     return results;  // Return the list of friends
// };
