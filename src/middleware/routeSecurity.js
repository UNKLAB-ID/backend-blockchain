// Route-level security middleware
const rateLimit = require('express-rate-limit');
const config = require('../config/config');

// API rate limiting - more restrictive than global
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many API requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth endpoints rate limiting - very restrictive
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: {
    error: 'Too many authentication attempts from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Health check rate limiting - more permissive
const healthLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 3000, // Limit each IP to 30 health check requests per minute
  message: {
    error: 'Too many health check requests from this IP.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Request size limiter middleware
const requestSizeLimiter = (req, res, next) => {
  const contentLength = parseInt(req.headers['content-length']) || 0;
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (contentLength > maxSize) {
    return res.status(413).json({
      error: {
        message: 'Request entity too large',
        status: 413,
        maxSize: '10MB'
      }
    });
  }
  next();
};

// API version validation
const validateApiVersion = (req, res, next) => {
  const supportedVersions = ['v1'];
  const version = req.path.split('/')[1]; // Gets version from /v1/users

  if (version && version.startsWith('v') && !supportedVersions.includes(version)) {
    return res.status(400).json({
      error: {
        message: `API version '${version}' is not supported`,
        status: 400,
        supportedVersions
      }
    });
  }
  next();
};

// Content-Type validation for POST/PUT requests
const validateContentType = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(415).json({
        error: {
          message: 'Content-Type must be application/json',
          status: 415,
          received: contentType || 'none'
        }
      });
    }
  }
  next();
};

// Security headers for API routes
const apiSecurityHeaders = (req, res, next) => {
  // Only set headers if response hasn't started
  if (!res.headersSent) {
    // Remove X-Powered-By header
    res.removeHeader('X-Powered-By');
    
    // Add API-specific security headers
    res.setHeader('X-API-Version', 'v1');
    res.setHeader('X-RateLimit-Applied', 'true');
    
    // Prevent caching for API responses
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  next();
};

module.exports = {
  apiLimiter,
  authLimiter,
  healthLimiter,
  requestSizeLimiter,
  validateApiVersion,
  validateContentType,
  apiSecurityHeaders
};