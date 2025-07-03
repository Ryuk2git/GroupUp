import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

// Define the attributes for the User model
interface UserAttributes {
  userID: string;
  name: string;
  emailID: string;
  userName: string;
  password: string;
  pfpRoute?: string;
  createdAt?: Date;
  updatedAt?: Date;
  role: string;
  dateOfBirth: Date;
  city: string;
  state: string;
  country: string;
  googleId?: string;
  githubId?: string;
}

// Define the creation attributes for the User model
interface UserCreationAttributes extends Optional<UserAttributes, 'userID' | 'createdAt' | 'updatedAt' | 'pfpRoute'> {}

// Define the User model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public userID!: string;
  public name!: string;
  public emailID!: string;
  public userName!: string;
  public password!: string;
  public pfpRoute?: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public role!: string;
  public dateOfBirth!: Date;
  public city!: string;
  public state!: string;
  public country!: string;
  public googleId?: string;
  public githubId?: string;
}
User.init(
  {
    userID: {
      type: DataTypes.STRING,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pfpRoute: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user', // user, project leader, project manager, orgamisation admin, admin, superadmin
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    googleId: {
      type: DataTypes.STRING,  
      allowNull: true,
      unique: true,
    },
    githubId: {
      type: DataTypes.STRING,  
      allowNull: true,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
);

export default User;