import axios from 'axios';

const API_URL = 'http://localhost:3000/api/'; // Adjust according to your backend's port and endpoint

interface AuthPayload {
    emailID: string;
    password: string;
    name?: string;
    userName?: string;
    dateOfBirth?: string;
    city?: string;
    state?: string;
    country?: string;
}

export const loginUser = async ({ emailID, password }: AuthPayload) => {
    try {
        const response = await axios.post(
            `${API_URL}auth/login`, 
            { emailID: emailID, password },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "An error occurred during login");
        } else {
            throw new Error("An unknown error occurred during login");
        }
    }
};

export const registerUser = async ({ name, userName, emailID, password }: AuthPayload) => {
    try {
        const response = await axios.post(
            `${API_URL}auth/register`, 
            { name, userName, emailID, password },
            { withCredentials: true }
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "An error occurred during registration");
        } else {
            throw new Error("An unknown error occurred during registration");
        }
    }
};