const ApiError = require('../utils/ApiError');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const paymentService = require('./paymentService');

/**
 * PUBLIC_INTERFACE
 * checkout
 * Convert user's cart to an order, capture payment, and clear cart.
 */
async function checkout(user, { shippingAddress }) {
  const cart = await Cart.findOne({ user: user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) throw new ApiError(400, 'Cart is empty');

  // Verify stock and compute totals
  let total = 0;
  for (const item of cart.items) {
    const p = await Product.findById(item.product._id);
    if (!p || !p.isActive) throw new ApiError(400, `Product ${item.product._id} unavailable`);
    if (p.stock < item.quantity) throw new ApiError(400, `Insufficient stock for ${p.name}`);
    total += p.price * item.quantity;
  }

  // Create order in pending status
  const order = await Order.create({
    user: user._id,
    items: cart.items.map((i) => ({
      product: i.product._id,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
    })),
    total,
    status: 'pending',
    shippingAddress: shippingAddress || user.address || {},
    payment: {
      provider: 'mock',
      status: 'pending',
      amount: total,
      currency: process.env.PAYMENT_CURRENCY || 'USD',
    },
  });

  // Capture payment
  const payment = await paymentService.capturePayment({ amount: total, currency: order.payment.currency, orderId: order._id });

  // Update order as paid
  order.payment = payment;
  order.status = 'paid';
  await order.save();

  // Decrement product stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
  }

  // Clear cart
  cart.items = [];
  await cart.save();

  return order;
}

/**
 * PUBLIC_INTERFACE
 * listOrders
 * List all orders of the authenticated user.
 */
async function listOrders(userId, { page = 1, limit = 20 }) {
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Order.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Order.countDocuments({ user: userId }),
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
 * getOrder
 * Retrieve an order by id if it belongs to the user.
 */
async function getOrder(userId, id) {
  const order = await Order.findOne({ _id: id, user: userId });
  if (!order) throw new ApiError(404, 'Order not found');
  return order;
}

module.exports = {
  checkout,
  listOrders,
  getOrder,
};
