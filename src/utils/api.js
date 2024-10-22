import axios from 'axios';

const API_URL_AUTH = 'http://localhost:3000/api/auth'; // Adjust this to your backend URL
const API_URL_USER = 'http://localhost:3000/api/user'; // Define the user API URL

export const loginUser = async (userData) => {
    const response = await axios.post(`${API_URL_AUTH}/login`, userData);
    if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token); // Ensure you're storing the token
    }
    return response.data; // Ensure it returns the token
};

export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL_AUTH}/register`, userData);
    return response.data; // Ensure it returns the token
};

export const fetchUserData = async () => {
    const token = localStorage.getItem('token'); // Get the token from local storage
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axios.get('http://localhost:3000/api/user', {
            headers: { 
                'x-auth-token': token,
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
            } // Include the token in the request headers
        });
        return response.data; // Return the user data
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};
