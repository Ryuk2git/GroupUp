import axios from 'axios';

// Set up base URL for the API
const API_URL = 'mongodb://localhost:3000/'; // Replace with your actual backend URL

// Function to handle user login
export const loginUser = async ({ email, password }) => {
    try {
        const response = await axios.post(`${API_URL}/auth/signin`, { email, password });
        return response.data; // Assuming the response contains { token, user }
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : 'Error logging in');
    }
};

// Function to handle user registration
export const registerUser = async ({ name, email, password }) => {
    try {
        const response = await axios.post(`${API_URL}/auth/signup`, { name, email, password });
        return response.data; // Assuming the response contains { token, user }
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : 'Error signing up');
    }
};
