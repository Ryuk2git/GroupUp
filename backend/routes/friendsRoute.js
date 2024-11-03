import express from 'express';
import { fetchFriends } from '../controller/friendsController.js';
import authService from '../services/authService.js';

const router = express.Router();

// Define the route to fetch friends
router.get('/', fetchFriends);

export default router;
