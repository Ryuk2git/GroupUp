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

const getUserId = () =>{
    const storedUserId = localStorage.getItem('user');
    return storedUserId? JSON.parse(storedUserId).userID:null;
};

export const loginUser = async ({ emailID, password }: AuthPayload) => {
    try {
        const response = await axios.post(
            `${API_URL}auth/login`, 
            { emailID: emailID, password },
            { withCredentials: true }
        );
        console.log("Login response:", response.data);

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

export const getFriends = async() =>{
    const userId = getUserId();
    if(!userId) throw new Error("No user detais Found!");

    try{
        const response = await axios.get(
            `${API_URL}friends`,
            {params: {userId}},
        )
        return response.data;
    }catch(error: any){
        console.error("Error Fetching Friends", error);
        return[];
    }
};

export const getVoiceChannels = async() =>{
    const userId = getUserId();
    if(!userId) throw new Error("No user detais Found!");

    try{
        const reponse = await axios.get(`
            ${API_URL}voice-channels`,
            {params: {userId}},
        )
        return reponse.data;
    }catch(error: any){
        console.error("Error Fetching Voice Channels", error);
        return [];
    }
};

export const addFriend = async() =>{};