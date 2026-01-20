import { createClient } from 'redis';
import { logger } from './logger';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');

export const redisClient = createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT
  }
});

redisClient.on('error', (err) => logger.error('Redis client error:', err));
redisClient.on('connect', () => logger.info(`Redis connected to ${REDIS_HOST}:${REDIS_PORT}`));
redisClient.on('ready', () => logger.info('Redis client ready'));

(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
  }
})();

process.on('SIGINT', async () => {
  await redisClient.quit();
  logger.info('Redis client disconnected');
  process.exit(0);
});

export const cacheGet = async (key: string): Promise<any> => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error('Redis get error:', error);
    return null;
  }
};

export const cacheSet = async (key: string, value: any, ttl: number = 3600): Promise<boolean> => {
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    logger.error('Redis set error:', error);
    return false;
  }
};

export const cacheDel = async (key: string): Promise<boolean> => {
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error('Redis delete error:', error);
    return false;
  }
};

export const cacheDelPattern = async (pattern: string): Promise<boolean> => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    return true;
  } catch (error) {
    logger.error('Redis delete pattern error:', error);
    return false;
  }
};
