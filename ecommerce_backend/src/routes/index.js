const express = require('express');
const healthController = require('../controllers/health');

const authRoutes = require('./auth.routes');
const productRoutes = require('./products.routes');
const cartRoutes = require('./cart.routes');
const orderRoutes = require('./orders.routes');

const router = express.Router();

// Health endpoint
/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

// API v1 routes
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/products', productRoutes);
router.use('/api/v1/cart', cartRoutes);
router.use('/api/v1/orders', orderRoutes);

module.exports = router;
