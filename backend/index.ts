import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/authRoutes';
import friendsRoutes from './routes/friendsRoutes'
import voiceChannelRoutes from './routes/voiceChannelRoutes';
import notificationRoutes from './routes/notificationRoutes';
import searchRoutes from './routes/serachRoutes'
import driveRoutes from './routes/driveRoutes';
import messageRoutes from './routes/messagesRoutes'

import { initDB } from './config/db';
import { apiLogger } from './middleware/apiLogger';
import session from 'express-session';

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173', // Frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allows cookies or credentials if needed
}));

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", 
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
    path: "/socket.io", // Ensure the path matches the client configuration
});

// Socket.IO connection
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Join a chat room
    socket.on("joinChat", (chatId) => {
        socket.join(chatId);
        console.log(`User joined chat: ${chatId}`);
    });

    // Handle sending messages
    socket.on("sendMessage", (messageData) => {
        const { chatId } = messageData;
        io.to(chatId).emit("receiveMessage", messageData); // Broadcast to all users in the chat room
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

app.use(cookieParser());
app.use(session({
    secret: '9552535317',
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Log Requests and Response~~
app.use(apiLogger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/voice-channels', voiceChannelRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/drive', driveRoutes);
app.use('/api/messages', messageRoutes);

// Initialize databases and start the server
initDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to initialize databases:', error);
});