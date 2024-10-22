import chatService from '../services/chatService.js';

// Send a friend request
export const sendFriendRequest = async (req, res) => {
    const { friendId } = req.body; // ID of the friend to request
    const userId = req.user.id; // Assuming you have user ID from the token
    try {
        const request = await chatService.createFriendRequest(userId, friendId);
        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ error: 'Error sending friend request' });
    }
};

// Accept a friend request
export const acceptFriendRequest = async (req, res) => {
    const { requestId } = req.body; // ID of the friend request
    try {
        const friendship = await chatService.acceptFriendRequest(requestId);
        res.json(friendship);
    } catch (error) {
        res.status(500).json({ error: 'Error accepting friend request' });
    }
};

// Get all friends
export const getFriends = async (req, res) => {
    const userId = req.user.id; // Assuming you have user ID from the token
    try {
        const friends = await chatService.fetchFriends(userId);
        res.json({ friends });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching friends' });
    }
};

// Send a new message (one-to-one or group)
export const sendMessage = async (req, res) => {
    const { chatId } = req.params; // Chat ID can be user ID or group ID
    const messageData = req.body;
    try {
        const newMessage = await chatService.createMessage(chatId, messageData);
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: 'Error sending message' });
    }
};

// Get messages for a specific chat (one-to-one or group)
export const getMessages = async (req, res) => {
    const { chatId } = req.params;
    try {
        const messages = await chatService.fetchMessages(chatId);
        res.json({ messages });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching messages' });
    }
};

// Create a new group
export const createGroup = async (req, res) => {
    const groupData = req.body;
    try {
        const newGroup = await chatService.createGroup(groupData);
        res.status(201).json(newGroup);
    } catch (error) {
        res.status(500).json({ error: 'Error creating group' });
    }
};

// Get all groups for a user
export const getGroups = async (req, res) => {
    const userId = req.user.id; // Assuming you have user ID from the token
    try {
        const groups = await chatService.fetchGroups(userId);
        res.json({ groups });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching groups' });
    }
};
