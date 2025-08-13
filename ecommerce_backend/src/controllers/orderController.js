const { body } = require('express-validator');
const orderService = require('../services/orderService');

/**
 * PUBLIC_INTERFACE
 * Validation for checkout request
 */
const validateCheckout = [
  body('shippingAddress').optional().isObject(),
];

/**
 * PUBLIC_INTERFACE
 * checkout
 * Checkout the cart and create a paid order
 */
async function checkout(req, res, next) {
  try {
    const order = await orderService.checkout(req.user, req.body || {});
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

/**
 * PUBLIC_INTERFACE
 * list
 * List user's orders
 */
async function list(req, res, next) {
  try {
    const data = await orderService.listOrders(req.user._id, { page: req.query.page, limit: req.query.limit });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

/**
 * PUBLIC_INTERFACE
 * get
 * Get a specific order by id (must belong to the user)
 */
async function get(req, res, next) {
  try {
    const order = await orderService.getOrder(req.user._id, req.params.id);
    res.json(order);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateCheckout,
  checkout,
  list,
  get,
};
