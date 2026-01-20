import { Router } from 'express';
import { query, body, param } from 'express-validator';
import { validate } from '../middleware/validate';
import * as withdrawalController from '../controllers/withdrawal.controller';

const router = Router();

router.get(
  '/:userId',
  [
    param('userId').isString(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isIn(['PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED', 'CANCELLED']),
    validate
  ],
  withdrawalController.getWithdrawals
);

router.post(
  '/',
  [
    body('userId').isString(),
    body('accountId').isString(),
    body('amount').isFloat({ min: 0 }),
    body('paymentMethod').isString(),
    body('iban').optional().isString(),
    body('bankName').optional().isString(),
    validate
  ],
  withdrawalController.createWithdrawal
);

router.put(
  '/:id/process',
  [param('id').isString(), validate],
  withdrawalController.processWithdrawal
);

router.put(
  '/:id/complete',
  [
    param('id').isString(),
    body('transactionRef').isString(),
    validate
  ],
  withdrawalController.completeWithdrawal
);

router.put(
  '/:id/reject',
  [
    param('id').isString(),
    body('reason').isString(),
    validate
  ],
  withdrawalController.rejectWithdrawal
);

export default router;
