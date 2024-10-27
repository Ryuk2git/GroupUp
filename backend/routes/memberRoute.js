// memberRoutes.js
import express from 'express';
import { fetchMembers } from '../controller/memberController.js';

const router = express.Router();

// Define the route to fetch members
router.get('/', fetchMembers);

export default router;
