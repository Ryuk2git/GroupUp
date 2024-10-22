import Friend from '../models/Friends.js'; 
import Message from '../models/Message.js';
import Group from '../models/Groups.js'; 
import User from '../models/User.js'; 

// Send a friend request
const createFriendRequest = async (userId, friendId) => {
    // Check if the friend relationship already exists
    const existingFriendship = await Friend.findOne({
        where: {
            userId,
            friendId,
        },
    });

    if (existingFriendship) {
        if (existingFriendship.status === 'pending') {
            throw new Error('Friend request already sent');
        } else if (existingFriendship.status === 'accepted') {
            throw new Error('You are already friends');
        }
    }

    // Create a new friend request (pending status)
    return await Friend.create({
        userId,
        friendId,
        status: 'pending',
    });
};

// Accept a friend request
const acceptFriendRequest = async (userId, friendId) => {
    const request = await Friend.findOne({
        where: {
            userId: friendId,
            friendId: userId,
            status: 'pending',
        },
    });

    if (request) {
        // Update the status of the friend relationship to 'accepted'
        request.status = 'accepted';
        await request.save();
        return request;
    }
    throw new Error('Friend request not found or already accepted');
};

// Fetch friends of a user
const fetchFriends = async (userId) => {
    return await User.findAll({
        include: [{
            model: User,
            as: 'friends', // Alias for the User model that references friends
            through: {
                model: Friend,
                where: { status: 'accepted' }, // Only fetch accepted friendships
                attributes: [], // Exclude attributes from the join table
            },
        }],
        where: { id: userId },
    });
};

// Fetch messages for a chat
const fetchMessages = async (chatId) => {
    return await Message.findAll({
        where: { chatId },
        order: [['createdAt', 'ASC']],
    });
};

// Create a new message
const createMessage = async (chatId, messageData) => {
    return await Message.create({
        ...messageData,
        chatId,
    });
};

// Create a new group
const createGroup = async (groupData) => {
    return await Group.create(groupData);
};

// Fetch all groups for a user
const fetchGroups = async (userId) => {
    return await Group.findAll({
        where: { userId },
        include: [{ model: User, as: 'members' }], // Adjust as per your associations
    });
};

// Combine all functions into a single chatService object
const chatService = {
    createFriendRequest,
    acceptFriendRequest,
    fetchFriends,
    fetchMessages,
    createMessage,
    createGroup,
    fetchGroups,
};

// Export the chatService object as the default export
export default chatService;
