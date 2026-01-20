import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';

const MIN_WITHDRAWAL = parseFloat(process.env.MIN_WITHDRAWAL_AMOUNT || '50');
const WITHDRAWAL_FEE_RATE = parseFloat(process.env.WITHDRAWAL_FEE_RATE || '0');

export const getWithdrawals = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (req.query.status) where.status = req.query.status;

    const [withdrawals, total] = await Promise.all([
      prisma.withdrawalRequest.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.withdrawalRequest.count({ where })
    ]);

    res.json({
      withdrawals,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    logger.error('Get withdrawals error:', error);
    res.status(500).json({ error: 'Failed to fetch withdrawals' });
  }
};

export const createWithdrawal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, userId, accountId } = req.body;

    if (amount < MIN_WITHDRAWAL) {
      res.status(400).json({ error: `Minimum withdrawal amount is ${MIN_WITHDRAWAL}` });
      return;
    }

    const fee = amount * (WITHDRAWAL_FEE_RATE / 100);
    const netAmount = amount - fee;

    const withdrawal = await prisma.withdrawalRequest.create({
      data: {
        ...req.body,
        fee,
        netAmount
      }
    });

    res.status(201).json({ withdrawal });
  } catch (error) {
    logger.error('Create withdrawal error:', error);
    res.status(500).json({ error: 'Failed to create withdrawal' });
  }
};

export const processWithdrawal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const withdrawal = await prisma.withdrawalRequest.update({
      where: { id },
      data: {
        status: 'PROCESSING',
        processedAt: new Date()
      }
    });

    res.json({ withdrawal });
  } catch (error) {
    logger.error('Process withdrawal error:', error);
    res.status(500).json({ error: 'Failed to process withdrawal' });
  }
};

export const completeWithdrawal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { transactionRef } = req.body;

    const withdrawal = await prisma.withdrawalRequest.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        transactionRef
      }
    });

    await prisma.cashbackTransaction.create({
      data: {
        userId: withdrawal.userId,
        accountId: withdrawal.accountId,
        type: 'WITHDRAWN',
        amount: withdrawal.netAmount,
        status: 'COMPLETED',
        description: `Withdrawal request #${withdrawal.id}`
      }
    });

    res.json({ withdrawal });
  } catch (error) {
    logger.error('Complete withdrawal error:', error);
    res.status(500).json({ error: 'Failed to complete withdrawal' });
  }
};

export const rejectWithdrawal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const withdrawal = await prisma.withdrawalRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectedAt: new Date(),
        rejectionReason: reason
      }
    });

    res.json({ withdrawal });
  } catch (error) {
    logger.error('Reject withdrawal error:', error);
    res.status(500).json({ error: 'Failed to reject withdrawal' });
  }
};
