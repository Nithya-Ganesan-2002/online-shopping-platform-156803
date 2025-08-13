const { body } = require('express-validator');
const authService = require('../services/authService');

/**
 * PUBLIC_INTERFACE
 * validation rules for auth endpoints
 */
const validateRegister = [
  body('name').isString().isLength({ min: 2 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
];

/**
 * PUBLIC_INTERFACE
 * register
 * Register a new user and return JWT token
 */
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register({ name, email, password });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * PUBLIC_INTERFACE
 * login
 * Authenticate user and return JWT token
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * PUBLIC_INTERFACE
 * me
 * Return current authenticated user's profile
 */
async function me(req, res, next) {
  try {
    const profile = await authService.getProfile(req.user._id);
    res.status(200).json({ user: profile });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateRegister,
  validateLogin,
  register,
  login,
  me,
};
