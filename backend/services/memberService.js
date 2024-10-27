import db from '../config/database.js'; // Adjust the import based on your database setup

export const getMembers = async () => {
    try {
        const members = await db.query('SELECT * FROM users'); // Adjust based on your database query
        return members;
    } catch (error) {
        console.error('Error fetching members:', error);
        throw error; // Propagate the error to the controller
    }
};