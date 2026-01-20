import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';

export const getStores = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };
    if (req.query.featured === 'true') where.isFeatured = true;

    const [stores, total] = await Promise.all([
      prisma.store.findMany({ where, skip, take: limit, orderBy: { name: 'asc' } }),
      prisma.store.count({ where })
    ]);

    res.json({
      stores,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    logger.error('Get stores error:', error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
};

export const getStoreById = async (req: Request, res: Response): Promise<void> => {
  try {
    const store = await prisma.store.findUnique({ where: { id: req.params.id } });
    if (!store) {
      res.status(404).json({ error: 'Store not found' });
      return;
    }
    res.json({ store });
  } catch (error) {
    logger.error('Get store error:', error);
    res.status(500).json({ error: 'Failed to fetch store' });
  }
};

export const createStore = async (req: Request, res: Response): Promise<void> => {
  try {
    const store = await prisma.store.create({ data: req.body });
    res.status(201).json({ store });
  } catch (error) {
    logger.error('Create store error:', error);
    res.status(500).json({ error: 'Failed to create store' });
  }
};

export const updateStore = async (req: Request, res: Response): Promise<void> => {
  try {
    const store = await prisma.store.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json({ store });
  } catch (error) {
    logger.error('Update store error:', error);
    res.status(500).json({ error: 'Failed to update store' });
  }
};

export const deleteStore = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.store.delete({ where: { id: req.params.id } });
    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    logger.error('Delete store error:', error);
    res.status(500).json({ error: 'Failed to delete store' });
  }
};
