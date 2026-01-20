import { Router } from 'express';
import { query } from 'express-validator';
import { validate } from '../middleware/validate';
import * as searchController from '../controllers/search.controller';

const router = Router();

// Main search endpoint
router.get(
  '/',
  [
    query('q').isString().trim().isLength({ min: 2 }),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('categoryId').optional().isString(),
    query('brandId').optional().isString(),
    query('storeId').optional().isString(),
    query('minPrice').optional().isFloat({ min: 0 }),
    query('maxPrice').optional().isFloat({ min: 0 }),
    query('inStock').optional().isBoolean(),
    query('sort').optional().isIn(['relevance', 'price_asc', 'price_desc', 'newest', 'rating']),
    validate
  ],
  searchController.search
);

// Autocomplete/suggestions
router.get(
  '/suggest',
  [
    query('q').isString().trim().isLength({ min: 2 }),
    query('limit').optional().isInt({ min: 1, max: 10 }),
    validate
  ],
  searchController.suggest
);

// Popular searches
router.get('/popular', searchController.getPopularSearches);

export default router;
