const express = require('express');
const validate = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const controller = require('../controllers/cartController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: Shopping cart management
 */

/**
 * @swagger
 * /api/v1/cart:
 *   get:
 *     summary: Get current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User cart
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth, controller.getCart);

/**
 * @swagger
 * /api/v1/cart/items:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId: { type: string }
 *               quantity: { type: integer, default: 1 }
 *     responses:
 *       201:
 *         description: Item added
 */
router.post('/items', auth, controller.validateAdd, validate, controller.addItem);

/**
 * @swagger
 * /api/v1/cart/items/{productId}:
 *   patch:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity: { type: integer }
 *     responses:
 *       200:
 *         description: Item updated
 */
router.patch('/items/:productId', auth, controller.validateUpdate, validate, controller.updateItem);

/**
 * @swagger
 * /api/v1/cart/items/{productId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Item removed
 */
router.delete('/items/:productId', auth, controller.removeItem);

/**
 * @swagger
 * /api/v1/cart:
 *   delete:
 *     summary: Clear cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 */
router.delete('/', auth, controller.clear);

module.exports = router;
