import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validate';
import * as categoryController from '../controllers/category.controller';

const router = Router();

// Get all categories
router.get('/', categoryController.getCategories);

// Get category tree (hierarchical)
router.get('/tree', categoryController.getCategoryTree);

// Get category by ID
router.get(
  '/:id',
  [param('id').isString(), validate],
  categoryController.getCategoryById
);

// Get category by slug
router.get(
  '/slug/:slug',
  [param('slug').isString(), validate],
  categoryController.getCategoryBySlug
);

// Create category (admin)
router.post(
  '/',
  [
    body('name').isString().trim().isLength({ min: 2, max: 100 }),
    body('slug').isString().trim().isLength({ min: 2, max: 100 }),
    body('description').optional().isString(),
    body('parentId').optional().isString(),
    body('icon').optional().isString(),
    body('image').optional().isString(),
    validate
  ],
  categoryController.createCategory
);

// Update category (admin)
router.put(
  '/:id',
  [
    param('id').isString(),
    body('name').optional().isString().trim().isLength({ min: 2, max: 100 }),
    body('description').optional().isString(),
    body('isActive').optional().isBoolean(),
    validate
  ],
  categoryController.updateCategory
);

// Delete category (admin)
router.delete(
  '/:id',
  [param('id').isString(), validate],
  categoryController.deleteCategory
);

export default router;
