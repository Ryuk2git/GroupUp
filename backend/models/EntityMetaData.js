import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// This model will serve both comment and tag functionality
const EntityMetadata = sequelize.define('EntityMetadata', {
    metadataId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    type: {
        type: DataTypes.ENUM('comment', 'tag'),
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true, // Content for comments or tags
    },
    entityId: {
        type: DataTypes.UUID,
        allowNull: false, // ID of the file or folder
    },
    entityType: {
        type: DataTypes.ENUM('file', 'folder'),
        allowNull: false, // Type of the entity (file or folder)
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
}, {
    timestamps: true,
    tableName: 'entity_metadata',
});

// Example of creating a comment
// await EntityMetadata.create({
//     type: 'comment',
//     content: 'This is a comment',
//     entityId: 'file-or-folder-id',
//     entityType: 'file', // or 'folder'
//     userId: 1,
// });

// Example of creating a tag
// await EntityMetadata.create({
//     type: 'tag',
//     content: 'Important',
//     entityId: 'file-or-folder-id',
//     entityType: 'file', // or 'folder'
//     userId: 1,
// });

export default EntityMetadata;
