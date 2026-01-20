import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (req.query.type) where.type = req.query.type;
    if (req.query.status) where.status = req.query.status;

    const [transactions, total] = await Promise.all([
      prisma.cashbackTransaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.cashbackTransaction.count({ where })
    ]);

    res.json({
      transactions,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    logger.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

export const getTransactionSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const [totalEarned, totalPending, totalApproved, totalWithdrawn] = await Promise.all([
      prisma.cashbackTransaction.aggregate({
        where: { userId, type: 'EARNED', status: 'COMPLETED' },
        _sum: { amount: true }
      }),
      prisma.cashbackTransaction.aggregate({
        where: { userId, type: 'PENDING', status: 'PENDING' },
        _sum: { amount: true }
      }),
      prisma.cashbackTransaction.aggregate({
        where: { userId, type: 'APPROVED', status: 'COMPLETED' },
        _sum: { amount: true }
      }),
      prisma.cashbackTransaction.aggregate({
        where: { userId, type: 'WITHDRAWN', status: 'COMPLETED' },
        _sum: { amount: true }
      })
    ]);

    const availableBalance = (totalApproved._sum.amount || 0) - (totalWithdrawn._sum.amount || 0);

    res.json({
      summary: {
        totalEarned: totalEarned._sum.amount || 0,
        totalPending: totalPending._sum.amount || 0,
        totalApproved: totalApproved._sum.amount || 0,
        totalWithdrawn: totalWithdrawn._sum.amount || 0,
        availableBalance
      }
    });
  } catch (error) {
    logger.error('Get transaction summary error:', error);
    res.status(500).json({ error: 'Failed to fetch transaction summary' });
  }
};

export const createTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const transaction = await prisma.cashbackTransaction.create({
      data: req.body
    });

    res.status(201).json({ transaction });
  } catch (error) {
    logger.error('Create transaction error:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

export const approveTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const transaction = await prisma.cashbackTransaction.update({
      where: { id },
      data: {
        type: 'APPROVED',
        status: 'COMPLETED',
        approvedAt: new Date()
      }
    });

    res.json({ transaction });
  } catch (error) {
    logger.error('Approve transaction error:', error);
    res.status(500).json({ error: 'Failed to approve transaction' });
  }
};

export const rejectTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const transaction = await prisma.cashbackTransaction.update({
      where: { id },
      data: {
        type: 'REJECTED',
        status: 'FAILED',
        rejectedAt: new Date(),
        rejectionReason: reason
      }
    });

    res.json({ transaction });
  } catch (error) {
    logger.error('Reject transaction error:', error);
    res.status(500).json({ error: 'Failed to reject transaction' });
  }
};
