import { body } from "express-validator";
import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validateRegister = [
    body('name').trim().isLength({ min: 3, }).escape().withMessage('Name must be at least 3 characters long'),
    body('userName').trim().isLength({ min: 3 }).escape().withMessage('Username must be at least 3 characters long'),
    body('emailID').trim().isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage('Password must be at least 8 characters long with at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol'),
];

export const validateLogin = [
    body('emailID').isEmail().normalizeEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password cannot be empty'),
]; 

export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, 
    keyGenerator: (req: Request) => req.ip || 'unknown',
    message: 'Too many login attempts. Please try again later.',
    headers: true,
  }
);

export const checkValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Invalid input', errors: errors.array() });
        return;
    }
    return next();
};
