const {
  apiLimiter,
  healthLimiter,
  requestSizeLimiter,
  validateApiVersion,
  validateContentType,
  apiSecurityHeaders
} = require('../../src/middleware/routeSecurity');

describe('Route Security Middleware', () => {
  describe('requestSizeLimiter', () => {
    it('should pass for normal sized requests', () => {
      const req = global.testUtils.createMockReq({
        headers: { 'content-length': '1024' } // 1KB
      });
      const res = global.testUtils.createMockRes();
      const next = global.testUtils.createMockNext();

      requestSizeLimiter(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject oversized requests', () => {
      const req = global.testUtils.createMockReq({
        headers: { 'content-length': '20971520' } // 20MB
      });
      const res = global.testUtils.createMockRes();
      const next = global.testUtils.createMockNext();

      requestSizeLimiter(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(413);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          message: 'Request entity too large',
          status: 413,
          maxSize: '10MB'
        }
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validateApiVersion', () => {
    it('should pass for supported API version', () => {
      const req = global.testUtils.createMockReq({
        path: '/v1/users'
      });
      const res = global.testUtils.createMockRes();
      const next = global.testUtils.createMockNext();

      validateApiVersion(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject unsupported API version', () => {
      const req = global.testUtils.createMockReq({
        path: '/v2/users'
      });
      const res = global.testUtils.createMockRes();
      const next = global.testUtils.createMockNext();

      validateApiVersion(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          message: "API version 'v2' is not supported",
          status: 400,
          supportedVersions: ['v1']
        }
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should pass for non-versioned paths', () => {
      const req = global.testUtils.createMockReq({
        path: '/health'
      });
      const res = global.testUtils.createMockRes();
      const next = global.testUtils.createMockNext();

      validateApiVersion(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('validateContentType', () => {
    it('should pass for GET requests', () => {
      const req = global.testUtils.createMockReq({
        method: 'GET'
      });
      const res = global.testUtils.createMockRes();
      const next = global.testUtils.createMockNext();

      validateContentType(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should pass for POST requests with correct content-type', () => {
      const req = global.testUtils.createMockReq({
        method: 'POST',
        headers: { 'content-type': 'application/json' }
      });
      const res = global.testUtils.createMockRes();
      const next = global.testUtils.createMockNext();

      validateContentType(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject POST requests with wrong content-type', () => {
      const req = global.testUtils.createMockReq({
        method: 'POST',
        headers: { 'content-type': 'text/plain' }
      });
      const res = global.testUtils.createMockRes();
      const next = global.testUtils.createMockNext();

      validateContentType(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(415);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          message: 'Content-Type must be application/json',
          status: 415,
          received: 'text/plain'
        }
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('apiSecurityHeaders', () => {
    it('should add security headers', () => {
      const req = global.testUtils.createMockReq();
      const res = global.testUtils.createMockRes();
      const next = global.testUtils.createMockNext();

      apiSecurityHeaders(req, res, next);
      
      expect(res.removeHeader).toHaveBeenCalledWith('X-Powered-By');
      expect(res.setHeader).toHaveBeenCalledWith('X-API-Version', 'v1');
      expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Applied', 'true');
      expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache, no-store, must-revalidate');
      expect(res.setHeader).toHaveBeenCalledWith('Pragma', 'no-cache');
      expect(res.setHeader).toHaveBeenCalledWith('Expires', '0');
      expect(next).toHaveBeenCalled();
    });
  });
});