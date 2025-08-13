const express = require('express');
const validate = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const controller = require('../controllers/orderController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Order processing and history
 */

/**
 * @swagger
 * /api/v1/orders/checkout:
 *   post:
 *     summary: Checkout current cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   line1: { type: string }
 *                   line2: { type: string }
 *                   city: { type: string }
 *                   state: { type: string }
 *                   postalCode: { type: string }
 *                   country: { type: string }
 *     responses:
 *       201:
 *         description: Order created and paid
 */
router.post('/checkout', auth, controller.validateCheckout, validate, controller.checkout);

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: List my orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Paginated order list
 */
router.get('/', auth, controller.list);

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get my order by id
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get('/:id', auth, controller.get);

module.exports = router;
