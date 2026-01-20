import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';

export const getBrands = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const [brands, total] = await Promise.all([
      prisma.brand.findMany({
        where: { isActive: true },
        skip,
        take: limit,
        orderBy: { name: 'asc' }
      }),
      prisma.brand.count({ where: { isActive: true } })
    ]);

    res.json({
      brands,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    logger.error('Get brands error:', error);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
};

export const getBrandById = async (req: Request, res: Response): Promise<void> => {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id: req.params.id }
    });

    if (!brand) {
      res.status(404).json({ error: 'Brand not found' });
      return;
    }

    res.json({ brand });
  } catch (error) {
    logger.error('Get brand error:', error);
    res.status(500).json({ error: 'Failed to fetch brand' });
  }
};

export const createBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const brand = await prisma.brand.create({ data: req.body });
    res.status(201).json({ brand });
  } catch (error) {
    logger.error('Create brand error:', error);
    res.status(500).json({ error: 'Failed to create brand' });
  }
};

export const updateBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const brand = await prisma.brand.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json({ brand });
  } catch (error) {
    logger.error('Update brand error:', error);
    res.status(500).json({ error: 'Failed to update brand' });
  }
};

export const deleteBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.brand.delete({ where: { id: req.params.id } });
    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    logger.error('Delete brand error:', error);
    res.status(500).json({ error: 'Failed to delete brand' });
  }
};
