import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validate';
import * as reviewController from '../controllers/review.controller';

const router = Router();

router.get(
  '/:productId',
  [
    param('productId').isString(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('sort').optional().isIn(['newest', 'oldest', 'highest', 'lowest', 'helpful']),
    validate
  ],
  reviewController.getReviews
);

router.post(
  '/',
  [
    body('productId').isString(),
    body('userId').isString(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('title').optional().isString().trim().isLength({ max: 200 }),
    body('comment').isString().trim().isLength({ min: 10, max: 2000 }),
    body('pros').optional().isArray(),
    body('cons').optional().isArray(),
    validate
  ],
  reviewController.createReview
);

router.put(
  '/:id',
  [param('id').isString(), validate],
  reviewController.updateReview
);

router.delete(
  '/:id',
  [param('id').isString(), validate],
  reviewController.deleteReview
);

export default router;
