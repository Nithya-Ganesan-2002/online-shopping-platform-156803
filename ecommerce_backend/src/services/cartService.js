const ApiError = require('../utils/ApiError');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * PUBLIC_INTERFACE
 * getCart
 * Fetch or create a cart for the user.
 */
async function getCart(userId) {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  const summary = cart.recalc();
  return { cart, summary };
}

/**
 * PUBLIC_INTERFACE
 * addItem
 * Add a product to the cart or increase quantity.
 */
async function addItem(userId, { productId, quantity = 1 }) {
  const product = await Product.findById(productId);
  if (!product || !product.isActive) throw new ApiError(404, 'Product not found');
  if (product.stock < quantity) throw new ApiError(400, 'Insufficient stock');

  const { cart } = await getCart(userId);
  const existing = cart.items.find((i) => i.product.toString() === productId);
  if (existing) {
    existing.quantity += Number(quantity);
  } else {
    cart.items.push({
      product: product._id,
      quantity: Number(quantity),
      priceAtAddition: product.price,
    });
  }
  await cart.save();
  await cart.populate('items.product');
  return { cart, summary: cart.recalc() };
}

/**
 * PUBLIC_INTERFACE
 * updateItem
 * Update quantity of a product in the cart.
 */
async function updateItem(userId, productId, { quantity }) {
  if (quantity < 1) throw new ApiError(422, 'Quantity must be at least 1');
  const { cart } = await getCart(userId);
  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) throw new ApiError(404, 'Item not found in cart');

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');
  if (product.stock < quantity) throw new ApiError(400, 'Insufficient stock');

  item.quantity = Number(quantity);
  await cart.save();
  await cart.populate('items.product');
  return { cart, summary: cart.recalc() };
}

/**
 * PUBLIC_INTERFACE
 * removeItem
 * Remove an item from the cart.
 */
async function removeItem(userId, productId) {
  const { cart } = await getCart(userId);
  const originalLen = cart.items.length;
  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  if (cart.items.length === originalLen) throw new ApiError(404, 'Item not found in cart');
  await cart.save();
  await cart.populate('items.product');
  return { cart, summary: cart.recalc() };
}

/**
 * PUBLIC_INTERFACE
 * clearCart
 * Clear all items from the cart.
 */
async function clearCart(userId) {
  const { cart } = await getCart(userId);
  cart.items = [];
  await cart.save();
  await cart.populate('items.product');
  return { cart, summary: cart.recalc() };
}

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
};
