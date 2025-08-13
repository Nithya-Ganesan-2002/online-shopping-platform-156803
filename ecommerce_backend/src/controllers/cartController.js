const { body } = require('express-validator');
const cartService = require('../services/cartService');

/**
 * PUBLIC_INTERFACE
 * Validation rules for cart operations
 */
const validateAdd = [
  body('productId').isMongoId().withMessage('Valid productId is required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be >= 1'),
];

const validateUpdate = [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be >= 1'),
];

/**
 * PUBLIC_INTERFACE
 * getCart
 * Retrieve the authenticated user's cart
 */
async function getCart(req, res, next) {
  try {
    const data = await cartService.getCart(req.user._id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

/**
 * PUBLIC_INTERFACE
 * addItem
 * Add a product to the cart
 */
async function addItem(req, res, next) {
  try {
    const data = await cartService.addItem(req.user._id, req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}

/**
 * PUBLIC_INTERFACE
 * updateItem
 * Update quantity of a product in the cart
 */
async function updateItem(req, res, next) {
  try {
    const data = await cartService.updateItem(req.user._id, req.params.productId, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

/**
 * PUBLIC_INTERFACE
 * removeItem
 * Remove a product from the cart
 */
async function removeItem(req, res, next) {
  try {
    const data = await cartService.removeItem(req.user._id, req.params.productId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

/**
 * PUBLIC_INTERFACE
 * clear
 * Clear the cart
 */
async function clear(req, res, next) {
  try {
    const data = await cartService.clearCart(req.user._id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateAdd,
  validateUpdate,
  getCart,
  addItem,
  updateItem,
  removeItem,
  clear,
};
