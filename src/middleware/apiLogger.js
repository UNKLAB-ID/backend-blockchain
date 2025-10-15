const config = require('../config/config');

// API request logger middleware
const apiLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log request
  if (config.server.env !== 'test') {
    console.log(`📥 [${new Date().toISOString()}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
    
    if (req.body && Object.keys(req.body).length > 0) {
      // Log body but sanitize sensitive data
      const sanitizedBody = { ...req.body };
      if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';
      if (sanitizedBody.token) sanitizedBody.token = '[REDACTED]';
      console.log(`📝 Request Body:`, sanitizedBody);
    }
  }
  
  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(body) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (config.server.env !== 'test') {
      console.log(`📤 [${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
      
      // Log error responses
      if (res.statusCode >= 400) {
        console.log(`❌ Error Response:`, body);
      }
    }
    
    return originalJson.call(this, body);
  };
  
  next();
};

// Request ID middleware for tracing
const addRequestId = (req, res, next) => {
  req.requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Only set header if response hasn't started
  if (!res.headersSent) {
    res.setHeader('X-Request-ID', req.requestId);
  }
  
  next();
};

// Performance monitoring middleware
const performanceMonitor = (req, res, next) => {
  req.startTime = process.hrtime.bigint();
  
  // Override res.end to capture performance before headers are sent
  const originalEnd = res.end;
  res.end = function(...args) {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - req.startTime) / 1000000; // Convert to milliseconds
    
    // Log slow requests (> 1 second)
    if (duration > 1000 && config.server.env !== 'test') {
      console.warn(`🐌 Slow Request: ${req.method} ${req.originalUrl} - ${duration.toFixed(2)}ms`);
    }
    
    // Add performance header only if headers haven't been sent
    if (!res.headersSent) {
      res.setHeader('X-Response-Time', `${duration.toFixed(2)}ms`);
    }
    
    return originalEnd.apply(this, args);
  };
  
  next();
};

module.exports = {
  apiLogger,
  addRequestId,
  performanceMonitor
};