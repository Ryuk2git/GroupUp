import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth'; // Adjust this to your backend URL

export const loginUser = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data; // Ensure it returns the token
};

export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data; // Ensure it returns the token
};
