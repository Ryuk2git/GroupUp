import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const File = sequelize.define('File', {
    fileId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'fileId', // Map to the SQL column name
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'name', // Map to the SQL column name
    },
    type: {
        type: DataTypes.ENUM('file', 'folder'), // 'folder' type for folders
        allowNull: false,
        field: 'type', // Map to the SQL column name
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'content', // Map to the SQL column name
    },
    parentFolderId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Folders', // Reference to the Folders model
            key: 'folderId',
        },
        field: 'parentFolderId', // Map to the SQL column name
    },
    // Name to be displayed to users
    displayName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // Storage name based on userId and project name
    storageName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure storage name is unique
    },
    projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Projects', // Reference to the Projects model
            key: 'projectId',
        },
        field: 'projectId', // Map to the SQL column name
    },

}, {
    timestamps: true, // Adds createdAt and updatedAt fields
    tableName: 'files', // Table name in MySQL
    createdAt: 'createdAt', // Custom field name for createdAt
    updatedAt: 'updatedAt', // Custom field name for updatedAt
});

// Optional: Define associations if necessary
// File.belongsTo(Folder, { as: 'ParentFolder', foreignKey: 'parentFolderId' });
// File.belongsTo(Project, { foreignKey: 'projectId' });

export default File;
