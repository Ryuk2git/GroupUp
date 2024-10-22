import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const GroupMember = sequelize.define('GroupMember', {
    role: {
        type: DataTypes.ENUM('admin', 'member'),
        defaultValue: 'member',
    },
    joinedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
    tableName: 'group_members',
});

export default GroupMember;