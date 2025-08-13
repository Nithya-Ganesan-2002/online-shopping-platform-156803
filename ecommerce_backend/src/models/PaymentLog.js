const mongoose = require('mongoose');

const PaymentLogSchema = new mongoose.Schema(
  {
    provider: { type: String, required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    request: { type: Object },
    response: { type: Object },
    status: { type: String, enum: ['success', 'failure'], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PaymentLog', PaymentLogSchema);
