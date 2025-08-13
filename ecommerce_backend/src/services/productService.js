const ApiError = require('../utils/ApiError');
const Product = require('../models/Product');

/**
 * PUBLIC_INTERFACE
 * listProducts
 * List products with optional search, filtering, and pagination.
 */
async function listProducts({ q, category, minPrice, maxPrice, page = 1, limit = 20 }) {
  const filter = { isActive: true };

  if (q) {
    // Use Mongo text search if index exists
    filter.$text = { $search: q };
  }
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  return {
    items,
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages: Math.ceil(total / Number(limit)),
  };
}

/**
 * PUBLIC_INTERFACE
 * getProduct
 * Retrieve a product by id.
 */
async function getProduct(id) {
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
}

/**
 * PUBLIC_INTERFACE
 * createProduct
 * Create a new product (admin only).
 */
async function createProduct(data) {
  const product = await Product.create(data);
  return product;
}

/**
 * PUBLIC_INTERFACE
 * updateProduct
 * Update an existing product by id (admin only).
 */
async function updateProduct(id, data) {
  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
}

/**
 * PUBLIC_INTERFACE
 * removeProduct
 * Delete a product by id (admin only).
 */
async function removeProduct(id) {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new ApiError(404, 'Product not found');
  return { success: true };
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  removeProduct,
};
