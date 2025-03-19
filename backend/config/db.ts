import { Sequelize } from "sequelize";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// MySQL (Sequelize) Configuration
const sequelize = new Sequelize('groupproxy', 'root', 'Rishi',
  {
    host: "localhost",
    dialect: "mysql",
    // logging: false, // Set to console.log for debugging
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// MongoDB (Mongoose) Configuration
const connectMongoDB = async (): Promise<void> => {   
  try {
    await mongoose.connect('mongodb://localhost:27017/GroupUp');
    console.log("MongoDB connected successfully to: ", mongoose.connection.name);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Test MySQL Connection
const connectMySQL = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected successfully!");
  } catch (error) {
    console.error("MySQL connection error:", error);
    process.exit(1);
  }
};

// Initialize all databases
const initDB = async (): Promise<void> => {
  await connectMySQL();
  await connectMongoDB();
};

export { sequelize, connectMongoDB, initDB };
