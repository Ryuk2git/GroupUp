import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Conversations = sequelize.define('Conversations', {
    conversationId: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    members: {
        type: DataTypes.JSON,  // Storing an array of user IDs
        allowNull: false,
    },
    lastMessageId: {
        type: DataTypes.STRING,
        allowNull: true,  // Nullable for new conversations
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
    },
}, {
    timestamps: false,  // We manage createdAt and updatedAt manually
    tableName: 'conversations',
});

export default Conversations;
