import axios from 'axios';

const API_URL_AUTH = 'http://localhost:3000/api/auth'; // Adjust this to your backend URL
const API_URL_USER = 'http://localhost:3000/api/user'; // Define the user API URL
const API_URL_MESSAGE = 'http://localhost:3000/api/message'; // Define the message API URL

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
        const response = await axios.get(API_URL_USER, {
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

// Function to fetch friends
export const fetchFriends = async () => {
    const token = localStorage.getItem('token'); // Get the token from local storage
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axios.get(`${API_URL_USER}/friends`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data; // Return the list of friends
    } catch (error) {
        console.error('Error fetching friends:', error);
        throw error; // Re-throw the error for handling in the component
    }
};

// Function to fetch groups
export const fetchGroups = async () => {
    const token = localStorage.getItem('token'); // Get the token from local storage
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axios.get(`${API_URL_USER}/groups`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data; // Return the list of groups
    } catch (error) {
        console.error('Error fetching groups:', error);
        throw error; // Re-throw the error for handling in the component
    }
};

// Function to fetch messages
export const fetchMessages = async (id) => {
    const token = localStorage.getItem('token'); // Get the token from local storage
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axios.get(`${API_URL_MESSAGE}/${id}/messages`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data; // Return the list of messages
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error; // Re-throw the error for handling in the component
    }
};
