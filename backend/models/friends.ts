import { DataTypes, Model } from "sequelize";
import { sequelize } from '../config/db'
import User from './users'

class Friend extends Model {
  public chatId!: string;
  public userId!: string;
  public friendId!: string;
  public status!: "pending" | "accepted" | "declined" | "blocked";
  public createdAt!: Date;
  public pfp_Path!: string;
}

Friend.init(
  {
    chatId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    friendId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "declined", "blocked"),
      allowNull: false,
      defaultValue: "pending",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    pfp_Path: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "friends",
    timestamps: false,
    
  }
);

Friend.belongsTo(User, { foreignKey: "friendId", as: "friend" });

export default Friend;
