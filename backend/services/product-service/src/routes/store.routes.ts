import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validate';
import * as storeController from '../controllers/store.controller';

const router = Router();

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('featured').optional().isBoolean(),
    validate
  ],
  storeController.getStores
);

router.get(
  '/:id',
  [param('id').isString(), validate],
  storeController.getStoreById
);

router.post(
  '/',
  [
    body('name').isString().trim().isLength({ min: 2, max: 100 }),
    body('slug').isString().trim().isLength({ min: 2, max: 100 }),
    body('website').isURL(),
    body('cashbackRate').optional().isFloat({ min: 0, max: 100 }),
    validate
  ],
  storeController.createStore
);

router.put(
  '/:id',
  [param('id').isString(), validate],
  storeController.updateStore
);

router.delete(
  '/:id',
  [param('id').isString(), validate],
  storeController.deleteStore
);

export default router;
