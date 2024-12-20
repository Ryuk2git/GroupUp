import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js'; // Your auth routes
import userRoutes from './routes/userRoute.js'; // Import user routes
import fileRoutes from './routes/fileRoute.js'; // Your file routes
import conversationRoutes from './routes/conversationRoute.js'; // Import conversation routes
import messageRoutes from './routes/messageRoute.js'; // Import message routes
import memberRoute from './routes/memberRoute.js';
import friendsRoute from './routes/friendsRoute.js';
import projectRoute from './routes/projectRoute.js';

import { Sequelize } from 'sequelize';
import bodyParser from 'body-parser';
import morgan from 'morgan'; // For logging HTTP requests
import http from 'http';
import { Server } from 'socket.io';
import Message from './models/Message.js';

// Load environment variables (if needed, otherwise can be removed)
dotenv.config();

const app = express();

const server = http.createServer(app);
const io = new Server(server,
    {
        cors: {
            origin: 'http://localhost:5173', // Your frontend origin
            methods: ['GET', 'POST'],
        },
    }
);

// Middleware
app.use(express.json()); // Body parser to parse JSON requests

// Morgan middleware for logging requests
app.use(morgan('dev'));

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173', // Frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allows cookies or credentials if needed
}));

// Connect to the database with hard-coded credentials
const sequelize = new Sequelize('groupproxy', 'root', 'Rishi', {
    host: 'localhost',
    dialect: 'mysql', // or 'postgres', 'sqlite', 'mariadb', etc.
});

// Sequelize authentication with logging
sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch((err) => console.error('Error connecting to the database:', err));

// Sequelize sync (optional) with logging
sequelize.sync({ alter: true }) // alter will sync the model changes to the DB
    .then(() => console.log('Database synced...'))
    .catch((err) => console.error('Error syncing database:', err));

// Logging all Sequelize queries
sequelize.addHook('beforeFind', (options) => {
    console.log('Database query initiated:', options);
});
sequelize.addHook('afterFind', (result) => {
    console.log('Database query result:', result);
});

// Log all incoming requests with additional info
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.url}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes); // Your authentication routes
app.use('/api/files', fileRoutes); // Your file management routes
app.use('/api/user', userRoutes); // Add user routes
app.use('/api/conversations', conversationRoutes); // Add conversations route
app.use('/api/messages', messageRoutes); // Add messages route
app.use('/api/members', memberRoute);
app.use('/api/friends', friendsRoute); // Add friends route
app.use('/api/projects', projectRoute);

// Simple base route
app.get('/', (req, res) => {
    console.log('Root route was hit');
    res.send('API is running...');
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(`Error occurred at ${req.url}:`, err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});
 

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen for joining a conversation
    socket.on('joinConversation', (conversationId) => {
        socket.join(conversationId);
        console.log(`User joined conversation: ${conversationId}`);
    });

    // Listen for new messages
    socket.on('sendMessage', async (data) => {
        const { conversationId, senderId, messageContent } = data;

        try {
            // Save the message to the database
            const newMessage = await Message.create({
                conversationId,
                senderId,
                messageContent,
            });

            // Emit the message to all users in the conversation
            io.to(conversationId).emit('receiveMessage', newMessage);
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});


// Start server
const PORT = process.env.PORT || 3000; // Use environment variable or hard-coded port
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
