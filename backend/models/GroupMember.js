import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const GroupMember = sequelize.define('GroupMember', {
    groupId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'Group',
            key: 'groupId',
        },
    },
    userId: {
        type: DataTypes.STRING, // Use VARCHAR instead of INTEGER
        allowNull: false,
        references: {
            model: 'Users',
            key: 'userID',
        },
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'member', // Default role is 'member'
    },
    joinedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: true,
    tableName: 'group_members',
});

export default GroupMember;
