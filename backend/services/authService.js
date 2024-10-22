import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Assuming this is your User model
import { v4 as uuidv4 } from 'uuid'; // For generating unique user codes

const privateKey = "mySuperSecretKey123!@";

// Service to handle authentication logic
const authService = {
    // Function to hash a password using bcrypt
    hashPassword: async (password) => {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    },

    // Function to compare plain password with hashed password
    comparePasswords: async (plainPassword, hashedPassword) => {
        return bcrypt.compare(plainPassword, hashedPassword);
    },

    // Function to generate a JWT token for a user
    generateToken: (user) => {
        const payload = {
            user: {
                userID: user.userID, // Changed to userID
                role: user.role,
            }
        };
        return jwt.sign(payload, privateKey, { expiresIn: '1h' });
    },

    // Function to validate JWT token
    validateToken: (token) => {
        try {
            return jwt.verify(token, privateKey);
        } catch (error) {
            return null; // Return null if the token is invalid or expired
        }
    },

    // Function to register a new user
    registerUser: async ({ username, name, emailID, password, dateOfBirth, city, state, country, role = 'user' }) => { // Changed email to emailID
        // Generate a unique userID
        const userID = uuidv4(); // Generate a unique userID
        console.log('Generated userID:', userID); // Log the generated userID

        // Check if the user already exists
        let existingUser = await User.findOne({ where: { emailID } });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            throw new Error('Username is already taken');
        }

        // Hash the password
        const hashedPassword = await authService.hashPassword(password);

        // Create new user
        const newUser = await User.create({
            userID, // Use generated userID
            username,
            name,
            emailID, // Changed to emailID
            password: hashedPassword,
            dateOfBirth,
            city,
            state,
            country,
            role,
        });

        // Generate a JWT token
        const token = authService.generateToken(newUser);

        return { user: newUser, token };
    },

    // Function to login a user
    loginUser: async ({ emailID, password }) => { // Changed email to emailID
        // Check if the user exists
        let user = await User.findOne({ where: { emailID } }); // Changed to emailID
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Compare passwords
        const isMatch = await authService.comparePasswords(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        // Generate a JWT token
        const token = authService.generateToken(user);

        return { user, token };
    },

    // Middleware to authenticate a request using JWT
    authenticateRequest: (req, res, next) => {
        const token = req.header('x-auth-token'); // Assuming the token is in the 'x-auth-token' header
        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        try {
            const decoded = authService.validateToken(token);
            if (!decoded) {
                return res.status(401).json({ msg: 'Invalid token' });
            }
            req.user = decoded.user;
            next();
        } catch (err) {
            res.status(401).json({ msg: 'Token is not valid' });
        }
    },
};

export default authService;
