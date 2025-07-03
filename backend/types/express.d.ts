declare namespace Express {
    interface User {
      userID: string;
      name: string;
      emailID: string;
      googleId?: string;
      githubId?: string;
      role: string;
    }
  }
  