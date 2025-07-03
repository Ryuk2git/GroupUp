import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";
import User from "./users"; // Import the User model

// VoiceChannel Model
interface VoiceChannelAttributes {
  channelId: string;
  channelName: string;
  createdAt?: Date;
}

interface VoiceChannelCreationAttributes extends Optional<VoiceChannelAttributes, "channelId"> {}

class VoiceChannel extends Model<VoiceChannelAttributes, VoiceChannelCreationAttributes> implements VoiceChannelAttributes {
  public channelId!: string;
  public channelName!: string;
  public readonly createdAt!: Date;
}

VoiceChannel.init(
  {
    channelId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    channelName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "voice_channels",
    timestamps: false,
  }
);

// VoiceChannelMember Model (Many-to-Many Relationship)
interface VoiceChannelMemberAttributes {
  channelId: string;
  userId: string;
}

class VoiceChannelMember extends Model<VoiceChannelMemberAttributes> implements VoiceChannelMemberAttributes {
  public channelId!: string;
  public userId!: string;
}

VoiceChannelMember.init(
  {
    channelId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: VoiceChannel,
        key: "channelId",
      },
      onDelete: "CASCADE",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "userID",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "voice_channel_members",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["channelId", "userId"],
      },
    ],
  }
);

// Define Associations
VoiceChannel.belongsToMany(User, { through: VoiceChannelMember, foreignKey: "channelId" });
User.belongsToMany(VoiceChannel, { through: VoiceChannelMember, foreignKey: "userId" });

export { VoiceChannel, VoiceChannelMember };
