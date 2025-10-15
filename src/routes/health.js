const express = require('express');
const { healthCheck, healthCheckSimple } = require('../controllers/healthController');

const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Comprehensive health check
 *     description: Returns detailed health information including database and Redis connectivity
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 *       503:
 *         description: Service is degraded (some components unhealthy)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 *       500:
 *         description: Service error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', healthCheck);

/**
 * @swagger
 * /api/health/simple:
 *   get:
 *     summary: Simple health check
 *     description: Simple endpoint for load balancers and monitoring tools
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is up
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 */
router.get('/simple', healthCheckSimple);

module.exports = router;