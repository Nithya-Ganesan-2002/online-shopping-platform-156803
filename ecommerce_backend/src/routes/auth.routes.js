const express = require('express');
const validate = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const controller = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: User authentication and profile
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, description: "User's full name" }
 *               email: { type: string, format: email }
 *               password: { type: string, format: password, minLength: 6 }
 *     responses:
 *       201:
 *         description: User registered
 *       409:
 *         description: Email already in use
 */
router.post('/register', controller.validateRegister, validate, controller.register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *     responses:
 *       200:
 *         description: Authenticated
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', controller.validateLogin, validate, controller.login);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *       401:
 *         description: Unauthorized
 */
router.get('/me', auth, controller.me);

module.exports = router;
