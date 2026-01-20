import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validate';
import * as brandController from '../controllers/brand.controller';

const router = Router();

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    validate
  ],
  brandController.getBrands
);

router.get(
  '/:id',
  [param('id').isString(), validate],
  brandController.getBrandById
);

router.post(
  '/',
  [
    body('name').isString().trim().isLength({ min: 2, max: 100 }),
    body('slug').isString().trim().isLength({ min: 2, max: 100 }),
    body('logo').optional().isString(),
    body('website').optional().isURL(),
    validate
  ],
  brandController.createBrand
);

router.put(
  '/:id',
  [param('id').isString(), validate],
  brandController.updateBrand
);

router.delete(
  '/:id',
  [param('id').isString(), validate],
  brandController.deleteBrand
);

export default router;
