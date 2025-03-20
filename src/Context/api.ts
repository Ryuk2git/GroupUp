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
    const storedUserId = sessionStorage.getItem('user');
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

export const addFriend = async(friendId: string, currentUserId: string) =>{
    try{
        const response = await axios.post(
            `${API_URL}friends/request`, 
            {friendId, currentUserId}
        );
        return response.data;
    }catch(error: any){
        console.error("Error sending friend request:", error);
        throw error;
    }
};

export const acceptFriendRequest = async (friendRequestId: string, currentUserId: string, notificationId:string) => {
    try {
      const response = await axios.put(`${API_URL}friends/accept`, {
        friendRequestId,
        currentUserId,
        notificationId,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error accepting friend request:", error);
      throw error;
    }
  };

export const fetchNotifications = async(userId: string) => {
    try{
        const response = await axios.get(`${API_URL}notifications/${userId}`)
        return response.data;
    }catch(error: any){
        console.error("Error fetching Notificaitons", error);
        return [];
    }
};

export const markNotificationAsRead = async(userId: string, notificationId: string) =>{
    try{
        await axios.put(`${API_URL}notifications/${userId}/mark-read`, { notificationId });
    }catch (error) {
        console.error("Error marking notification as read:", error);
    }
};

export const deleteNotification = async(userId: string, notificationId: string) =>{
    try{
        await axios.delete(`${API_URL}notifications/${userId}/${notificationId}`);
    }catch(error) {
        console.error("Error deleting notification:", error);
    }
};
export const deleteAllNotifications = async(userId: string) =>{
    try{
        await axios.delete(`${API_URL}notifications/${userId}`);
        
    }catch (error) {
        console.error("Error deleting all notifications:", error);
    }
};

export const fetchSearchResults = async (query: string, category: string): Promise<any[]> => {
    try{
      if(!query.trim()) {
        return []; // Return an empty array if the query is empty
      }
  
      const response = await axios.get(`/api/search`, {
        params: {
          q: query,
          type: category === "All" ? undefined : category.toLowerCase(),
        },
      });
  
      // Ensure the response is an array
      return Array.isArray(response.data) ? response.data : [];
    }catch(error: any) {
      console.error("Error fetching search results:", error);
      return []; // Return an empty array in case of an error
    }
};