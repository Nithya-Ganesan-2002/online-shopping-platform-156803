const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const PaymentInfoSchema = new mongoose.Schema(
  {
    provider: { type: String, required: true },
    status: { type: String, required: true, enum: ['pending', 'authorized', 'captured', 'failed'] },
    transactionId: { type: String },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    shippingAddress: {
      line1: { type: String },
      line2: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    payment: PaymentInfoSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
