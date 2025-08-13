const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtAddition: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [CartItemSchema],
  },
  { timestamps: true, versionKey: false }
);

/**
 * PUBLIC_INTERFACE
 * recalc
 * Recalculate totals for the cart and return summary information.
 */
CartSchema.methods.recalc = function () {
  const subtotal = this.items.reduce((sum, i) => sum + i.priceAtAddition * i.quantity, 0);
  const itemCount = this.items.reduce((sum, i) => sum + i.quantity, 0);
  return { subtotal, itemCount };
};

module.exports = mongoose.model('Cart', CartSchema);
