import jwt from 'jsonwebtoken';

// Secret key for signing and verifying JWTs (should be stored securely, like in environment variables)
const secretKey = process.env.JWT_SECRET || 'mySuperSecretKey123!@';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  // Extract token from x-auth-token header
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, secretKey);

    // Attach user data to the request object
    req.user = decoded; // This assumes your token payload contains user information

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
};

export default verifyToken;
