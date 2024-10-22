// models/User.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; 

const User = sequelize.define('User', {
    // Unique code for the user
    userID: {
        type: DataTypes.STRING,
        primaryKey: true,   
        allowNull: false,
        unique: true,
    },
    // Username for the user
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    // Full name of the user
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // Email of the user
    emailID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    // Password hash for user authentication
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // Profile picture route or URL
    pfpRoute: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    // Role of the user (e.g., admin, user)
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user', // Default role
    },
    // Date of birth of the user
    dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    // City where the user resides
    city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    // State where the user resides
    state: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    // Country where the user resides
    country: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    // Timestamp when the account was created
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    // Timestamp when the account was last updated
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: true,
    tableName: 'users', 
});

export default User;
