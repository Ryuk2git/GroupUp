import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/users';
import jwt from 'jsonwebtoken';
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const JWT_SECRET = '9552535317';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initializeUserStorage = (userID: string): void => {
  if (!userID) {
    console.error("User ID is required to create storage.");
    return;
  }

  const userStoragePath = path.join(__dirname, "../../storage", userID);
  const projectPath = path.join(userStoragePath, "projects");
  const drivePath = path.join(userStoragePath, "drive");

  [userStoragePath, projectPath, drivePath].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};


export const verifyUser = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if(!token){
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try{
    const decoded = jwt.verify(token, JWT_SECRET) as { emailID: string };
    const user = await User.findByPk(decoded.emailID, {
      attributes: { exclude: ['password'] }
    });
    
    if(!user){
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    res.json({
      message: 'User verified',
      user: {
        userID: user.getDataValue('userID'),
        name: user.getDataValue('name'),
        userName: user.getDataValue('userName'),
        emailID: user.getDataValue('emailID'),
      }
    })
    return;
  }catch(error: any){
    console.error("Failed to verify user: ", error);
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

};

export const registerUser = async (req: Request, res: Response) => {
  const { name, userName, emailID, password, dateOfBirth, city, state, country } = req.body;

  try {
    if (await User.findOne({ where: { emailID } })) {
      res.status(409).json({ message: 'User already exists' });
      return;
    }

    const userId = uuidv4();

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      userID: userId,
      name,
      userName,
      emailID,
      password: hashedPassword,
      role: 'user', // Default role
      dateOfBirth: dateOfBirth || null,
      city: city || null,
      state: state || null,
      country: country || null,
    });

    initializeUserStorage(userId);

    const token = jwt.sign(
      { userID: newUser.userID, emailID: newUser.emailID },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600000, // 1hr
    });

    res.status(201).json({
      message: 'Registration successful',
      user: {
        userID: newUser.getDataValue('userID'),
        name: newUser.getDataValue('name'),
        userName: newUser.getDataValue('userName'),
        emailID: newUser.getDataValue('emailID'),
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { emailID, password } = req.body;

  try {
    const user = await User.findOne({ where: { emailID } });

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.getDataValue('password'));

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign(
      { userID: user.userID, emailID: user.emailID },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600000, // 1hr
    });

    res.json({
      message: 'Login successful',
      user: {
        userID: user.getDataValue('userID'),
        name: user.getDataValue('name'),
        userName: user.getDataValue('userName'),
        emailID: user.getDataValue('emailID'),
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Change to 'None' if using HTTPS and cross-origin
    path: "/",
  });
  res.status(200).json({ message: 'Logout successful' });
};