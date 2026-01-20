import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';

export const getReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    let orderBy: any = { createdAt: 'desc' };
    switch (req.query.sort) {
      case 'oldest': orderBy = { createdAt: 'asc' }; break;
      case 'highest': orderBy = { rating: 'desc' }; break;
      case 'lowest': orderBy = { rating: 'asc' }; break;
      case 'helpful': orderBy = { helpfulCount: 'desc' }; break;
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId },
        skip,
        take: limit,
        orderBy
      }),
      prisma.review.count({ where: { productId } })
    ]);

    res.json({
      reviews,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    logger.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await prisma.review.create({ data: req.body });

    const stats = await prisma.review.aggregate({
      where: { productId: req.body.productId },
      _avg: { rating: true },
      _count: true
    });

    await prisma.product.update({
      where: { id: req.body.productId },
      data: {
        rating: stats._avg.rating,
        reviewCount: stats._count
      }
    });

    res.status(201).json({ review });
  } catch (error) {
    logger.error('Create review error:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

export const updateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json({ review });
  } catch (error) {
    logger.error('Update review error:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
};

export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.review.delete({ where: { id: req.params.id } });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    logger.error('Delete review error:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};
