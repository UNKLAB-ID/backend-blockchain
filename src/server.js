const app = require('./app');
const config = require('./config/config');
const dbConnection = require('./config/database');
const redisConnection = require('./config/redis');
const db = require('./models');

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);
  
  // Close database connections
  if (dbConnection.sequelize) {
    dbConnection.closeConnection().then(() => {
      console.log('Database connection closed.');
    }).catch(err => {
      console.error('Error closing database connection:', err);
    });
  }
  
  // Close Redis connection
  if (redisConnection.client && redisConnection.client.isOpen) {
    redisConnection.client.quit(() => {
      console.log('Redis connection closed.');
    });
  }
  
  process.exit(0);
};

// Handle graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await dbConnection.testConnection();
    console.log('✅ Database connection established successfully.');
    
    // Sync database models (only in development)
    if (config.server.env === 'development') {
      await dbConnection.syncDatabase({ alter: true });
      console.log('✅ Database models synchronized successfully.');
    }
    
    // Test Redis connection
    await redisConnection.connect();
    console.log('✅ Redis connection established successfully.');
    
    // Start the server
    const server = app.listen(config.server.port, config.server.host, () => {
      console.log(`🚀 Server running on http://${config.server.host}:${config.server.port}`);
      console.log(`📊 Environment: ${config.server.env}`);
      console.log(`📝 Health Check: http://${config.server.host}:${config.server.port}/api/health`);
      if (config.server.env !== 'production') {
        console.log(`📚 API Documentation: http://${config.server.host}:${config.server.port}/api-docs`);
      }
    });
    
    return server;
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server only if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };