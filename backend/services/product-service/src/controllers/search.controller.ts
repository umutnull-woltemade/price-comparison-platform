import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { searchProducts, esClient, PRODUCT_INDEX } from '../utils/elasticsearch';
import { getMongoDB, COLLECTIONS } from '../utils/mongodb';

export const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const filters: any = {};
    if (req.query.categoryId) filters.categoryId = req.query.categoryId;
    if (req.query.brandId) filters.brandId = req.query.brandId;
    if (req.query.storeId) filters.storeId = req.query.storeId;
    if (req.query.inStock !== undefined) filters.inStock = req.query.inStock === 'true';
    if (req.query.minPrice) filters.minPrice = parseFloat(req.query.minPrice as string);
    if (req.query.maxPrice) filters.maxPrice = parseFloat(req.query.maxPrice as string);

    let sort: any = [{ _score: 'desc' }];
    switch (req.query.sort) {
      case 'price_asc': sort = [{ currentPrice: 'asc' }]; break;
      case 'price_desc': sort = [{ currentPrice: 'desc' }]; break;
      case 'newest': sort = [{ createdAt: 'desc' }]; break;
      case 'rating': sort = [{ rating: 'desc' }]; break;
    }

    const result = await searchProducts(query, filters, {
      from: (page - 1) * limit,
      size: limit,
      sort
    });

    // Log search
    getMongoDB().collection(COLLECTIONS.SEARCH_LOGS).insertOne({
      query,
      filters,
      resultCount: result.hits.total.value,
      timestamp: new Date(),
      userAgent: req.headers['user-agent']
    }).catch(err => logger.error('Failed to log search:', err));

    res.json({
      products: result.hits.hits.map((hit: any) => ({
        ...hit._source,
        score: hit._score,
        highlight: hit.highlight
      })),
      pagination: {
        page,
        limit,
        total: result.hits.total.value,
        totalPages: Math.ceil(result.hits.total.value / limit)
      }
    });
  } catch (error) {
    logger.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
};

export const suggest = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    const limit = parseInt(req.query.limit as string) || 5;

    const result = await esClient.search({
      index: PRODUCT_INDEX,
      body: {
        suggest: {
          product_suggest: {
            prefix: query,
            completion: {
              field: 'title.suggest',
              size: limit,
              skip_duplicates: true
            }
          }
        }
      }
    });

    const suggestions = result.suggest.product_suggest[0].options.map((opt: any) => ({
      text: opt.text,
      score: opt._score
    }));

    res.json({ suggestions });
  } catch (error) {
    logger.error('Suggest error:', error);
    res.status(500).json({ error: 'Suggestion failed' });
  }
};

export const getPopularSearches = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const popular = await getMongoDB()
      .collection(COLLECTIONS.SEARCH_LOGS)
      .aggregate([
        { $match: { timestamp: { $gte: sevenDaysAgo } } },
        { $group: { _id: '$query', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
        { $project: { query: '$_id', count: 1, _id: 0 } }
      ])
      .toArray();

    res.json({ searches: popular });
  } catch (error) {
    logger.error('Get popular searches error:', error);
    res.status(500).json({ error: 'Failed to fetch popular searches' });
  }
};
