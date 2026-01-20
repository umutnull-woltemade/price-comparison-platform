import { MongoClient, Db } from 'mongodb';
import { logger } from './logger';

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://priceuser:pricepass@localhost:27017/price_platform?authSource=admin';

let client: MongoClient;
let db: Db;

export const connectMongoDB = async (): Promise<Db> => {
  try {
    if (db) {
      return db;
    }

    client = new MongoClient(MONGODB_URL);
    await client.connect();

    db = client.db();
    logger.info('MongoDB connected successfully');

    return db;
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    throw error;
  }
};

export const getMongoDB = (): Db => {
  if (!db) {
    throw new Error('MongoDB not initialized. Call connectMongoDB() first.');
  }
  return db;
};

export const closeMongoDB = async (): Promise<void> => {
  if (client) {
    await client.close();
    logger.info('MongoDB disconnected');
  }
};

// Collections
export const COLLECTIONS = {
  PRODUCT_VIEWS: 'product_views',
  PRODUCT_CLICKS: 'product_clicks',
  SEARCH_LOGS: 'search_logs',
  PRICE_ALERTS: 'price_alerts'
};

// Initialize collections and indexes
export const initMongoCollections = async (): Promise<void> => {
  const db = await connectMongoDB();

  try {
    // Product Views collection
    await db.collection(COLLECTIONS.PRODUCT_VIEWS).createIndex(
      { productId: 1, timestamp: -1 },
      { background: true }
    );

    // Product Clicks collection
    await db.collection(COLLECTIONS.PRODUCT_CLICKS).createIndex(
      { productId: 1, timestamp: -1 },
      { background: true }
    );

    // Search Logs collection
    await db.collection(COLLECTIONS.SEARCH_LOGS).createIndex(
      { query: 'text', timestamp: -1 },
      { background: true }
    );

    // Price Alerts collection
    await db.collection(COLLECTIONS.PRICE_ALERTS).createIndex(
      { userId: 1, productId: 1 },
      { background: true }
    );

    logger.info('MongoDB collections and indexes initialized');
  } catch (error) {
    logger.error('Failed to initialize MongoDB collections:', error);
  }
};

process.on('SIGINT', async () => {
  await closeMongoDB();
  process.exit(0);
});
