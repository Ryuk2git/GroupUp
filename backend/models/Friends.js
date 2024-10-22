// models/Friend.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; 

const Friends = sequelize.define('Friend', {
    // User ID of the first user
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    // User ID of the second user
    friendId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {   
            model: 'users',
            key: 'id',
        },
    },
    // ID of a message associated with this friendship
    messageId: {
        type: DataTypes.INTEGER,
        allowNull: true, // This can be null if no message is linked
        references: {
            model: 'messages',
            key: 'id',
        },
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
    },
    // Timestamp when the friendship was created
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: true,
    tableName: 'friends',
});

export default Friends;
