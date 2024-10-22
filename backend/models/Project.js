import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Project = sequelize.define('Project', {
    projectId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'projectId', // Map to the SQL column name
    },
    projectName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'projectName', // Map to the SQL column name
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'description', // Map to the SQL column name
    },
    isSolo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'isSolo', // Map to the SQL column name
    },
    membersList: {
        type: DataTypes.JSON, // Use JSON type for MySQL
        allowNull: true,
        field: 'membersList', // Map to the SQL column name
    },
    permissionsList: {
        type: DataTypes.JSON, // Use JSON type for MySQL
        allowNull: true,
        field: 'permissionsList', // Map to the SQL column name
    },
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Reference to the Users model
            key: 'id',
        },
        field: 'ownerId', // Map to the SQL column name
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
    tableName: 'projects', // Table name in MySQL
    createdAt: 'createdAt', // Custom field name for createdAt
    updatedAt: 'updatedAt', // Custom field name for updatedAt
});

// Optional: Define associations if necessary
// Project.belongsTo(User, { foreignKey: 'ownerId' });

export default Project;
