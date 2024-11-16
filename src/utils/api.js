import axios from 'axios';

const API_URL_AUTH = 'http://localhost:3000/api/auth'; // Adjust this to your backend URL
const API_URL_USER = 'http://localhost:3000/api/user'; // Define the user API URL
const API_URL_MESSAGE = 'http://localhost:3000/api/message'; // Define the message API URL
const API_URL_MEMBER = 'http://localhost:3000/api/members'; // Define the member API URL
const API_URL_FRIENDS = 'http://localhost:3000/api/friends'; // Define the friends API URL
const API_URL_VOICE_CHANNEL = 'http://localhost:3000/api/voiceChannels'; // Define the voice channel API URL

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

// Function to fetch members
export const fetchMembers = async () => {
    const token = localStorage.getItem('token'); // Get the token from local storage
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axios.get(API_URL_MEMBER, {
            headers: { 'x-auth-token': token }
        });
        return response.data; // Return the list of members
    } catch (error) {
        console.error('Error fetching members:', error);
        throw error; // Re-throw the error for handling in the component
    }
};

// Function to add a new member
export const addNewMember = async (memberData) => {
    const token = localStorage.getItem('token'); // Get the token from local storage
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axios.post(API_URL_MEMBER, memberData, {
            headers: { 'x-auth-token': token }
        });
        return response.data; // Return the created member
    } catch (error) {
        console.error('Error adding new member:', error);
        throw error; // Re-throw the error for handling in the component
    }
};

// Function to fetch voice channels
export const fetchVoiceChannels = async () => {
    const token = localStorage.getItem('token'); // Get the token from local storage
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axios.get(API_URL_VOICE_CHANNEL, {
            headers: { 'x-auth-token': token }
        });
        return response.data; // Return the list of voice channels
    } catch (error) {
        console.error('Error fetching voice channels:', error);
        throw error; // Re-throw the error for handling in the component
    }
};

// Function to add a new voice channel
export const addNewVoiceChannel = async (channelData) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axios.post(API_URL_VOICE_CHANNEL, channelData, {
            headers: { 'x-auth-token': token }
        });
        return response.data; // Return the created voice channel
    } catch (error) {
        console.error('Error adding new voice channel:', error);
        throw error;
    }
};

// Function to fetch friends
export const fetchFriends = async () => {
    const token = localStorage.getItem('token'); // Get the token from local storage
    const userID = localStorage.getItem('userID');
    
    if (!token) {
        throw new Error('No token found');
    }
    console.log("I have the token,");
    try {
        const response = await axios.get(API_URL_FRIENDS, {
            headers: { 
                'x-auth-token': token
            }
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
            headers: { 'x-auth-token': token }
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
            headers: { 'x-auth-token': token }
        });

        // Check if response data exists and is in expected format
        if (!response.data || !Array.isArray(response.data)) {
            throw new Error('Invalid data format received from server');
        }

        return response.data; // Return the list of messages
    } catch (error) {
        // Check for specific error response structure from backend (e.g., 401 Unauthorized)
        if (error.response) {
            console.error(`Error ${error.response.status}: ${error.response.data.message}`);
        } else {
            console.error('Error fetching messages:', error.message || error);
        }
        throw error; // Re-throw the error for handling in the component
    }
};

// Function to send a message
export const sendMessage = async (senderId, receiverId, content) => {
    const token = localStorage.getItem('token'); // Get the token from local storage
    if (!token) {
        throw new Error('No token found');
    }

    const messageData = {
        senderId,
        receiverId,
        content
    };

    try {
        const response = await axios.post(API_URL_MESSAGE, messageData, {
            headers: { 'x-auth-token': token }
        });
        return response.data; // Return the sent message
    } catch (error) {
        console.error('Error sending message:', error);
        throw error; // Re-throw the error for handling in the component
    }
};
