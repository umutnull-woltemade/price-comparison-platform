import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middleware/validate';

const router = Router();

// Register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    body('firstName').optional().trim().isLength({ min: 2 }),
    body('lastName').optional().trim().isLength({ min: 2 }),
    validate
  ],
  authController.register
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    validate
  ],
  authController.login
);

// Refresh token
router.post(
  '/refresh',
  [
    body('refreshToken').notEmpty(),
    validate
  ],
  authController.refreshToken
);

// Logout
router.post('/logout', authController.logout);

// Forgot password
router.post(
  '/forgot-password',
  [
    body('email').isEmail().normalizeEmail(),
    validate
  ],
  authController.forgotPassword
);

// Reset password
router.post(
  '/reset-password',
  [
    body('token').notEmpty(),
    body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    validate
  ],
  authController.resetPassword
);

// Verify email
router.post(
  '/verify-email',
  [
    body('token').notEmpty(),
    validate
  ],
  authController.verifyEmail
);

// Resend verification email
router.post(
  '/resend-verification',
  [
    body('email').isEmail().normalizeEmail(),
    validate
  ],
  authController.resendVerification
);

// OAuth - Google
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);

export default router;
