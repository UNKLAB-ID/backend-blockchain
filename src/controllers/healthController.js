const config = require('../config/config');
const dbConnection = require('../config/database');
const redisConnection = require('../config/redis');

// Health check controller
const healthCheck = async (req, res) => {
  try {
    const healthInfo = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: config.app.name,
      version: config.app.version,
      environment: config.server.env,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      checks: {
        database: 'checking...',
        redis: 'checking...'
      }
    };

    // Check database connection using Sequelize
    try {
      await dbConnection.sequelize.authenticate();
      healthInfo.checks.database = 'healthy';
    } catch (error) {
      healthInfo.checks.database = 'unhealthy';
      healthInfo.status = 'DEGRADED';
    }

    // Check Redis connection
    try {
      if (redisConnection.client && redisConnection.client.isOpen) {
        await redisConnection.client.ping();
        healthInfo.checks.redis = 'healthy';
      } else {
        throw new Error('Redis client not connected');
      }
    } catch (error) {
      healthInfo.checks.redis = 'unhealthy';
      healthInfo.status = 'DEGRADED';
    }

    const statusCode = healthInfo.status === 'OK' ? 200 : 503;
    res.status(statusCode).json(healthInfo);
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      service: config.app.name,
      version: config.app.version,
      error: error.message
    });
  }
};

// Simple health check (for load balancers)
const healthCheckSimple = (req, res) => {
  res.status(200).json({ status: 'OK' });
};

module.exports = {
  healthCheck,
  healthCheckSimple
};