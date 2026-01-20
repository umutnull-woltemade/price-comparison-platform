import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import { sendEmail, getVerificationEmailTemplate, getPasswordResetEmailTemplate } from '../utils/email';
import { redisClient } from '../utils/redis';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

// Register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        preferences: {
          create: {} // Create default preferences
        },
        cashbackAccount: {
          create: {} // Create default cashback account
        }
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    });

    // Generate verification token
    const verificationToken = nanoid(32);
    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token: verificationToken,
        type: 'EMAIL',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    });

    // Send verification email
    const verificationUrl = `${process.env.EMAIL_VERIFY_URL}?token=${verificationToken}`;
    await sendEmail({
      to: email,
      subject: 'Verify Your Email',
      html: getVerificationEmailTemplate(verificationUrl, firstName)
    });

    logger.info(`User registered: ${email}`);

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      user
    });
  } catch (error) {
    logger.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { preferences: true }
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Check if account is blocked
    if (user.isBlocked) {
      res.status(403).json({ error: 'Account is blocked', reason: user.blockedReason });
      return;
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      res.status(423).json({ error: 'Account is temporarily locked. Please try again later.' });
      return;
    }

    // Verify password
    if (!user.password || !(await bcrypt.compare(password, user.password))) {
      // Increment login attempts
      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: { increment: 1 },
          lockedUntil: user.loginAttempts >= 4
            ? new Date(Date.now() + 15 * 60 * 1000) // Lock for 15 minutes
            : undefined
        }
      });

      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );

    // Create session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken,
        userAgent: req.headers['user-agent'],
        ip: req.ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: req.ip,
        loginAttempts: 0,
        lockedUntil: null
      }
    });

    logger.info(`User logged in: ${email}`);

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        role: user.role,
        emailVerified: user.emailVerified,
        preferences: user.preferences
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Refresh token
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: string };

    // Find session
    const session = await prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true }
    });

    if (!session || session.userId !== decoded.id) {
      res.status(401).json({ error: 'Invalid refresh token' });
      return;
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { id: session.user.id, email: session.user.email, role: session.user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Update session
    await prisma.session.update({
      where: { id: session.id },
      data: { token: accessToken }
    });

    res.json({ accessToken });
  } catch (error) {
    logger.error('Refresh token error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

// Logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      await prisma.session.deleteMany({ where: { token } });
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};

// Forgot password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Don't reveal if user exists
      res.json({ message: 'If an account exists, a password reset link has been sent.' });
      return;
    }

    // Generate reset token
    const resetToken = nanoid(32);
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      }
    });

    // Send reset email
    const resetUrl = `${process.env.PASSWORD_RESET_URL}?token=${resetToken}`;
    await sendEmail({
      to: email,
      subject: 'Reset Your Password',
      html: getPasswordResetEmailTemplate(resetUrl, user.firstName)
    });

    res.json({ message: 'If an account exists, a password reset link has been sent.' });
  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({ error: 'Request failed' });
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;

    // Find reset token
    const resetToken = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      res.status(400).json({ error: 'Invalid or expired reset token' });
      return;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword }
    });

    // Mark token as used
    await prisma.passwordReset.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() }
    });

    // Invalidate all sessions
    await prisma.session.deleteMany({ where: { userId: resetToken.userId } });

    logger.info(`Password reset for user: ${resetToken.user.email}`);

    res.json({ message: 'Password reset successful. Please log in with your new password.' });
  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({ error: 'Password reset failed' });
  }
};

// Verify email
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!verificationToken || verificationToken.usedAt || verificationToken.expiresAt < new Date()) {
      res.status(400).json({ error: 'Invalid or expired verification token' });
      return;
    }

    // Update user
    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date()
      }
    });

    // Mark token as used
    await prisma.verificationToken.update({
      where: { id: verificationToken.id },
      data: { usedAt: new Date() }
    });

    logger.info(`Email verified for user: ${verificationToken.user.email}`);

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    logger.error('Verify email error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
};

// Resend verification
export const resendVerification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.json({ message: 'If an account exists, a verification email has been sent.' });
      return;
    }

    if (user.emailVerified) {
      res.status(400).json({ error: 'Email is already verified' });
      return;
    }

    // Generate new verification token
    const verificationToken = nanoid(32);
    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token: verificationToken,
        type: 'EMAIL',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });

    // Send verification email
    const verificationUrl = `${process.env.EMAIL_VERIFY_URL}?token=${verificationToken}`;
    await sendEmail({
      to: email,
      subject: 'Verify Your Email',
      html: getVerificationEmailTemplate(verificationUrl, user.firstName)
    });

    res.json({ message: 'Verification email sent' });
  } catch (error) {
    logger.error('Resend verification error:', error);
    res.status(500).json({ error: 'Request failed' });
  }
};

// Google OAuth
export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  // Implement OAuth flow
  res.status(501).json({ error: 'Not implemented yet' });
};

export const googleCallback = async (req: Request, res: Response): Promise<void> => {
  // Implement OAuth callback
  res.status(501).json({ error: 'Not implemented yet' });
};
