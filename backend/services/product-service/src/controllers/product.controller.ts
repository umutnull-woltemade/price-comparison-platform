import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import { cacheGet, cacheSet, cacheDel } from '../utils/redis';
import { indexProduct, deleteProductFromIndex } from '../utils/elasticsearch';
import { getMongoDB, COLLECTIONS } from '../utils/mongodb';
import { NotFoundError } from '../middleware/errorHandler';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (req.query.categoryId) where.categoryId = req.query.categoryId;
    if (req.query.brandId) where.brandId = req.query.brandId;
    if (req.query.storeId) where.storeId = req.query.storeId;
    if (req.query.inStock !== undefined) where.inStock = req.query.inStock === 'true';

    if (req.query.minPrice || req.query.maxPrice) {
      where.currentPrice = {};
      if (req.query.minPrice) where.currentPrice.gte = parseFloat(req.query.minPrice as string);
      if (req.query.maxPrice) where.currentPrice.lte = parseFloat(req.query.maxPrice as string);
    }

    let orderBy: any = { createdAt: 'desc' };
    switch (req.query.sort) {
      case 'price_asc':
        orderBy = { currentPrice: 'asc' };
        break;
      case 'price_desc':
        orderBy = { currentPrice: 'desc' };
        break;
      case 'popular':
        orderBy = { viewCount: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
    }

    const cacheKey = `products:${JSON.stringify({ page, limit, where, orderBy })}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true, logo: true } },
          store: { select: { id: true, name: true, slug: true, logo: true, cashbackRate: true } }
        }
      }),
      prisma.product.count({ where })
    ]);

    const result = {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };

    await cacheSet(cacheKey, result, 300);
    res.json(result);
  } catch (error) {
    logger.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getFeaturedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const cacheKey = `products:featured:${limit}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      res.json({ products: cached });
      return;
    }

    const products = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: limit,
      orderBy: { viewCount: 'desc' },
      include: {
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true, logo: true } },
        store: { select: { name: true, logo: true, cashbackRate: true } }
      }
    });

    await cacheSet(cacheKey, products, 600);
    res.json({ products });
  } catch (error) {
    logger.error('Get featured products error:', error);
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const cacheKey = `product:${id}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      res.json({ product: cached });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        store: true
      }
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    await cacheSet(cacheKey, product, 600);
    res.json({ product });
  } catch (error) {
    logger.error('Get product error:', error);
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  }
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        store: true
      }
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    res.json({ product });
  } catch (error) {
    logger.error('Get product by slug error:', error);
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  }
};

export const getPriceHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const days = parseInt(req.query.days as string) || 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const history = await prisma.priceHistory.findMany({
      where: {
        productId: id,
        createdAt: { gte: startDate }
      },
      orderBy: { createdAt: 'asc' },
      include: {
        store: { select: { name: true, logo: true } }
      }
    });

    res.json({ history });
  } catch (error) {
    logger.error('Get price history error:', error);
    res.status(500).json({ error: 'Failed to fetch price history' });
  }
};

export const getSimilarProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    const product = await prisma.product.findUnique({
      where: { id },
      select: { categoryId: true, brandId: true }
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const similar = await prisma.product.findMany({
      where: {
        id: { not: id },
        isActive: true,
        OR: [
          { categoryId: product.categoryId },
          { brandId: product.brandId }
        ]
      },
      take: limit,
      include: {
        category: { select: { name: true } },
        brand: { select: { name: true, logo: true } },
        store: { select: { name: true, cashbackRate: true } }
      }
    });

    res.json({ products: similar });
  } catch (error) {
    logger.error('Get similar products error:', error);
    res.status(500).json({ error: 'Failed to fetch similar products' });
  }
};

export const trackView = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await Promise.all([
      prisma.product.update({
        where: { id },
        data: { viewCount: { increment: 1 } }
      }),
      getMongoDB().collection(COLLECTIONS.PRODUCT_VIEWS).insertOne({
        productId: id,
        timestamp: new Date(),
        userAgent: req.headers['user-agent'],
        ip: req.ip
      })
    ]);

    await cacheDel(`product:${id}`);
    res.json({ success: true });
  } catch (error) {
    logger.error('Track view error:', error);
    res.status(500).json({ error: 'Failed to track view' });
  }
};

export const trackClick = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await Promise.all([
      prisma.product.update({
        where: { id },
        data: { clickCount: { increment: 1 } }
      }),
      getMongoDB().collection(COLLECTIONS.PRODUCT_CLICKS).insertOne({
        productId: id,
        timestamp: new Date(),
        userAgent: req.headers['user-agent'],
        ip: req.ip
      })
    ]);

    res.json({ success: true });
  } catch (error) {
    logger.error('Track click error:', error);
    res.status(500).json({ error: 'Failed to track click' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await prisma.product.create({
      data: {
        ...req.body,
        slug: req.body.slug || req.body.title.toLowerCase().replace(/\s+/g, '-')
      },
      include: {
        category: true,
        brand: true,
        store: true
      }
    });

    await indexProduct(product);

    res.status(201).json({ product });
  } catch (error) {
    logger.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await prisma.product.update({
      where: { id },
      data: req.body,
      include: {
        category: true,
        brand: true,
        store: true
      }
    });

    await Promise.all([
      indexProduct(product),
      cacheDel(`product:${id}`)
    ]);

    res.json({ product });
  } catch (error) {
    logger.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.product.delete({ where: { id } });

    await Promise.all([
      deleteProductFromIndex(id),
      cacheDel(`product:${id}`)
    ]);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    logger.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
