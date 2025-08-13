const express = require('express');
const validate = require('../middleware/validate');
const { auth, requireAdmin } = require('../middleware/auth');
const controller = require('../controllers/productController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Product browsing and management
 */

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: List products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Full-text search query
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Paginated product list
 */
router.get('/', controller.list);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get('/:id', controller.get);

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create product (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               category: { type: string }
 *               brand: { type: string }
 *               images: { type: array, items: { type: string } }
 *               stock: { type: integer }
 *     responses:
 *       201:
 *         description: Product created
 *       403:
 *         description: Forbidden
 */
router.post('/', auth, requireAdmin, controller.validateUpsert, validate, controller.create);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     summary: Update product (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Not found
 */
router.put('/:id', auth, requireAdmin, controller.validateUpsert, validate, controller.update);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete product (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Not found
 */
router.delete('/:id', auth, requireAdmin, controller.remove);

module.exports = router;
