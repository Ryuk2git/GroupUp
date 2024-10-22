import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ActivityLog = sequelize.define('ActivityLog', {
    activityId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    details: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
}, {
    timestamps: false,
    tableName: 'activity_logs',
});

export default ActivityLog;
