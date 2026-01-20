import { Router } from 'express';
import { body, query, param } from 'express-validator';
import { validate } from '../middleware/validate';
import * as productController from '../controllers/product.controller';

const router = Router();

// Get products with pagination and filters
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('categoryId').optional().isString(),
    query('brandId').optional().isString(),
    query('storeId').optional().isString(),
    query('minPrice').optional().isFloat({ min: 0 }),
    query('maxPrice').optional().isFloat({ min: 0 }),
    query('inStock').optional().isBoolean(),
    query('sort').optional().isIn(['price_asc', 'price_desc', 'newest', 'popular', 'rating']),
    validate
  ],
  productController.getProducts
);

// Get featured products
router.get('/featured', productController.getFeaturedProducts);

// Get product by ID
router.get(
  '/:id',
  [param('id').isString(), validate],
  productController.getProductById
);

// Get product by slug
router.get(
  '/slug/:slug',
  [param('slug').isString(), validate],
  productController.getProductBySlug
);

// Get price history
router.get(
  '/:id/price-history',
  [
    param('id').isString(),
    query('days').optional().isInt({ min: 1, max: 365 }),
    validate
  ],
  productController.getPriceHistory
);

// Get similar products
router.get(
  '/:id/similar',
  [param('id').isString(), validate],
  productController.getSimilarProducts
);

// Track product view
router.post(
  '/:id/view',
  [param('id').isString(), validate],
  productController.trackView
);

// Track product click
router.post(
  '/:id/click',
  [param('id').isString(), validate],
  productController.trackClick
);

// Create product (admin)
router.post(
  '/',
  [
    body('title').isString().trim().isLength({ min: 3, max: 255 }),
    body('description').optional().isString(),
    body('categoryId').isString(),
    body('brandId').optional().isString(),
    body('storeId').isString(),
    body('currentPrice').isFloat({ min: 0 }),
    body('originalPrice').optional().isFloat({ min: 0 }),
    body('currency').optional().isString().isLength({ max: 3 }),
    body('sku').optional().isString(),
    body('barcode').optional().isString(),
    body('inStock').optional().isBoolean(),
    body('sourceUrl').isURL(),
    body('images').optional().isArray(),
    body('features').optional().isArray(),
    body('tags').optional().isArray(),
    validate
  ],
  productController.createProduct
);

// Update product (admin)
router.put(
  '/:id',
  [
    param('id').isString(),
    body('title').optional().isString().trim().isLength({ min: 3, max: 255 }),
    body('description').optional().isString(),
    body('currentPrice').optional().isFloat({ min: 0 }),
    body('inStock').optional().isBoolean(),
    validate
  ],
  productController.updateProduct
);

// Delete product (admin)
router.delete(
  '/:id',
  [param('id').isString(), validate],
  productController.deleteProduct
);

export default router;
