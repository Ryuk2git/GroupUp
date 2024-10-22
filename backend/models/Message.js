import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Message = sequelize.define('Message', {
    messageId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Ensure this matches your User model's table name
            key: 'id',
        },
    },
    receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
    messageContent: {
        type: DataTypes.TEXT, // Storing message in encrypted format (JSON string)
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('sent', 'delivered', 'read'),
        defaultValue: 'sent',
    },
}, {
    timestamps: true, // Enables createdAt and updatedAt
    tableName: 'messages',
});

// Optionally, you can rename 'createdAt' to 'sentAt' using Sequelize's getter methods
Message.prototype.getSentAt = function() {
    return this.createdAt;
};

export default Message;
