// routes/authRoutes.js
import { Router } from 'express';
import { check } from 'express-validator';
import { registerUser, loginUser } from '../controller/authController.js';

const router = Router();

// Combined registration and login routes

// Register route
router.post('/register', [
    check('name', 'Name is required').not().isEmpty(),
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
], registerUser);

// Login route
router.post('/login', [
    check('emailID', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], loginUser);

export default router;
