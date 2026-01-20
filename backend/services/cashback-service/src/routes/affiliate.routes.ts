import { Router } from 'express';
import { query, body } from 'express-validator';
import { validate } from '../middleware/validate';
import * as affiliateController from '../controllers/affiliate.controller';

const router = Router();

router.post(
  '/click',
  [
    body('productId').isString(),
    body('storeId').isString(),
    body('affiliateId').isString(),
    body('userId').optional().isString(),
    validate
  ],
  affiliateController.trackClick
);

router.post(
  '/conversion',
  [
    body('clickId').isString(),
    body('orderId').isString(),
    body('amount').isFloat({ min: 0 }),
    validate
  ],
  affiliateController.trackConversion
);

router.get(
  '/stats/:userId',
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    validate
  ],
  affiliateController.getAffiliateStats
);

export default router;
