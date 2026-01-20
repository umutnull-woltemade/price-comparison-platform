import { Router } from 'express';
import { body, param } from 'express-validator';
import * as userController from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { upload } from '../middleware/upload';

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

// Get current user profile
router.get('/me', userController.getProfile);

// Update current user profile
router.put(
  '/me',
  [
    body('firstName').optional().trim().isLength({ min: 2 }),
    body('lastName').optional().trim().isLength({ min: 2 }),
    body('phone').optional().isMobilePhone('tr-TR'),
    validate
  ],
  userController.updateProfile
);

// Update user avatar
router.post(
  '/me/avatar',
  upload.single('avatar'),
  userController.updateAvatar
);

// Delete avatar
router.delete('/me/avatar', userController.deleteAvatar);

// Change password
router.post(
  '/me/change-password',
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    validate
  ],
  userController.changePassword
);

// Get user preferences
router.get('/me/preferences', userController.getPreferences);

// Update user preferences
router.put('/me/preferences', userController.updatePreferences);

// Get user addresses
router.get('/me/addresses', userController.getAddresses);

// Add new address
router.post(
  '/me/addresses',
  [
    body('title').trim().notEmpty(),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
    body('phone').isMobilePhone('tr-TR'),
    body('addressLine1').trim().notEmpty(),
    body('city').trim().notEmpty(),
    body('postalCode').trim().notEmpty(),
    validate
  ],
  userController.addAddress
);

// Update address
router.put(
  '/me/addresses/:id',
  [
    param('id').isString(),
    validate
  ],
  userController.updateAddress
);

// Delete address
router.delete(
  '/me/addresses/:id',
  [
    param('id').isString(),
    validate
  ],
  userController.deleteAddress
);

// Get cashback account
router.get('/me/cashback', userController.getCashbackAccount);

// Get favorites
router.get('/me/favorites', userController.getFavorites);

// Add to favorites
router.post(
  '/me/favorites',
  [
    body('productId').notEmpty(),
    validate
  ],
  userController.addFavorite
);

// Remove from favorites
router.delete(
  '/me/favorites/:productId',
  [
    param('productId').notEmpty(),
    validate
  ],
  userController.removeFavorite
);

// Get price alerts
router.get('/me/price-alerts', userController.getPriceAlerts);

// Create price alert
router.post(
  '/me/price-alerts',
  [
    body('productId').notEmpty(),
    body('targetPrice').isNumeric(),
    validate
  ],
  userController.createPriceAlert
);

// Delete price alert
router.delete(
  '/me/price-alerts/:id',
  [
    param('id').isString(),
    validate
  ],
  userController.deletePriceAlert
);

// Deactivate account
router.post('/me/deactivate', userController.deactivateAccount);

// Delete account
router.delete('/me', userController.deleteAccount);

export default router;
