import { Router } from 'express';
import { registerUser, loginUser, logoutUser, verifyUser } from '../controllers/authController';
import { checkValidationErrors, validateLogin, validateRegister, loginRateLimiter  } from '../middleware/loginSecurity';
import passport from 'passport';

const router = Router();

router.post('/register', checkValidationErrors, validateRegister, registerUser);

// Login route
router.post('/login',checkValidationErrors, validateLogin, loginRateLimiter, loginUser);

// Logout route
router.post('/logout', logoutUser);

// Verify User
router.get('/verify', verifyUser);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/main');
});

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/main');
});

export default router;