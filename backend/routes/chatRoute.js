import express from 'express';
import {
    sendFriendRequest,
    acceptFriendRequest,
    getFriends,
    sendMessage,
    getMessages,
    createGroup,
    getGroups,
} from '../controller/chatController.js';

const router = express.Router();

// Route to send a friend request
router.post('/friends/request', sendFriendRequest);

// Route to accept a friend request
router.post('/friends/accept', acceptFriendRequest);

// Route to get all friends
router.get('/friends', getFriends);

// Route to send a new message (one-to-one or group)
router.post('/chat/:chatId/messages', sendMessage);

// Route to get messages for a specific chat
router.get('/chat/:chatId/messages', getMessages);

// Route to create a new group
router.post('/groups', createGroup);

// Route to get all groups for a user
router.get('/groups', getGroups);

export default router;
