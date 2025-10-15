const express = require('express');
const healthRoutes = require('./health');
const usersRoutes = require('./users');
const {
  apiLimiter,
  healthLimiter,
  requestSizeLimiter,
  validateApiVersion,
  validateContentType,
  apiSecurityHeaders
} = require('../middleware/routeSecurity');
const {
  apiLogger,
  addRequestId,
  performanceMonitor
} = require('../middleware/apiLogger');

const router = express.Router();

// Add request ID untuk tracing
router.use(addRequestId);

// Performance monitoring
router.use(performanceMonitor);

// API request logging
router.use(apiLogger);

// Apply security headers to all API routes
router.use(apiSecurityHeaders);

// Apply request size limiter to all API routes
router.use(requestSizeLimiter);

// Health routes (dengan rate limiting khusus untuk health check)
router.use('/health', healthLimiter, healthRoutes);

// API versioned routes dengan security middleware
router.use('/v1', 
  apiLimiter,           // Rate limiting untuk API
  validateApiVersion,   // Validasi versi API
  validateContentType   // Validasi Content-Type
);

// API routes dengan versioning
router.use('/v1/users', usersRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Backend Blockchain API',
    version: 'v1',
    endpoints: {
      health: '/api/health',
      users: '/api/v1/users',
      documentation: process.env.NODE_ENV !== 'production' ? '/api-docs' : 'Contact support'
    },
    timestamp: new Date().toISOString()
  });
});

// 404 handler untuk API routes yang tidak ditemukan
router.use('*', (req, res) => {
  res.status(404).json({
    error: {
      message: `API endpoint ${req.originalUrl} not found`,
      status: 404,
      availableEndpoints: {
        health: '/api/health',
        users: '/api/v1/users'
      }
    }
  });
});

module.exports = router;