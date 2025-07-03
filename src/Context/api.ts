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

export const createNotification = async (data: {
    receiverId: string;
    type: 'friend-request' | 'event-reminder' | 'message' | 'file-share'; 
    content: string;
    metadata?: any; 
    }) => {
    try {
        const response = await axios.post(`${API_URL}notifications/create`, data);
        return response.data;
    } catch (error) {
        console.error('Error creating notification:', error);
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
  
      const response = await axios.get(`${API_URL}search`, {
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

// Drive API's

export const fetchUserDriveData = async (userId: string): Promise<any> => {
    if(!userId){
        console.error("Missing USerId");
        return;
    }
    try {
        const response = await axios.get(`${API_URL}drive/content`, {
            params: {userId}
        });
        console.log(response.data.content);
        return response.data.content;
    } catch (error) {
        console.error("Error fetching user drive data:", error);
        return [];
    }
};

export const createFolder = async (userId: string, folderName: string): Promise<any> => {
    if(!userId || !folderName){
        console.error("Misisng User of Folder Name, error creating Folder");
        return;
    }
    try {
        const response = await axios.post(`${API_URL}drive/folder`, {userId, folderName});
        console.log("Folder Created Successfully.");
        return response.data;
    } catch (error: any) {
        console.error("Error Creating Folder: ", error);
        throw error;
    }
};

export const uploadFile = async (userId: string, file: File): Promise<any> => {
    if (!userId || !file) {
        console.error("UserId or file is missing, error uploading file");
        return;
    }
    try {
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("file", file);

        const response = await axios.post(`${API_URL}drive/file`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        console.log("File uploaded successfully:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Error uploading file:", error);
        throw error;
    }
};

export const uploadFolder = async (userId: string, folder: File[]): Promise<any> => {
    if (!userId || !folder || folder.length === 0) {
        console.error("❌ Missing userId or folder.");
        return;
    }

    try {
        const formData = new FormData();
        formData.append("userId", userId);

        const filePaths: string[] = [];

        folder.forEach((file) => {
            formData.append("files", file); // ✅ Match backend field name
            const relativePath = file.webkitRelativePath || file.name; // ✅ Get relative path
            filePaths.push(relativePath);
        });

        // Append file paths array
        filePaths.forEach((path) => formData.append("filePaths[]", path));

        const response = await axios.post(`${API_URL}drive/folder/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1));
                console.log(`📤 Upload progress: ${percentCompleted}%`);
            },
        });

        console.log("✅ Folder uploaded successfully:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ Error uploading folder:", error.response?.data || error.message);
        throw error;
    }
};

// MESSAGES
// Fetch messages
export const fetchMessages = async (chatId: string, userId: string, ) => {
    try {
        const response = await axios.get(`${API_URL}messages/${chatId}`, {
            params: { userId }, // Pass userId as a query parameter
        });
        return response.data; 
    } catch (error: any) {
        console.error("Error fetching messages:", error);
        throw error;
    }
};

// Send New Message
export const sendMessage = async (chatId: string, messageData: any) => {
    try {
        const response = await axios.post(`${API_URL}messages/${chatId}`, messageData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data; 
    } catch (error: any) {
        console.error("Error sending message:", error);
        throw error;
    }
};

export const getGroups = async () => {
    try {
        const userId = getUserId();
        const response = await axios.get(`${API_URL}messages/groups`, {
            params: { userId }
        });
        return response.data;
    } catch (error: any) {
        console.error("Error fetching groups:", error);
        return [];
    }
};

export const createGroup = async (groupData: { name: string; description: string; members: string[] }) => {
    try {
        const userId = getUserId();
        const response = await axios.post(
            `${API_URL}messages/groups/create`,
            { ...groupData, createdBy: userId } 
        );
        return response.data;
    } catch (error: any) {
        console.error("Error creating group:", error);
        throw error;
    }
};

// React to a message with an emoji
export const reactToMessage = async (messageId: string, userId: string, emoji: string) => {
    try {
        const response = await axios.patch(`${API_URL}messages/reaction/${messageId}`, { userId, emoji });
        return response.data;
    } catch (error: any) {
        console.error('Error reacting to message:', error);
        throw error.response?.data || error;
    }
};

// Star or unstar a message
export const starMessage = async (messageId: string, userId: string) => {
    try {
        const response = await axios.patch(`${API_URL}messages/${messageId}/star`, {
            userId,
        });
        return response.data;
    } catch (error: any) {
        console.error('Error starring message:', error);
        throw error.response?.data || error;
    }
};

// Forward a message
export const forwardMessage = async ( messageId: string, senderId: string, recipientId: string, isGroup: boolean ) => {
    try {
        const response = await axios.post(`${API_URL}messages/${messageId}/forward`, { senderId, recipientId, isGroup });
        return response.data;
    } catch (error: any) {
        console.error('Error forwarding message:', error);
        throw error.response?.data || error;
    }
};

// (Optional) Link a reply message to its original message
export const replyToMessage = async (originalMessageId: string, replyMessageId: string) => {
    try {
        const response = await axios.patch(`${API_URL}messages/${originalMessageId}/reply`, { replyMessageId });
        return response.data;
    } catch (error: any) {
        console.error('Error replying to message:', error);
        throw error.response?.data || error;
    }
};

// Delete a message for the current user only
export const deleteMessage = async (messageId: string, userId: string) => {
    try {
        const response = await axios.delete(`${API_URL}messages/delete/${messageId}`, {
            data: { userId }, // required in DELETE
        });
        return response.data;
    } catch (error: any) {
        console.error('Error deleting message:', error);
        throw error.response?.data || error;
    }
};

//EVENTS
export const getEvents = async (userId?: string) => {
    try {
        const response = await axios.get(`${API_URL}events`, {
            params: userId ? { userId } : {},
        });
        return response.data;
    } catch (error: any) {
        console.error("Error fetching Events: ", error);
        return [];
    }
};

export const createEvent = async(eventData: any) => {
    try {
        const response = await axios.post(`${API_URL}events`, eventData);
        return response.data;
      } catch (error) {
        console.error("Error creating event:", error);
        throw error;
      }
};

export const updateEvent = async (eventId: string, updatedData: any) => {
    try {
      const response = await axios.put(`${API_URL}events/${eventId}`, updatedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating event ${eventId}:`, error);
      throw error;
    }
  };

export const deleteEvents = async(eventId: string) => {
    try {
        const response = await axios.delete(`${API_URL}events/${eventId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting event ${eventId}:`, error);
        throw error;
      }
};

//TASKS

// TASKS API

export const getTasks = async (userId: string) => {
    try {
        const response = await axios.get(`${API_URL}tasks`, { params: { userId } });
        return response.data;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }
};

export const createTask = async (taskData: any) => {
    try {
        const userId = getUserId();
        const response = await axios.post(`${API_URL}tasks`, { ...taskData, userId });
        return response.data;
    } catch (error) {
        console.error("Error creating task:", error);
        throw error;
    }
};

export const updateTask = async (taskId: string, taskData: any) => {
    try {
        const response = await axios.put(`${API_URL}tasks/${taskId}`, taskData);
        return response.data;
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
};

export const deleteTask = async (taskId: string) => {
    try {
        const response = await axios.delete(`${API_URL}tasks/${taskId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting task:", error);
        throw error;
    }
};