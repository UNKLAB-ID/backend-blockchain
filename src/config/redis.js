const { createClient } = require('redis');
const config = require('./config');

// Create Redis client
const client = createClient({
  socket: {
    host: config.redis.host,
    port: config.redis.port,
  },
  password: config.redis.password,
  retry_strategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      console.error('Redis connection refused');
      return new Error('Redis connection refused');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      console.error('Redis retry time exhausted');
      return new Error('Redis retry time exhausted');
    }
    if (options.attempt > 10) {
      console.error('Redis connection attempts exceeded');
      return undefined;
    }
    // Reconnect after
    return Math.min(options.attempt * 100, 3000);
  }
});

// Redis event handlers
client.on('connect', () => {
  console.log('✅ Redis client connected');
});

client.on('ready', () => {
  console.log('✅ Redis client ready');
});

client.on('error', (err) => {
  console.error('❌ Redis client error:', err);
});

client.on('end', () => {
  console.log('🔌 Redis client disconnected');
});

// Connect to Redis
const connect = async () => {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
    return client;
  } catch (error) {
    console.error('Redis connection error:', error);
    throw error;
  }
};

// Set key-value pair
const setKey = async (key, value, expireInSeconds = 3600) => {
  try {
    await client.setEx(key, expireInSeconds, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Redis set error:', error);
    throw error;
  }
};

// Get value by key
const getKey = async (key) => {
  try {
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Redis get error:', error);
    throw error;
  }
};

// Delete key
const deleteKey = async (key) => {
  try {
    const result = await client.del(key);
    return result > 0;
  } catch (error) {
    console.error('Redis delete error:', error);
    throw error;
  }
};

// Check if key exists
const keyExists = async (key) => {
  try {
    const result = await client.exists(key);
    return result === 1;
  } catch (error) {
    console.error('Redis exists error:', error);
    throw error;
  }
};

// Get all keys matching pattern
const getKeys = async (pattern = '*') => {
  try {
    const keys = await client.keys(pattern);
    return keys;
  } catch (error) {
    console.error('Redis keys error:', error);
    throw error;
  }
};

// Flush all data
const flushAll = async () => {
  try {
    await client.flushAll();
    return true;
  } catch (error) {
    console.error('Redis flush error:', error);
    throw error;
  }
};

module.exports = {
  client,
  connect,
  setKey,
  getKey,
  deleteKey,
  keyExists,
  getKeys,
  flushAll
};