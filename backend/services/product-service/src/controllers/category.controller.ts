import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import { cacheGet, cacheSet, cacheDel } from '../utils/redis';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const cacheKey = 'categories:all';
    const cached = await cacheGet(cacheKey);
    if (cached) {
      res.json({ categories: cached });
      return;
    }

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    await cacheSet(cacheKey, categories, 3600);
    res.json({ categories });
  } catch (error) {
    logger.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const getCategoryTree = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true, parentId: null },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });

    res.json({ categories });
  } catch (error) {
    logger.error('Get category tree error:', error);
    res.status(500).json({ error: 'Failed to fetch category tree' });
  }
};

export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
      include: {
        parent: true,
        children: { where: { isActive: true } }
      }
    });

    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.json({ category });
  } catch (error) {
    logger.error('Get category error:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: {
        children: { where: { isActive: true } }
      }
    });

    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.json({ category });
  } catch (error) {
    logger.error('Get category by slug error:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await prisma.category.create({
      data: req.body
    });

    await cacheDel('categories:all');
    res.status(201).json({ category });
  } catch (error) {
    logger.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: req.body
    });

    await cacheDel('categories:all');
    res.json({ category });
  } catch (error) {
    logger.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.category.delete({
      where: { id: req.params.id }
    });

    await cacheDel('categories:all');
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    logger.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
