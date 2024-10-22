// models/UserMetadata.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; 

const UserMetadata = sequelize.define('UserMetadata', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User', // Ensure this matches your User model's table name
            key: 'id',
        },
        unique: true,
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    socialLinks: {
        type: DataTypes.JSONB, // Store social links in a JSON format
        allowNull: true,
    },
    preferences: {
        type: DataTypes.JSONB, // Store user preferences in JSON format
        allowNull: true,
    },
    settings: {
        type: DataTypes.JSONB, // Store user settings in JSON format
        allowNull: true,
    },
    lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    notificationsEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    timestamps: true,
    tableName: 'user_metadata',
});

export default UserMetadata;
