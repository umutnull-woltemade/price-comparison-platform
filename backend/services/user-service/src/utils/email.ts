import nodemailer from 'nodemailer';
import { logger } from './logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const SMTP_HOST = process.env.SMTP_HOST || 'localhost';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_FROM = process.env.SMTP_FROM || 'noreply@priceplatform.com';

// Create transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: SMTP_USER && SMTP_PASS ? {
    user: SMTP_USER,
    pass: SMTP_PASS
  } : undefined
});

// Verify connection in production
if (process.env.NODE_ENV === 'production') {
  transporter.verify((error, success) => {
    if (error) {
      logger.error('SMTP connection error:', error);
    } else {
      logger.info('SMTP server is ready to send emails');
    }
  });
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    // In development, log email instead of sending
    if (process.env.NODE_ENV === 'development') {
      logger.info('📧 Email (dev mode):', {
        to: options.to,
        subject: options.subject,
        html: options.html.substring(0, 200) + '...'
      });
      return true;
    }

    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    });

    logger.info('Email sent:', {
      messageId: info.messageId,
      to: options.to,
      subject: options.subject
    });

    return true;
  } catch (error) {
    logger.error('Send email error:', error);
    return false;
  }
};

// Email templates
export const getVerificationEmailTemplate = (verificationUrl: string, firstName?: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Welcome to Price Platform!</h1>
      </div>
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px;">Hi${firstName ? ` ${firstName}` : ''},</p>
        <p style="font-size: 16px;">Thank you for signing up! Please verify your email address to get started.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">Verify Email</a>
        </div>
        <p style="font-size: 14px; color: #666;">This link will expire in 24 hours.</p>
        <p style="font-size: 14px; color: #666;">If you didn't create an account, please ignore this email.</p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>&copy; 2025 Price Platform. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

export const getPasswordResetEmailTemplate = (resetUrl: string, firstName?: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Password Reset Request</h1>
      </div>
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px;">Hi${firstName ? ` ${firstName}` : ''},</p>
        <p style="font-size: 16px;">We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #f5576c; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">Reset Password</a>
        </div>
        <p style="font-size: 14px; color: #666;">This link will expire in 1 hour.</p>
        <p style="font-size: 14px; color: #666;">If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>&copy; 2025 Price Platform. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};
