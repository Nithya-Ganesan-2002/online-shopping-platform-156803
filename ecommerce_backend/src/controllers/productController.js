const { body } = require('express-validator');
const productService = require('../services/productService');

/**
 * PUBLIC_INTERFACE
 * Validation for create/update product
 */
const validateUpsert = [
  body('name').isString().isLength({ min: 1 }).withMessage('Name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be >= 0'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be >= 0'),
  body('images').optional().isArray(),
];

/**
 * PUBLIC_INTERFACE
 * list
 * List products with optional search and filters
 */
async function list(req, res, next) {
  try {
    const data = await productService.listProducts({
      q: req.query.q,
      category: req.query.category,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      page: req.query.page,
      limit: req.query.limit,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

/**
 * PUBLIC_INTERFACE
 * get
 * Get product by id
 */
async function get(req, res, next) {
  try {
    const product = await productService.getProduct(req.params.id);
    res.json(product);
  } catch (err) {
    next(err);
  }
}

/**
 * PUBLIC_INTERFACE
 * create
 * Create a new product (admin only)
 */
async function create(req, res, next) {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

/**
 * PUBLIC_INTERFACE
 * update
 * Update product (admin only)
 */
async function update(req, res, next) {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (err) {
    next(err);
  }
}

/**
 * PUBLIC_INTERFACE
 * remove
 * Delete product (admin only)
 */
async function remove(req, res, next) {
  try {
    const result = await productService.removeProduct(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateUpsert,
  list,
  get,
  create,
  update,
  remove,
};
