import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import { redisClient } from '../utils/redis';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Get user profile
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        emailVerified: true,
        phoneVerified: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
        preferences: true,
        cashbackAccount: {
          select: {
            balance: true,
            totalEarned: true,
            totalWithdrawn: true,
            currency: true
          }
        }
      }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Update user profile
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { firstName, lastName, phone } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        phone
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true
      }
    });

    // Invalidate cache
    await redisClient.del(`user:${userId}`);

    logger.info(`Profile updated for user: ${user.email}`);

    res.json({ user });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Update avatar
export const updateAvatar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { avatar } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatar },
      select: {
        id: true,
        avatar: true
      }
    });

    await redisClient.del(`user:${userId}`);

    res.json({ user });
  } catch (error) {
    logger.error('Update avatar error:', error);
    res.status(500).json({ error: 'Failed to update avatar' });
  }
};

// Change password
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.password) {
      res.status(400).json({ error: 'Invalid request' });
      return;
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Current password is incorrect' });
      return;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    // Invalidate all sessions except current
    const currentToken = req.headers.authorization?.replace('Bearer ', '');
    await prisma.session.deleteMany({
      where: {
        userId,
        token: { not: currentToken }
      }
    });

    logger.info(`Password changed for user: ${user.email}`);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

// Get user preferences
export const getPreferences = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const preferences = await prisma.userPreference.findUnique({
      where: { userId }
    });

    if (!preferences) {
      res.status(404).json({ error: 'Preferences not found' });
      return;
    }

    res.json({ preferences });
  } catch (error) {
    logger.error('Get preferences error:', error);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
};

// Update user preferences
export const updatePreferences = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const {
      currency,
      language,
      notificationEmail,
      notificationPush,
      notificationSms,
      priceAlertThreshold,
      favoriteCategories,
      favoriteStores
    } = req.body;

    const preferences = await prisma.userPreference.upsert({
      where: { userId },
      update: {
        currency,
        language,
        notificationEmail,
        notificationPush,
        notificationSms,
        priceAlertThreshold,
        favoriteCategories,
        favoriteStores
      },
      create: {
        userId: userId!,
        currency,
        language,
        notificationEmail,
        notificationPush,
        notificationSms,
        priceAlertThreshold,
        favoriteCategories,
        favoriteStores
      }
    });

    await redisClient.del(`user:${userId}`);

    res.json({ preferences });
  } catch (error) {
    logger.error('Update preferences error:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
};

// Get user addresses
export const getAddresses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' }
    });

    res.json({ addresses });
  } catch (error) {
    logger.error('Get addresses error:', error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
};

// Add address
export const addAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const {
      title,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      postalCode,
      isDefault
    } = req.body;

    // If this is the default address, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: userId!,
        title,
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        country,
        postalCode,
        isDefault: isDefault || false
      }
    });

    res.status(201).json({ address });
  } catch (error) {
    logger.error('Add address error:', error);
    res.status(500).json({ error: 'Failed to add address' });
  }
};

// Update address
export const updateAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { addressId } = req.params;
    const {
      title,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      postalCode,
      isDefault
    } = req.body;

    // Verify address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { id: addressId, userId }
    });

    if (!existingAddress) {
      res.status(404).json({ error: 'Address not found' });
      return;
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, id: { not: addressId } },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.update({
      where: { id: addressId },
      data: {
        title,
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        country,
        postalCode,
        isDefault
      }
    });

    res.json({ address });
  } catch (error) {
    logger.error('Update address error:', error);
    res.status(500).json({ error: 'Failed to update address' });
  }
};

// Delete address
export const deleteAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { addressId } = req.params;

    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId }
    });

    if (!address) {
      res.status(404).json({ error: 'Address not found' });
      return;
    }

    await prisma.address.delete({
      where: { id: addressId }
    });

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    logger.error('Delete address error:', error);
    res.status(500).json({ error: 'Failed to delete address' });
  }
};

// Get cashback account
export const getCashbackAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const cashbackAccount = await prisma.cashbackAccount.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 20
        },
        withdrawals: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!cashbackAccount) {
      res.status(404).json({ error: 'Cashback account not found' });
      return;
    }

    res.json({ cashbackAccount });
  } catch (error) {
    logger.error('Get cashback account error:', error);
    res.status(500).json({ error: 'Failed to fetch cashback account' });
  }
};

// Get favorites
export const getFavorites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ favorites });
  } catch (error) {
    logger.error('Get favorites error:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};

// Add favorite
export const addFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { productId } = req.body;

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: userId!,
          productId
        }
      }
    });

    if (existing) {
      res.status(400).json({ error: 'Product already in favorites' });
      return;
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: userId!,
        productId
      }
    });

    res.status(201).json({ favorite });
  } catch (error) {
    logger.error('Add favorite error:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
};

// Remove favorite
export const removeFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;

    await prisma.favorite.delete({
      where: {
        userId_productId: {
          userId: userId!,
          productId
        }
      }
    });

    res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    logger.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};

// Get price alerts
export const getPriceAlerts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const alerts = await prisma.priceAlert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ alerts });
  } catch (error) {
    logger.error('Get price alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch price alerts' });
  }
};

// Create price alert
export const createPriceAlert = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { productId, targetPrice, notifyEmail, notifyPush } = req.body;

    const alert = await prisma.priceAlert.create({
      data: {
        userId: userId!,
        productId,
        targetPrice,
        notifyEmail: notifyEmail ?? true,
        notifyPush: notifyPush ?? true
      }
    });

    res.status(201).json({ alert });
  } catch (error) {
    logger.error('Create price alert error:', error);
    res.status(500).json({ error: 'Failed to create price alert' });
  }
};

// Delete price alert
export const deletePriceAlert = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { alertId } = req.params;

    // Verify alert belongs to user
    const alert = await prisma.priceAlert.findFirst({
      where: { id: alertId, userId }
    });

    if (!alert) {
      res.status(404).json({ error: 'Price alert not found' });
      return;
    }

    await prisma.priceAlert.delete({
      where: { id: alertId }
    });

    res.json({ message: 'Price alert deleted successfully' });
  } catch (error) {
    logger.error('Delete price alert error:', error);
    res.status(500).json({ error: 'Failed to delete price alert' });
  }
};

// Deactivate account
export const deactivateAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false }
    });

    // Delete all sessions
    await prisma.session.deleteMany({
      where: { userId }
    });

    logger.info(`Account deactivated: ${req.user?.email}`);

    res.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    logger.error('Deactivate account error:', error);
    res.status(500).json({ error: 'Failed to deactivate account' });
  }
};

// Delete account
export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { password } = req.body;

    // Verify password before deletion
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.password) {
      res.status(400).json({ error: 'Invalid request' });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Password is incorrect' });
      return;
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id: userId }
    });

    logger.info(`Account deleted: ${user.email}`);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    logger.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
};
