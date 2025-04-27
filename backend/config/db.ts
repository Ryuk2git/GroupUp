import { Sequelize } from "sequelize";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import mysql from "mysql2/promise";

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

// Ensure schema exists (run database.sql if needed)
const ensureMySQLSchema = async () => {
  const DB_HOST ='localhost';
  const DB_USER = 'root';
  const DB_PASSWORD = 'Rishi';
  const DB_NAME = 'groupproxy';

  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true,
  });

  // Check if the database exists
  const [databases] = await connection.query("SHOW DATABASES LIKE ?", [DB_NAME]);
  if ((databases as any[]).length === 0) {
    // Run the schema file to create the database and tables
    const schemaPath = path.join(__dirname, '../database.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schema);
    console.log('✅ Database schema created from database.sql');
  } else {
    // Use the database and check for a core table (e.g., users)
    await connection.query(`USE \`${DB_NAME}\``);
    const [tables] = await connection.query("SHOW TABLES LIKE 'users'");
    if ((tables as any[]).length === 0) {
      const schemaPath = path.join(__dirname, '../database.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(schema);
      console.log('✅ Tables created from database.sql');
    } else {
      console.log('✅ Database and tables already exist');
    }
  }
  await connection.end();
};

// Initialize all databases
const initDB = async (): Promise<void> => {
  await connectMySQL();
  await connectMongoDB();
};

export { sequelize, connectMongoDB, connectMySQL, ensureMySQLSchema, initDB };
