import { Router } from 'express';
import { query, body, param } from 'express-validator';
import { validate } from '../middleware/validate';
import * as transactionController from '../controllers/transaction.controller';

const router = Router();

router.get(
  '/:userId',
  [
    param('userId').isString(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('type').optional().isIn(['EARNED', 'PENDING', 'APPROVED', 'REJECTED', 'WITHDRAWN', 'REFUNDED']),
    query('status').optional().isIn(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED']),
    validate
  ],
  transactionController.getTransactions
);

router.get(
  '/summary/:userId',
  [param('userId').isString(), validate],
  transactionController.getTransactionSummary
);

router.post(
  '/',
  [
    body('userId').isString(),
    body('accountId').isString(),
    body('type').isIn(['EARNED', 'PENDING', 'APPROVED', 'REJECTED', 'WITHDRAWN', 'REFUNDED']),
    body('amount').isFloat({ min: 0 }),
    body('orderId').optional().isString(),
    body('storeId').optional().isString(),
    validate
  ],
  transactionController.createTransaction
);

router.put(
  '/:id/approve',
  [param('id').isString(), validate],
  transactionController.approveTransaction
);

router.put(
  '/:id/reject',
  [
    param('id').isString(),
    body('reason').isString(),
    validate
  ],
  transactionController.rejectTransaction
);

export default router;
