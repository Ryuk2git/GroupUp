import passport from 'passport';
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from 'passport-github';
import { VerifyCallback } from 'passport-oauth2';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/users';

// Define User Type (Adjust as per your Sequelize Model)
interface UserType {
  userID: string;
  name: string;
  emailID: string;
  googleId?: string;
  githubId?: string;
  role: string;
}

// Serialize and Deserialize User
passport.serializeUser((user: Express.User, done: (arg0: null, arg1: Express.User) => void) => {
    done(null, user);
  });
  
  passport.deserializeUser((user: Express.User, done: (arg0: null, arg1: Express.User) => void) => {
    done(null, user);
  });

// Ensure Required Environment Variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing Google OAuth Credentials');
}
if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
  throw new Error('Missing GitHub OAuth Credentials');
}

// Google OAuth Strategy
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
  },
  async (accessToken: string, refreshToken: string, profile: GoogleProfile, done: VerifyCallback) => {
    try {
      let user = await User.findOne({ where: { googleId: profile.id } });

      if (!user) {
            user = await User.create({
            userID: uuidv4(), 
            name: profile.displayName,
            emailID: profile.emails?.[0]?.value || '', // Ensure a valid email
            googleId: profile.id,
            role: 'user',
            userName: profile.displayName, // Generate a username if not provided
            password: '', // No password for OAuth users
            dateOfBirth: new Date("2000-01-01"), // Can be updated later in profile settings
            city: '',
            state: '',
            country: '',
        });
      }

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/api/auth/github/callback',
  },
  async (accessToken: string, refreshToken: string, profile: GitHubProfile, done: VerifyCallback) => {
    try {
      let user = await User.findOne({ where: { githubId: profile.id } });

      if (!user) {
            user = await User.create({
            userID: profile.id, // Consider using `uuidv4()`
            name: profile.displayName || profile.username || 'Unknown User',
            emailID: profile.emails?.[0]?.value || '', // GitHub might not provide an email
            githubId: profile.id,
            role: 'user',
            userName: profile.displayName, // Generate a username if not provided
            password: '', // No password for OAuth users
            dateOfBirth: new Date("2000-01-01"), // Can be updated later in profile settings
            city: '',
            state: '',
            country: '',
        });
      }

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
));

export default passport;
