import { Client } from '@elastic/elasticsearch';
import { logger } from './logger';

const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';

export const esClient = new Client({
  node: ELASTICSEARCH_URL
});

export const PRODUCT_INDEX = 'products';

export const initElasticsearch = async (): Promise<void> => {
  try {
    // Check connection
    const health = await esClient.cluster.health();
    logger.info('Elasticsearch cluster status:', health.status);

    // Create products index if not exists
    const indexExists = await esClient.indices.exists({ index: PRODUCT_INDEX });

    if (!indexExists) {
      await esClient.indices.create({
        index: PRODUCT_INDEX,
        body: {
          settings: {
            number_of_shards: 1,
            number_of_replicas: 1,
            analysis: {
              analyzer: {
                turkish_analyzer: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'turkish_stop', 'turkish_stemmer']
                }
              },
              filter: {
                turkish_stop: {
                  type: 'stop',
                  stopwords: '_turkish_'
                },
                turkish_stemmer: {
                  type: 'stemmer',
                  language: 'turkish'
                }
              }
            }
          },
          mappings: {
            properties: {
              id: { type: 'keyword' },
              title: {
                type: 'text',
                analyzer: 'turkish_analyzer',
                fields: {
                  keyword: { type: 'keyword' },
                  suggest: { type: 'completion' }
                }
              },
              description: {
                type: 'text',
                analyzer: 'turkish_analyzer'
              },
              slug: { type: 'keyword' },
              sku: { type: 'keyword' },
              barcode: { type: 'keyword' },
              categoryId: { type: 'keyword' },
              categoryName: {
                type: 'text',
                analyzer: 'turkish_analyzer',
                fields: { keyword: { type: 'keyword' } }
              },
              brandId: { type: 'keyword' },
              brandName: {
                type: 'text',
                analyzer: 'turkish_analyzer',
                fields: { keyword: { type: 'keyword' } }
              },
              storeId: { type: 'keyword' },
              storeName: {
                type: 'text',
                fields: { keyword: { type: 'keyword' } }
              },
              currentPrice: { type: 'double' },
              originalPrice: { type: 'double' },
              currency: { type: 'keyword' },
              discount: { type: 'float' },
              inStock: { type: 'boolean' },
              features: {
                type: 'text',
                analyzer: 'turkish_analyzer'
              },
              tags: {
                type: 'text',
                analyzer: 'turkish_analyzer',
                fields: { keyword: { type: 'keyword' } }
              },
              rating: { type: 'float' },
              reviewCount: { type: 'integer' },
              viewCount: { type: 'integer' },
              favoriteCount: { type: 'integer' },
              isActive: { type: 'boolean' },
              isFeatured: { type: 'boolean' },
              thumbnail: { type: 'keyword' },
              images: { type: 'keyword' },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' }
            }
          }
        }
      });

      logger.info(`Created Elasticsearch index: ${PRODUCT_INDEX}`);
    } else {
      logger.info(`Elasticsearch index ${PRODUCT_INDEX} already exists`);
    }
  } catch (error) {
    logger.error('Elasticsearch initialization error:', error);
    throw error;
  }
};

export const indexProduct = async (product: any): Promise<void> => {
  try {
    await esClient.index({
      index: PRODUCT_INDEX,
      id: product.id,
      document: {
        id: product.id,
        title: product.title,
        description: product.description,
        slug: product.slug,
        sku: product.sku,
        barcode: product.barcode,
        categoryId: product.categoryId,
        categoryName: product.category?.name,
        brandId: product.brandId,
        brandName: product.brand?.name,
        storeId: product.storeId,
        storeName: product.store?.name,
        currentPrice: parseFloat(product.currentPrice.toString()),
        originalPrice: product.originalPrice ? parseFloat(product.originalPrice.toString()) : null,
        currency: product.currency,
        discount: product.discount ? parseFloat(product.discount.toString()) : null,
        inStock: product.inStock,
        features: product.features,
        tags: product.tags,
        rating: product.rating ? parseFloat(product.rating.toString()) : null,
        reviewCount: product.reviewCount,
        viewCount: product.viewCount,
        favoriteCount: product.favoriteCount,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        thumbnail: product.thumbnail,
        images: product.images,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }
    });

    logger.debug(`Indexed product: ${product.id}`);
  } catch (error) {
    logger.error('Failed to index product:', error);
  }
};

export const deleteProductFromIndex = async (productId: string): Promise<void> => {
  try {
    await esClient.delete({
      index: PRODUCT_INDEX,
      id: productId
    });

    logger.debug(`Deleted product from index: ${productId}`);
  } catch (error) {
    logger.error('Failed to delete product from index:', error);
  }
};

export const searchProducts = async (query: string, filters: any = {}, options: any = {}): Promise<any> => {
  try {
    const must: any[] = [
      {
        multi_match: {
          query,
          fields: ['title^3', 'description', 'features', 'tags', 'brandName^2', 'categoryName^2'],
          type: 'best_fields',
          fuzziness: 'AUTO'
        }
      }
    ];

    const filter: any[] = [{ term: { isActive: true } }];

    if (filters.categoryId) {
      filter.push({ term: { categoryId: filters.categoryId } });
    }

    if (filters.brandId) {
      filter.push({ term: { brandId: filters.brandId } });
    }

    if (filters.storeId) {
      filter.push({ term: { storeId: filters.storeId } });
    }

    if (filters.inStock !== undefined) {
      filter.push({ term: { inStock: filters.inStock } });
    }

    if (filters.minPrice || filters.maxPrice) {
      const priceRange: any = {};
      if (filters.minPrice) priceRange.gte = filters.minPrice;
      if (filters.maxPrice) priceRange.lte = filters.maxPrice;
      filter.push({ range: { currentPrice: priceRange } });
    }

    const result = await esClient.search({
      index: PRODUCT_INDEX,
      body: {
        query: {
          bool: { must, filter }
        },
        sort: options.sort || [{ _score: 'desc' }, { createdAt: 'desc' }],
        from: options.from || 0,
        size: options.size || 20,
        highlight: {
          fields: {
            title: {},
            description: {}
          }
        }
      }
    });

    return result;
  } catch (error) {
    logger.error('Search error:', error);
    throw error;
  }
};
