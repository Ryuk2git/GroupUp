import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Folder = sequelize.define('Folder', {
    folderID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    folderName: { // Renamed from 'name' to 'folderName'
        type: DataTypes.STRING,
        allowNull: false,
    },
    parentID: { // Renamed from 'parentFolderId' to 'parentID'
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Folders',
            key: 'folderID', // Updated to reference the new primary key name
        },
    },
    projectID: { // Renamed from 'projectId' to 'projectID'
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Projects',
            key: 'projectId',
        },
    },
    storageName: { 
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, 
    },
    createdAt: { 
        type: DataTypes.DATE, 
        allowNull: false,
        defaultValue: DataTypes.NOW, 
    },
    updatedAt: { 
        type: DataTypes.DATE, 
        allowNull: false,
        defaultValue: DataTypes.NOW, 
    },
}, {
    tableName: 'folders', 
    timestamps: false, 
});

Folder.sync(); 

export default Folder;
